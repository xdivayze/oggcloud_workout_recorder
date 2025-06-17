import { useContext, useState } from "react";
import MiniPanel from "./MiniPanel";
import {
  MainPanelRefContext,
  type MainPanelRefContextType,
} from "../MainPanelWrapper";
import ChooseExerciseMenu from "./ChooseExerciseMenu/ChooseExerciseMenu";
import {
  WorkoutSetSchema,
  type LogWorkoutRequestType,
  type WorkoutSetType,
} from "./types";
import SetPartialSummary from "./SetPartialSummary";
import { REQUEST_FIELDNAMES } from "../../../../../Tools/constants";
import { authContext } from "../../../SecurityContext";
import { GenerateDateArray } from "../../../Progress/Components/DatePanel";
import dayjs from "dayjs";

export default function MainPanel() {
  const importedAuthContext = useContext(authContext);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const dates = GenerateDateArray(25, 1); // Generate an array of dates for the last 6 weeks
  dates[0] = "Today"; // Set the first date to "Today"

  const [chosenExercise, setChosenExercise] = useState<string>("");
  const [repWeightPlaceholder, setRepWeightPlaceholder] = useState<number>(0);

  const { setNumberDivRef, repWeightRef, weightUnitRef, repCountRef } =
    useContext(MainPanelRefContext) as MainPanelRefContextType;
  const [partialSums, setPartialSums] = useState<Map<string, WorkoutSetType>>(
    new Map()
  );
  return (
    <div
      className=" overflow-y-auto h-full w-full rounded-3xl
     bg-gray-ogg-1 p-5 flex items-center flex-col shadow-2xl"
    >
      <div className="w-full mb-4 min-h-14 cursor-pointer">
        <MiniPanel
          placeholderText="Today"
          color="bg-gray-ogg-2"
          contentEditable={false}
          dropdownFeatures={{
            items: dates,
            onSelect: (item: string) => {
              if (item !== dayjs(selectedDate).format("YYYY-MM-DD")) {
                setPartialSums(new Map()); // Clear partial sums when date changes
              }
              if (item === "Today") {
                setSelectedDate(new Date());
              } else {
                setSelectedDate(new Date(item));
              }
            },
          }}
        />
      </div>
      <div className="min-h-14 w-full mb-4 cursor-pointer ">
        <ChooseExerciseMenu
          itemSelectEffectCallback={(item, weight) => {
            setChosenExercise(item.trim());
            setRepWeightPlaceholder(weight);
          }}
        />
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
            const psumObj = WorkoutSetSchema.parse({
              repCount: Number(repCountRef.current.innerText.trim()),
              setNo: Number(setNumberDivRef.current.innerText.trim()),
              weight: Number(repWeightRef.current.innerText.trim()),
              unit: weightUnitRef.current.innerText.trim(),
              exerciseName: chosenExercise,
            });
            setPartialSums((prev) => {
              const newMap = new Map(prev);

              newMap.set(
                Math.floor(Math.random() * 10000 + 1).toString(),
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
        <div className={`min-h-11 w-1/6 ${repWeightPlaceholder === 0 && "italic"}`}>
          <MiniPanel
            ref={repWeightRef}
            placeholderText={
              repWeightPlaceholder === 0
                ? "50"
                : repWeightPlaceholder.toString()
            }
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
        <div className="min-h-11 w-1/6 cursor-pointer">
          <MiniPanel
            ref={repCountRef}
            placeholderText="12"
            color="bg-gray-ogg-2"
            contentEditable={false}
            dropdownFeatures={{
              items: Array.from({ length: 20 }, (_, i) => (1 + i).toString()),
              onSelect(item) {
                repCountRef.current.innerText = item;
              },
            }}
          />
        </div>
      </div>
      <div className="flex flex-col w-full mt-7">
        {[...partialSums.entries()].map(([k, c]) => (
          <div key={k} className="h-[70px] w-full mb-3">
            <SetPartialSummary
              setPartialSums={setPartialSums}
              k={k}
              repCount={c.repCount}
              weight={c.weight}
              unit={c.unit}
              exerciseName={c.exerciseName}
              setNo={c.setNo}
            />
          </div>
        ))}
      </div>
      <div
        onClick={() => {
          const body: LogWorkoutRequestType = {
            sets: [...partialSums.values()],
            date: selectedDate, //automatically converted to ISO string by stringify
          };
          fetch("/api/protected/log-workout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              [REQUEST_FIELDNAMES.AUTH_CODE]:
                importedAuthContext?.authCode as string,
              [REQUEST_FIELDNAMES.ID]: importedAuthContext?.loginID as string,
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
