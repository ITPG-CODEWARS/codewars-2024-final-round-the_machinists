"use client";

import SearchLocation from "./components/Home/SearchLocation";
import MapboxLocation from "./components/Home/MapboxLocation";
import React, { useState } from "react";

export default function Home() {
  const [location, setLocation] = useState<string | null>(null);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
      <div className="">
        <SearchLocation onLocationSelect={setLocation} />
      </div>
      <div className="col-span-2">
        <MapboxLocation location={location} />
      </div>
    </div>
  );
}
