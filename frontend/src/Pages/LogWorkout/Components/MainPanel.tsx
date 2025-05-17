import { useRef, type RefObject } from "react";
import MiniPanel from "./MiniPanel";

export default function MainPanel() {
  const exerciseChooseDivRef = useRef<HTMLDivElement>(
    null
  ) as RefObject<HTMLDivElement>;
  const setNumberDivRef = useRef<HTMLDivElement>(
    null
  ) as RefObject<HTMLDivElement>;

  const repWeightRef = useRef<HTMLDivElement>(
    null
  ) as RefObject<HTMLDivElement>;

  const weightUnitRef = useRef<HTMLDivElement>(
    null
  ) as RefObject<HTMLDivElement>;

  const repCountRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;

  return (
    <div className="h-full w-full rounded-3xl bg-gray-ogg-1 p-5 flex items-center flex-col">
      <div className="h-14 w-full mb-4">
        <MiniPanel
          placeholderText="Choose Exercise"
          ref={exerciseChooseDivRef}
          color="bg-gray-ogg-0"
        />
      </div>
      <div className="flex-row justify-between items-center pl-1 flex w-full font-inter font-light text-2xl mb-4 ">
        <div> Current Set</div>
        <div className="h-11 w-11">
          <MiniPanel
            color="bg-gray-ogg-0"
            ref={setNumberDivRef}
            placeholderText="0"
          />
        </div>
      </div>
      <div className="flex-row flex justify-between w-full font-inter font-light text-2xl mb-4">
        <div className="h-11 w-1/3 text-white cursor-pointer">
          <MiniPanel ref={null} placeholderText="Add" color="bg-blue-ogg-0" />
        </div>
        <div className="h-11 w-1/6">
          <MiniPanel
            ref={repWeightRef}
            placeholderText="50"
            color="bg-gray-ogg-0"
          />
        </div>
        <div className="h-11 w-1/6  ">
          <MiniPanel
            ref={weightUnitRef}
            placeholderText="kg"
            color="bg-gray-ogg-0"
          />
        </div>
        <div className="h-11 w-1/6">
          <MiniPanel
            ref={repCountRef}
            placeholderText="12"
            color="bg-gray-ogg-0"
          />
        </div>
      </div>
    </div>
  );
}
