import { useRef, useState, type RefObject } from "react";
import ChooseExerciseMenu from "../../LogWorkout/Components/MainPanel/ChooseExerciseMenu/ChooseExerciseMenu";

import DatePanel from "./DatePanel";

export default function MainPanel() {
  const exerciseChooseDivRef = useRef<HTMLDivElement | null>(
    null
  ) as RefObject<HTMLDivElement>;
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  return (
    <div
      className=" overflow-y-auto h-full w-full rounded-3xl
     bg-gray-ogg-1 p-5 flex items-center flex-col "
    >
      <div className=" min-h-14 w-full mb-4 cursor-pointer ">
        <ChooseExerciseMenu
          externalExerciseChooseDivRef={exerciseChooseDivRef}
        />
      </div>
      <div className="min-h-14 w-full mb-4  flex flex-row justify-between items-center">
        <div className="w-1/2 mr-1 h-full ">
          <DatePanel
            nWeeksBack={6}
            text="Start Date"
            onChange={(d) => setStartDate(d)}
          />
        </div>
        <div className="w-1/2 ml-1 h-full ">
          <DatePanel
            nWeeksBack={6}
            text="End Date"
            onChange={(d) => setEndDate(d)}
          />
        </div>
      </div>
    </div>
  );
}
