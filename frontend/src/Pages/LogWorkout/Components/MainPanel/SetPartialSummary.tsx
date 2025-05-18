import type { Unit } from "../../../../Tools/constants";

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
    <div className="w-full h-full rounded-3xl text-xl font-inter font-extralight text-black bg-indigo-ogg-0 flex justify-center items-center p-2">
      {`${exerciseName} ${repCount}x @ ${weight}${unit}`}
    </div>
  );
}
