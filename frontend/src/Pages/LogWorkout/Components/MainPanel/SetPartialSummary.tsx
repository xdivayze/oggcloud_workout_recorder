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
    <div className="w-full h-full rounded-xl font-inter font-light text-black bg-gray-ogg-2">
      {`${exerciseName} ${repCount}x @ ${weight}${unit}`}
    </div>
  );
}
