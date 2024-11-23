import React, { useState } from "react";
import LocationSvg from "../../../public/location.svg";
import DestinationSvg from "../../../public/destination.svg";
import mapboxSdk from "@mapbox/mapbox-sdk";
import mapboxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";

type LocationInputProps = {
  type: string;
  onSelect: (location: string) => void;
};

const mapboxClient = mapboxSdk({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
});
const geocodingService = mapboxGeocoding(mapboxClient);

function LocationInput({ type, onSelect }: LocationInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value) {
      try {
        const response = await geocodingService
          .forwardGeocode({
            query: value,
            types: ["place", "postcode"],
          })
          .send();

        if (response && response.body && response.body.features.length > 0) {
          setSuggestions(
            response.body.features.map((feature) => feature.place_name)
          );
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Geocoding error:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="bg-slate-200 p-2 rounded-lg mt-3 flex flex-col">
      <div className="flex items-center gap-4">
        {type === "location" ? (
          <LocationSvg width={30} height={30} />
        ) : type === "destination" ? (
          <DestinationSvg width={30} height={30} />
        ) : null}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={
            type === "location" ? "From Station/Stop" : "To Station/Stop"
          }
          className="bg-transparent w-full outline-none"
        />
      </div>
      {suggestions.length > 0 && (
        <ul className="mt-2">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-300 rounded-md"
              onClick={() => {
                setInputValue(suggestion);
                setSuggestions([]);
                onSelect(suggestion);
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LocationInput;
