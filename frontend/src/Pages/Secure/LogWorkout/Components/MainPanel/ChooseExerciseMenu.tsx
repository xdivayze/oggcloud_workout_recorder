import { useContext, useEffect, useState } from "react";
import { MainPanelRefContext } from "../MainPanelWrapper";

const CUSTOM_WORKOUT_MENU_ITEM = "Enter Custom Workout";
const CUSTOM_WORKOUT_MENU_ITEM_ONCLICK = "Enter Workout Name";
const PLACEHOLDER_TEXT = "Choose Exercise";

export default function ChooseExerciseMenu({
  includeCustomWorkout = true,
}: {
  includeCustomWorkout?: boolean;
}) {
  const exerciseChooseDivRef =
    useContext(MainPanelRefContext)?.exerciseChooseDivRef;
  const [selected, setSelected] = useState("");
  const [contentEditable, setContentEditable] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const onSelect = (item: string) => {
    let selectedItem = "";
    if (item.trim() === CUSTOM_WORKOUT_MENU_ITEM) {
      selectedItem = CUSTOM_WORKOUT_MENU_ITEM_ONCLICK;
      setContentEditable(true);
    } else {
      selectedItem = item;
    }
    setSelected(selectedItem);
  };

  useEffect(() => {
    if (exerciseChooseDivRef?.current) {
      exerciseChooseDivRef.current.focus();
      if (
        !contentEditable &&
        exerciseChooseDivRef.current.innerText.trim() ===
          CUSTOM_WORKOUT_MENU_ITEM_ONCLICK
      ) {
        exerciseChooseDivRef.current.innerText = "Choose Exercise ";
      }
    }
  }, [contentEditable]);

  const items = ["Fetched Ex-Logged Workouts"];
  includeCustomWorkout ? items.push(CUSTOM_WORKOUT_MENU_ITEM) : {};

  let count = 0;
  return (
    <div className="h-full w-full relative inline-block">
      <div
        className={`h-full w-full bg-gray-ogg-2 shadow-black/30 shadow-sm rounded-2xl font-inter 
        font-light px-2 pb-1 text-2xl items-center justify-center flex`}
        contentEditable={contentEditable}
        suppressContentEditableWarning
        onBlur={() => setContentEditable(false)}
        ref={exerciseChooseDivRef}
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
      >
        {selected !== "" ? selected : PLACEHOLDER_TEXT}
      </div>

      <div
        className={`${
          isOpen
            ? "opacity-100 translate-y-0 z-10"
            : "opacity-0 translate-y-2 z-[-10]"
        } transition-all delay-25 ease-in-out w-full absolute  rounded-xl 
        shadow-lg font-inter font-light bg-gray-ogg-2 border border-gray-300  `}
      >
        <div className=" w-full flex flex-col ">
          {items.map((item) => {
            count += 1;
            return (
              <div
                className={`${
                  count % 2 == 0 ? "bg-gray-ogg-1" : "bg-gray-ogg-2"
                }`}
                key={item}
                onClick={() => {
                  setIsOpen(false);
                  onSelect(item);
                }}
              >
                <span className="p-1">{item}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
