import React from "react";
import Image from "next/image";

function TrainItem({ train }: { train: any }) {
  console.log(train);
  return (
    <div>
      <div className="flex items-center justify-between mt-5">
        <div className="flex items-center gap-5">
          <Image
            src={train.image}
            alt={"image of a train"}
            width={100}
            height={100}
          />
          <div>
            <h2 className="font-semibold text-[18px] flex gap-3 items-center">
              {train.name}
            </h2>
            <p>{train.desc}</p>
          </div>
        </div>
        <h2 className="text-[18px] font-semibold">
          {train.cost.toFixed(2)} лв.
        </h2>
      </div>
    </div>
  );
}

export default TrainItem;
