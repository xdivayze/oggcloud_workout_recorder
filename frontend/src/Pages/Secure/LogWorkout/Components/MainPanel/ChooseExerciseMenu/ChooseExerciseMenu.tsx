import { useContext,  useState, type FormEvent } from "react";
import { fetchExerciseList } from "./Service";
import {
  authContext,
  type SecurityContextType,
} from "../../../../SecurityContext";

const PLACEHOLDER_TEXT = "Choose Exercise";

export default function ChooseExerciseMenu({
  itemSelectEffectCallback,
}: {
  itemSelectEffectCallback?: (item: string) => void; //caller function should set own state through callback
}) {
  const [selected, setSelected] = useState(PLACEHOLDER_TEXT);
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<string[]>([]);

  const [isItemsBeingFetched, setIsItemsBeingFetched] = useState(false);

  const authContextFetched = useContext(authContext) as SecurityContextType;

  const onSelect = (item: string) => {
    setSelected(item);
    if (itemSelectEffectCallback) {
      //if a callback is provided, call it with the selected item
      itemSelectEffectCallback(selected);
    }
  };

  const onInput = (e: FormEvent<HTMLDivElement>) => {
    if (!isItemsBeingFetched) {
      setItems([]);
      const target = e.target as HTMLDivElement;
      const text = target.innerText;
      fetchExerciseList(
        text,
        authContextFetched?.authCode,
        authContextFetched?.loginID
      )
        .then((v) => {
          setItems(v);
        })
        .catch((e) => console.error(e))
        .finally(() => {
          setItems((prev) => [text, ...prev]);
          setIsItemsBeingFetched(false);
        });

      setIsOpen(true);
    }
  };

  let count = 0;
  return (
    <div className="h-full w-full relative inline-block">
      <div
        onBlur={(e) => {
          setTimeout(() => {
            e.target.innerText = e.target.innerText.trim() || PLACEHOLDER_TEXT;
          setSelected(e.target.innerText);
          setIsOpen(false);
          },100)
          
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
            items.map((item) => {
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
