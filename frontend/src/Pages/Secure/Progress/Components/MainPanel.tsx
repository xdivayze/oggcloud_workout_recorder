import { useRef, type RefObject } from "react";
import ChooseExerciseMenu from "../../LogWorkout/Components/MainPanel/ChooseExerciseMenu/ChooseExerciseMenu";

export default function MainPanel() {
  const exerciseChooseDivRef = useRef<HTMLDivElement | null>(null) as RefObject<HTMLDivElement> 
  return (
    <div
      className=" overflow-y-auto h-full w-full rounded-3xl
     bg-gray-ogg-1 p-5 flex items-center flex-col shadow-2xl"
    >
      <div className=" min-h-14 w-full mb-4 cursor-pointer">
        <ChooseExerciseMenu externalExerciseChooseDivRef={exerciseChooseDivRef} />
      </div>
    </div>
  );
}
