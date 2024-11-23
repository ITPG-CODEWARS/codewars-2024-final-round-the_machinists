const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    trainTitle: {
      type: String,
      required: true,
      trim: true,
    },
    trainDescription: {
      type: String,
      required: true,
      trim: true,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["used", "unused"],
      default: "unused",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ticket", ticketSchema);
