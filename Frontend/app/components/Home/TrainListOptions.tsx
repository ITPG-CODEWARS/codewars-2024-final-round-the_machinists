import React, { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import TrainItem from "./TrainItem";
import BuyTicketModal from "./BuyTicketModal";
import { TrainData } from "@/utils/TrainsData";

const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decodedToken = jwt.decode(token);
    return decodedToken?.user_id || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const createTicket = async (train, from, to, userId) => {
  const response = await fetch("http://localhost:5000/api/ticket", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      trainName: train.name,
      trainDescription: train.desc,
      from: from,
      to: to,
      userId: userId,
    }),
  });

  if (response.ok) {
    const ticket = await response.json();
    return ticket.newTicket;
  } else {
    const error = await response.json();
    throw new Error(error.message || "Error creating ticket");
  }
};

type TrainListOptionsProps = {
  from: string;
  to: string;
};

function TrainListOptions({ from, to }: TrainListOptionsProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [ticket, setTicket] = useState<any | null>(null);
  const [trains, setTrains] = useState<any[]>([]);
  const userId = getUserIdFromToken(); // Extract user ID from token

  useEffect(() => {
    setTrains(TrainData);
  }, [from, to]);

  const handleBuyClick = async (train: any) => {
    try {
      if (!userId) {
        throw new Error("User not authenticated");
      }
      const createdTicket = await createTicket(train, from, to, userId);
      setTicket(createdTicket);
      setModalOpen(true);
    } catch (error) {
      console.error("Error buying ticket:", error);
      alert(error.message);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="mt-5 p-5">
      <h2 className="text-[22px] font-bold">Available Trains</h2>

      <div className="overflow-auto h-[250px]">
        {trains.map((item, index) => (
          <div
            key={index}
            className={`cursor-pointer p-2 px-3 rounded-md border-black hover:bg-gray-200 ${
              activeIndex === index ? "border-[3px]" : ""
            }`}
            onClick={() => setActiveIndex(index)}
          >
            <TrainItem train={item} />
          </div>
        ))}
      </div>

      {activeIndex !== null && (
        <div className="mt-5 w-3/5 mx-auto mt-3">
          <button
            className="p-3 w-full bg-green-600 text-white rounded-lg hover:bg-green-700"
            onClick={() => handleBuyClick(trains[activeIndex])}
          >
            Buy Ticket
          </button>
        </div>
      )}

      {ticket && (
        <BuyTicketModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          trainName={ticket.trainTitle}
          trainDesc={ticket.trainDescription}
          finalURL={`http://localhost:5000/ticket/${ticket._id}/use`}
        />
      )}
    </div>
  );
}

export default TrainListOptions;
