import { useRef } from "react";
import MiniPanel from "../../LogWorkout/Components/MainPanel/MiniPanel";

 //TODO fetch dates from server up to nWeeksBack weeks ago
export default function DatePanel({ 
  nWeeksBack,
  text,
  onChange,
}: {
  nWeeksBack: number;
  text: string;
  onChange: (date: Date) => void;
}) {
  const dateRef = useRef<HTMLDivElement | null>(null) as React.RefObject<HTMLDivElement>;
  return (
    <MiniPanel
      placeholderText={text}
      color="bg-gray-ogg-2 cursor-pointer"
      contentEditable={false}
      ref={dateRef}
      dropdownFeatures={{
        items: GenerateDateArray(nWeeksBack),
        onSelect: (item: string) => {
          // Convert the selected date string back to a Date object
          if (!dateRef.current) throw new Error("dateRef is not set");

          dateRef.current.innerText = item; // Update the displayed date
          const selectedDate = new Date(item);
          onChange(selectedDate);
        },
      }}
    />
  );
}

export function GenerateDateArray(nWeeks: number): string[] {
  const dateArray: string[] = [];
  const today = new Date();
  for (let i = 0; i < nWeeks; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i * 7);
    dateArray.push(date.toISOString().split("T")[0]);
  }
  return dateArray;
}
