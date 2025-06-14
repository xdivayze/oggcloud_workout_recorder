import { useContext, useRef, useState, type RefObject } from "react";
import ChooseExerciseMenu from "../../LogWorkout/Components/MainPanel/ChooseExerciseMenu/ChooseExerciseMenu";

import DatePanel from "./DatePanel";
import { FetchWorkoutPlots } from "./Service";
import { authContext } from "../../SecurityContext";
import MiniPanel from "../../LogWorkout/Components/MainPanel/MiniPanel";

export default function MainPanel() {
  const exerciseChooseDivRef = useRef<HTMLDivElement | null>(
    null
  ) as RefObject<HTMLDivElement>;
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [fetching, setFetching] = useState<boolean>(false);
  const [imageSrcs, setImageSrcs] = useState<Array<string> | null>(null);
  const [_, setSelectedExercise] = useState<string | null>("");
  const authContextFetched = useContext(authContext);

  const onFetchClick = () => {
    const selectedExercise = exerciseChooseDivRef.current?.innerText;
    if (startDate && endDate && selectedExercise && !fetching) {
      FetchWorkoutPlots(
        startDate,
        endDate,
        selectedExercise,
        setFetching,
        setImageSrcs,
        authContextFetched?.authCode as string,
        authContextFetched?.loginID as string
      );
    }
  };

  return (
    <div
      className=" overflow-y-auto h-full w-full rounded-3xl
     bg-gray-ogg-1 p-5 flex items-center flex-col "
    >
      <div className=" min-h-14 w-full mb-4 cursor-pointer ">
        <ChooseExerciseMenu
          itemSelectEffectCallback={(item: string) => {
            setSelectedExercise(item);
            setImageSrcs(null); // Reset images when a new exercise is selected
          }}
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
      <div
        className="w-full min-h-14 mb-4 cursor-pointer"
        onClick={onFetchClick}
      >
        <MiniPanel
          contentEditable={false}
          placeholderText="Fetch"
          color="bg-blue-ogg-0 text-white"
        />
      </div>
      <div
        className="w-full items-center flex flex-col flex-grow bg-gray-ogg-2
       shadow-black/30 shadow-md rounded-2xl overflow-y-auto"
      >
        {imageSrcs &&
          imageSrcs.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Workout ${index + 1}`}
              className="w-full h-auto mb-2 rounded-lg shadow-md"
            />
          ))}
      </div>
    </div>
  );
}
