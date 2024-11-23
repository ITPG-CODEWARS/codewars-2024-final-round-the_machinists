const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const User = require("./user");
const Ticket = require("./ticket"); // Import Ticket model
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/easirail")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

// Authentication middleware for JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.sendStatus(403);
  }

  jwt.verify(token, "your_jwt_secret_here_123!@#", (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

// Registration route
app.post("/auth/register", async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({ ...req.body, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login route
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { user_id: user._id, username: user.username, is_admin: user.is_admin },
      "your_jwt_secret_here_123!@#",
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get user data route
app.get("/auth/me", authenticateJWT, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });

    if (!user) {
      return res.sendStatus(404);
    }

    const { password, ...userData } = user.toObject();
    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

app.post("/api/ticket", authenticateJWT, async (req, res) => {
  try {
    const { trainName, trainDescription, from, to } = req.body;

    // Create the new ticket using the Ticket model
    const newTicket = new Ticket({
      trainTitle: trainName,
      trainDescription: trainDescription,
      from: from,
      to: to,
      user_id: req.user.user_id,
    });

    // Save the new ticket
    await newTicket.save();

    // Find the user and add the new ticket to the user's tickets array
    const user = await User.findById(req.user.user_id);

    // Add the new ticket to the user's tickets array

    user.tickets.push(newTicket._id);
    await user.save();

    res.status(201).json({ newTicket });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating ticket", error: err.message });
  }
});

// Get all tickets for the authenticated user
app.get("/me/tickets", authenticateJWT, async (req, res) => {
  try {
    // Fetch the tickets associated with the authenticated user
    const user = await User.findById(req.user.user_id).populate("tickets");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.tickets);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving tickets", error: err.message });
  }
});

// Use a ticket route (mark as 'used')
app.get("/ticket/:id/use", async (req, res) => {
  const ticketId = req.params.id;

  try {
    // Find the ticket by its ID
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Check if the ticket is already marked as 'used'
    if (ticket.status === "used") {
      return res.status(400).json({ message: "Ticket is already used" });
    }

    // Update the ticket status to 'used'
    ticket.status = "used";
    await ticket.save();

    res.status(200).json({ message: "Ticket used successfully", ticket });
  } catch (err) {
    res.status(500).json({ message: "Error using ticket", error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
