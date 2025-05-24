import { useState, type RefObject } from "react";

interface IDropdownFeatures {
  items: string[];
  onSelect: (item: string) => void;
}

export default function MiniPanel({
  color,
  placeholderText,
  ref,
  contentEditable = true,
  numeric = false,
  dropdownFeatures,
}: {
  color: string;
  placeholderText: string;
  ref?: RefObject<HTMLDivElement>;
  contentEditable?: boolean;
  numeric?: boolean;
  dropdownFeatures?: IDropdownFeatures;
}) {
  const [selected, setSelected] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  let count = 0;
  return (
    <div className="h-full w-full relative inline-block">
      <div
        className={`h-full w-full ${color} rounded-2xl font-inter 
        font-light px-2 pb-1 text-2xl items-center justify-center flex`}
        contentEditable={contentEditable}
        suppressContentEditableWarning
        ref={ref}
        inputMode={numeric ? "numeric" : "text"}
        onClick={(e) => {
          if (dropdownFeatures !== undefined) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        {selected !== "" ? selected : placeholderText}
      </div>

      <div
        className={`${
          isOpen ? "opacity-100 translate-y-0 z-10" : "opacity-0 translate-y-2 z-[-10]"
        } transition-all delay-25 ease-in-out w-full absolute  rounded-xl 
        shadow-lg font-inter font-light bg-gray-ogg-2 border border-gray-300  `}
      >
        <div className=" w-full flex flex-col ">
          {dropdownFeatures?.items.map((item) => {
            count += 1;
            return (
              <div
                className={`${
                  count % 2 == 0 ? "bg-gray-ogg-1" : "bg-gray-ogg-2"
                }`}
                key={item}
                onClick={() => {
                  setSelected(item);
                  setIsOpen(false);
                  dropdownFeatures.onSelect(item);
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
