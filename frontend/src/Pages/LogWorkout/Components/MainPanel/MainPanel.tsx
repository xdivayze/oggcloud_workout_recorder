import { useContext, type RefObject } from "react";
import MiniPanel from "./MiniPanel";
import {
  MainPanelRefContext,
  type MainPanelRefContextType,
} from "../MainPanelWrapper";

export default function MainPanel() {
  const {
    exerciseChooseDivRef,
    setNumberDivRef,
    repWeightRef,
    weightUnitRef,
    repCountRef,
  } = useContext(MainPanelRefContext) as MainPanelRefContextType;
  return (
    <div className=" overflow-y-auto touch-pan-y h-full w-full rounded-3xl bg-gray-ogg-1 p-5 flex items-center flex-col">
      <div onClick={() => {}} className="h-14 w-full mb-4">
        <MiniPanel
          placeholderText="Choose Exercise"
          ref={exerciseChooseDivRef}
          color="bg-gray-ogg-2"
        />
      </div>
      <div className="flex-row justify-between items-center pl-1 flex w-full font-inter font-light text-2xl mb-4 ">
        <div> Current Set</div>
        <div className="h-11 w-1/6">
          <MiniPanel
            color="bg-gray-ogg-2"
            ref={setNumberDivRef}
            placeholderText="0"
          />
        </div>
      </div>
      <div className="flex-row flex justify-between w-full font-inter font-light text-2xl mb-4">
        <div className="h-11 w-1/3 text-white cursor-pointer">
          <MiniPanel
            contentEditable={false}
            placeholderText="Add"
            color="bg-blue-ogg-0"
          />
        </div>
        <div className="h-11 w-1/6">
          <MiniPanel
            ref={repWeightRef}
            placeholderText="50"
            color="bg-gray-ogg-2"
          />
        </div>
        <div className="h-11 w-1/6  ">
          <MiniPanel
            ref={weightUnitRef}
            placeholderText="kg"
            color="bg-gray-ogg-2"
          />
        </div>
        <div className="h-11 w-1/6">
          <MiniPanel
            ref={repCountRef}
            placeholderText="12"
            color="bg-gray-ogg-2"
          />
        </div>
      </div>
      <div className="h-11 w-full mb-4  text-white cursor-pointer mt-auto">
        <MiniPanel
          color="bg-blue-ogg-0"
          contentEditable={false}
          placeholderText="Finish"
        />
      </div>
    </div>
  );
}
