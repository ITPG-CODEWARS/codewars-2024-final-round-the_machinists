"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTicket } from "@fortawesome/free-solid-svg-icons";
import BuyTicketModal from "../components/Home/BuyTicketModal";

// Function to fetch tickets using the token directly
const fetchTickets = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`http://localhost:5000/me/tickets`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error fetching tickets");
  }

  const data = await response.json();
  return data;
};

function Me() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    fetchTickets()
      .then((data) => {
        setTickets(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const openModal = (ticket) => {
    // Set the selected ticket and open the modal
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-3xl text-gray-600">Loading tickets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-3xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-3xl text-gray-500">
          You haven't bought a ticket yet!
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-10">
      <h2 className="text-4xl font-semibold text-gray-800 mb-8">
        Your Tickets
      </h2>
      <div className="w-full max-w-4xl px-4">
        {tickets.map((ticket) => (
          <div
            key={ticket._id}
            className="flex items-center justify-between p-6 mb-5 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => openModal(ticket)}
          >
            <div className="flex items-center space-x-4">
              {/* Ticket Icon with conditional color */}
              <FontAwesomeIcon
                icon={faTicket}
                className={`text-4xl ${
                  ticket.status === "used" ? "text-red-600" : "text-green-600"
                }`}
              />
              <div>
                <p className="font-semibold text-lg">{ticket.trainTitle}</p>
                <p className="text-sm text-gray-500">
                  From: {ticket.from} - To: {ticket.to}
                </p>
              </div>
            </div>
            <div>
              <span
                className={`p-3 rounded-full text-white ${
                  ticket.status === "used" ? "bg-red-500" : "bg-green-500"
                }`}
              >
                {ticket.status === "used" ? "Used" : "Unused"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* BuyTicketModal */}
      {selectedTicket && (
        <BuyTicketModal
          isOpen={isModalOpen}
          onClose={closeModal}
          trainName={selectedTicket.trainTitle}
          trainDesc={selectedTicket.trainDescription}
          finalURL={`http://localhost:5000/ticket/${selectedTicket._id}/use`} // Assuming this is the URL to the ticket
        />
      )}
    </div>
  );
}

export default Me;
