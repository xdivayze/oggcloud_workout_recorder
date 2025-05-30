import { useRef, type RefObject } from "react";
import MiniPanel from "../../LogWorkout/Components/MainPanel/MiniPanel";
import { DoLogin } from "./Service";

export default function MainPanel() {
  const idRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;
  const passwordRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;
  return (
    <div
      className=" overflow-y-auto h-full w-full rounded-3xl
     bg-gray-ogg-1 p-5 flex items-center flex-col shadow-2xl"
    >
      <div
        className="text-3xl font-inter
          text-center w-full font-light"
      >
        Login
      </div>
      <div className="w-full h-15 mt-[24px]">
        <MiniPanel
          ref={idRef}
          placeholderText="enter your identifier"
          color="bg-gray-ogg-2"
          contentEditable={true}
        />
      </div>
      <div className="w-full h-15 mt-4">
        <MiniPanel
          ref={passwordRef}
          placeholderText="enter your password"
          color="bg-gray-ogg-2"
          contentEditable={true}
        />
      </div>
      <div
        className="w-full h-15 mt-[50px]"
        onClick={() => {
          //!func comp not being called
          <DoLogin 
            id={idRef.current.innerText}
            password={passwordRef.current.innerText}
          />;
        }}
      >
        <MiniPanel
          placeholderText="Continue"
          color="bg-blue-ogg-0 text-white cursor-pointer shadow-xl"
          contentEditable={false}
        />
      </div>
    </div>
  );
}
