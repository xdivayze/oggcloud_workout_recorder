import { useContext, useEffect, useState, type FormEvent } from "react";
import { fetchExerciseList } from "./Service";
import {
  authContext,
  type SecurityContextType,
} from "../../../../SecurityContext";
import { useDebouncedValue } from "./useDebouncedValue";

const PLACEHOLDER_TEXT = "Choose Exercise";

export default function ChooseExerciseMenu({
  itemSelectEffectCallback,
  ref,
}: {
  itemSelectEffectCallback?: (item: string, weight: number) => void; //caller function should set own state through callback
  ref: React.RefObject<HTMLDivElement>;
}) {
  const [selected, setSelected] = useState(PLACEHOLDER_TEXT);
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<Map<string, number>>(
    new Map<string, number>()
  );

  const [isItemsBeingFetched, setIsItemsBeingFetched] = useState(false);

  const [inputText, setInputText] = useState("");
  const debouncedInputText = useDebouncedValue(inputText, 300);

  const authContextFetched = useContext(authContext) as SecurityContextType;

  const onSelect = (item: string) => {
    setSelected(item);
    setIsOpen(false);
    const weight = items.get(item) || 0; // get the weight or default to 0 if not found
    if (itemSelectEffectCallback) {
      //if a callback is provided, call it with the selected item
      itemSelectEffectCallback(item, weight);
    }
  };

  const onInput = (e: FormEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setInputText(target.innerText.trim());
  };

  useEffect(() => {
    if (!debouncedInputText.trim() || isItemsBeingFetched) return;
    setIsItemsBeingFetched(true);
    setItems(new Map<string, number>());
    fetchExerciseList(
      debouncedInputText,
      authContextFetched?.authCode,
      authContextFetched?.loginID
    )
      .then((v) => {
        setItems(v);
      })
      .catch((e) => console.error(e))
      .finally(() => {
        setIsItemsBeingFetched(false);
        setItems((prev) => prev.set(debouncedInputText, 0)); // add the input text as an item with a dummy value
        setIsOpen(true);
      });
  }, [debouncedInputText]);

  let count = 0;
  return (
    <div className="h-full w-full relative inline-block">
      <div
        ref={ref}
        onBlur={(e) => {
          setTimeout(() => {
            e.target.innerText = e.target.innerText.trim() || PLACEHOLDER_TEXT;
            onSelect(e.target.innerText);
          }, 100);
        }}
        onClick={(e) => {
          if (!isItemsBeingFetched) {
            fetchExerciseList(
              "",
              authContextFetched?.authCode,
              authContextFetched?.loginID
            )
              .then((v) => {
                setItems(v);
              })
              .catch((e) => console.error(e))
              .finally(() => {
                setIsItemsBeingFetched(false);

                setIsOpen(true);
              });
          }

          const target = e.target as HTMLDivElement;
          target.innerText = "";
        }}
        onInput={onInput}
        className={`h-full w-full bg-gray-ogg-2 shadow-black/30 shadow-sm rounded-2xl font-inter 
        font-light px-2 pb-1 text-2xl items-center justify-center flex`}
        contentEditable={true}
        suppressContentEditableWarning
      >
        {selected}
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
          {!isItemsBeingFetched &&
            Array.from(items.keys()).map((item) => {
              count += 1;
              return (
                <div
                  className={`${
                    count % 2 == 0 ? "bg-gray-ogg-1" : "bg-gray-ogg-2"
                  }`}
                  key={item}
                  onClick={() => {
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
