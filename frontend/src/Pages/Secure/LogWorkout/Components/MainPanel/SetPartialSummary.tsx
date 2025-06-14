import { X } from "lucide-react";
import type { WorkoutSetType, ZUnitType } from "./types";
import { useState, type Dispatch, type SetStateAction } from "react";

export default function SetPartialSummary({
  repCount,
  weight,
  unit,
  exerciseName,
  setNo,
  k, // unique key for the set
  setPartialSums,
}: {
  repCount: number;
  weight: number;
  unit: ZUnitType;
  exerciseName: string;
  setNo: number;
  k: string;
  setPartialSums: Dispatch<SetStateAction<Map<string, WorkoutSetType>>>;
}) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      className="w-full h-full rounded-3xl text-xl 
    font-inter  text-black bg-indigo-ogg-0 
     p-2  "
    >
      <div className="w-full h-full flex flex-row justify-center items-center">
        <div className="font-bold text-center ">{`SET ${setNo}`}</div>
        <div
          onClick={() => {
            setShowDetails((prev) => !prev);
          }}
          className="flex w-9/10 flex-col items-center justify-center cursor-pointer h-full"
        >
          <div className="w-full text-center font-light ">{`${exerciseName} `}</div>

          {showDetails && (
            <div className="w-full text-center font-light bg-black/10 rounded-xl shadow-sm shadow-black/20">
              {`${repCount} reps @ ${weight} ${unit}`}
            </div>
          )}
        </div>
        <X
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setPartialSums((prev) => {
              const newMap = new Map(prev);
              newMap.delete(k);
              return newMap;
            });
          }}
          className="cursor-pointer w-8 h-6 ml-2 rounded-md"
          color="black"
        />
      </div>
    </div>
  );
}
