import type { Unit } from "../../../../../Tools/constants";
import { X } from "lucide-react";

export default function SetPartialSummary({
  repCount,
  weight,
  unit,
  exerciseName,
}: {
  repCount: string;
  weight: number;
  unit: Unit;
  exerciseName: string;
}) {
  return (
    <div
      className="w-full h-full rounded-3xl text-xl 
    font-inter font-extralight text-black bg-indigo-ogg-0 
    flex justify-center items-center p-2"
    >
      {`${exerciseName} ${repCount}x @ ${weight}${unit}`}{" "}
      <X
        className=" cursor-pointer w-6 h-6 ml-2 rounded-md bg-red-800"
        color="black"
      />
    </div>
  );
}
