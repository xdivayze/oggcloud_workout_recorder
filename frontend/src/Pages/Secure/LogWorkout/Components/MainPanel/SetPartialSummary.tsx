import { X } from "lucide-react";
import type { ZUnitType } from "./types";

export default function SetPartialSummary({
  repCount,
  weight,
  unit,
  exerciseName,
  setNo,
}: {
  repCount: number;
  weight: number;
  unit: ZUnitType;
  exerciseName: string;
  setNo: number;
}) {
  return (
    <div
      className="w-full h-full rounded-3xl text-xl 
    font-inter font-extralight text-black bg-indigo-ogg-0 
    flex justify-center items-center p-2 flex-col"
    >
      <div className="font-bold ">{`SET ${setNo}`}</div>
      <div>{`${exerciseName} ${repCount}x @ ${weight}${unit}`} </div>

      <X
        className=" cursor-pointer w-6 h-6 ml-2 rounded-md bg-red-800"
        color="black"
      />
    </div>
  );
}
