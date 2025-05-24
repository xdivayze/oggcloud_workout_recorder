import { useContext, useState, type ReactNode } from "react";
import MiniPanel from "./MiniPanel";
import {
  MainPanelRefContext,
  type MainPanelRefContextType,
} from "../MainPanelWrapper";
import { GeneratePartialSummary } from "./Service";
import ChooseExerciseMenu from "./ChooseExerciseMenu";

export default function MainPanel() {
  const {
    exerciseChooseDivRef,
    setNumberDivRef,
    repWeightRef,
    weightUnitRef,
    repCountRef,
  } = useContext(MainPanelRefContext) as MainPanelRefContextType;
  const [partialSums, setPartialSums] = useState<Map<string, ReactNode>>(
    new Map()
  );
  return (
    <div className=" overflow-y-auto h-full w-full rounded-3xl bg-gray-ogg-1 p-5 flex items-center flex-col shadow-2xl">
      <div className="min-h-14 w-full mb-4 cursor-pointer ">
        <ChooseExerciseMenu />
      </div>
      <div className="flex-row justify-between items-center pl-1 flex w-full font-inter font-light text-2xl mb-4 ">
        <div> Current Set</div>
        <div className="h-11 w-1/6">
          <MiniPanel
            contentEditable={true}
            color="bg-gray-ogg-2"
            ref={setNumberDivRef}
            placeholderText="0"
          />
        </div>
      </div>
      <div className="flex-row flex justify-between w-full font-inter font-light text-2xl mb-4">
        <div
          onClick={(e) => {
            e.preventDefault();
            const psum = <GeneratePartialSummary />;
            setPartialSums((prev) => {
              const newMap = new Map(prev);

              newMap.set(Math.floor(Math.random() * 10 + 1).toString(), psum);
              return newMap;
            });
          }}
          className="min-h-11 w-1/3 text-white cursor-pointer"
        >
          <MiniPanel
            contentEditable={false}
            placeholderText="Add"
            color="bg-blue-ogg-0"
          />
        </div>
        <div className="min-h-11 w-1/6">
          <MiniPanel
            ref={repWeightRef}
            placeholderText="50"
            color="bg-gray-ogg-2"
          />
        </div>
        <div className="min-h-11 w-1/6 cursor-pointer  ">
          <MiniPanel
            ref={weightUnitRef}
            placeholderText="kg"
            color="bg-gray-ogg-2"
            contentEditable={false}
            dropdownFeatures={{
              items: ["kg", "lb"],
              onSelect(item) {
                weightUnitRef.current.innerText = item;
              },
            }}
          />
        </div>
        <div className="min-h-11 w-1/6">
          <MiniPanel
            ref={repCountRef}
            placeholderText="12"
            color="bg-gray-ogg-2"
          />
        </div>
      </div>
      <div className="flex flex-col w-full mt-7">
        {[...partialSums.entries()].map(([k, c]) => (
          <div
            key={k}
            onClick={() => {
              setPartialSums((prev) => {
                const newMap = new Map(prev);
                newMap.delete(k);
                return newMap;
              });
            }}
            className="h-[70px] w-full mb-3"
          >
            {" "}
            {c}{" "}
          </div>
        ))}
      </div>
      <div className="min-h-15 w-full mb-4 sticky text-white cursor-pointer bottom-0">
        <MiniPanel
          color="bg-blue-ogg-0 "
          contentEditable={false}
          placeholderText="Finish"
        />
      </div>
    </div>
  );
}
