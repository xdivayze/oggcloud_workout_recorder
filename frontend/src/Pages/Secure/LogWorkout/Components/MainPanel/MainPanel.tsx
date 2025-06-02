import { useContext, useState } from "react";
import MiniPanel from "./MiniPanel";
import {
  MainPanelRefContext,
  type MainPanelRefContextType,
} from "../MainPanelWrapper";
import ChooseExerciseMenu from "./ChooseExerciseMenu/ChooseExerciseMenu";
import {
  PartialRepSchema,
  type PartialRepArrayType,
  type PartialRepObjectType,
} from "./types";
import SetPartialSummary from "./SetPartialSummary";
import { REQUEST_FIELDNAMES } from "../../../../../Tools/constants";
import { authContext } from "../../../SecurityContext";

//TODO add option to set date

export default function MainPanel() {
  const importedAuthContext = useContext(authContext);

  const {
    exerciseChooseDivRef,
    setNumberDivRef,
    repWeightRef,
    weightUnitRef,
    repCountRef,
  } = useContext(MainPanelRefContext) as MainPanelRefContextType;
  const [partialSums, setPartialSums] = useState<
    Map<string, PartialRepObjectType>
  >(new Map()); 
  return (
    <div
      className=" overflow-y-auto h-full w-full rounded-3xl
     bg-gray-ogg-1 p-5 flex items-center flex-col shadow-2xl"
    >
      <div className="min-h-14 w-full mb-4 cursor-pointer ">
        <ChooseExerciseMenu />
      </div>
      <div className="flex-row cursor-pointer justify-between items-center pl-1 flex w-full font-inter font-light text-2xl mb-4 ">
        <div> Current Set</div>
        <div className="h-11 w-1/6">
          <MiniPanel
            contentEditable={false}
            color="bg-gray-ogg-2"
            ref={setNumberDivRef}
            placeholderText="1"
            dropdownFeatures={{
              items: Array.from({ length: 9 }, (_, i) => (1 + i).toString()),
              onSelect(item) {
                //TODO add feature to store old set partial sums and only show current set's partial sums
                setNumberDivRef.current.innerText = item;
              },
            }}
          />
        </div>
      </div>
      <div className="flex-row flex justify-between w-full font-inter font-light text-2xl mb-4">
        <div
          onClick={(e) => {
            e.preventDefault();
            const psumObj = PartialRepSchema.parse({
              repCount: Number(repCountRef.current.innerText.trim()),
              setNo: Number(setNumberDivRef.current.innerText.trim()),
              weight: Number(repWeightRef.current.innerText.trim()),
              unit: weightUnitRef.current.innerText.trim(),
              exerciseName: exerciseChooseDivRef.current.innerText.trim(),
            });
            setPartialSums((prev) => {
              const newMap = new Map(prev);

              newMap.set(
                Math.floor(Math.random() * 10 + 1).toString(),
                psumObj
              );
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
            <SetPartialSummary
              repCount={c.repCount}
              weight={c.weight}
              unit={c.unit}
              exerciseName={c.exerciseName}
            />
          </div>
        ))}
      </div>
      <div
        onClick={() => {
          const body: PartialRepArrayType = {
            partialSummaries: [...partialSums.values()],
          };
          fetch("/api/user/log-workout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              [REQUEST_FIELDNAMES.AUTH_CODE]:
                importedAuthContext?.authCode as string,
              [REQUEST_FIELDNAMES.ID]: importedAuthContext?.id as string,
            },
            body: JSON.stringify(body),
          })
            .catch((e: Error) => {
              throw e;
            })
            .then((v) => {
              if (!v.ok) {
                throw "returned non-200 code: " + v.status;
              }
              setPartialSums(new Map());
            });
        }}
        className="min-h-15 w-full mb-4 sticky text-white cursor-pointer bottom-0"
      >
        <MiniPanel
          color="bg-blue-ogg-0 "
          contentEditable={false}
          placeholderText="Finish"
        />
      </div>
    </div>
  );
}
