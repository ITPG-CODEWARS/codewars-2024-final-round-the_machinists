"use client";

import React from "react";
import { TrainData } from "@/utils/TrainsData";
function Models() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6 p-6">
      {/* Single row with 3 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
        {TrainData.map((train, index) => (
          <div
            key={train.id}
            className={`bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 
              ${
                index === 1
                  ? "relative z-10 scale-105 border-2 border-transparent border-opacity-80"
                  : ""
              }
              ${index === 1 ? "transform translate-y-[-20px]" : ""}
              ${
                index === 1
                  ? "md:scale-110 md:translate-y-[-30px] md:border-transparent"
                  : ""
              }
            `}
            style={{
              ...(index === 1 && {
                backgroundClip: "border-box",
                background:
                  "linear-gradient(white, white) padding-box, linear-gradient(120deg, #000000, #666666, #000000) border-box", // Adjusted to increase contrast
              }),
            }}
          >
            <div className="w-full h-64 overflow-hidden rounded-t-lg relative">
              <img
                src={train.image}
                alt={train.name}
                className="w-full h-full object-cover"
              />
              {index === 1 && (
                <>
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full transform rotate-[-10deg]">
                    Fastest
                  </div>
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full transform rotate-[8deg]">
                    Most Comfortable
                  </div>
                </>
              )}
            </div>
            <h2 className="text-xl font-semibold mt-4 text-center">
              {train.name}
            </h2>
            <p className="text-gray-600 mt-2 text-center">{train.desc}</p>
            <p className="text-lg font-bold mt-4 text-center">
              ${train.cost.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Models;
