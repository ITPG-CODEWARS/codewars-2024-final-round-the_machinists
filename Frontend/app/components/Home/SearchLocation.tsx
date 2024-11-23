"use client";

import React, { useState } from "react";
import LocationInput from "./LocationInput";
import TrainListOptions from "./TrainListOptions";

type SearchLocationProps = {
  onLocationSelect: (location: string | null) => void;
};

function SearchLocation({ onLocationSelect }: SearchLocationProps) {
  const [location, setLocation] = useState<string | null>(null);
  const [destination, setDestination] = useState<string | null>(null);
  const [showTrainList, setShowTrainList] = useState<boolean>(false);

  const handleSelect = (selectedLocation: string) => {
    setLocation(selectedLocation);
    onLocationSelect(selectedLocation);
  };

  const handleDestinationSelect = (selectedDestination: string) => {
    setDestination(selectedDestination);
  };

  const handleSearch = () => {
    if (location && destination) {
      setShowTrainList(true);
    }
  };

  return (
    <div>
      <div className="p-3 md:p-5 border-[2px] rounded-xl pb-4 w-full">
        <p className="text-[24px] font-extrabold mb-4">
          Where are you travelling?
        </p>
        <LocationInput type="location" onSelect={handleSelect} />
        <LocationInput type="destination" onSelect={handleDestinationSelect} />
        <button
          className="p-3 bg-black w-full mt-5 text-white rounded-lg"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      {showTrainList && location && destination ? (
        <TrainListOptions from={location} to={destination} />
      ) : null}
    </div>
  );
}

export default SearchLocation;
