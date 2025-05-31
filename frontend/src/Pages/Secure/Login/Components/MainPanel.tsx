import { useContext, useEffect, useRef, type RefObject } from "react";
import MiniPanel from "../../LogWorkout/Components/MainPanel/MiniPanel";
import { DoLogin } from "./Service";
import { authContext } from "../../SecurityContext";

export default function MainPanel() {
  const idRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;
  const passwordRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;
  const context = useContext(authContext);
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
          if (!context) {
            throw "function is not within a context provider";
          }
          DoLogin(idRef.current.innerText, passwordRef.current.innerText)
            .catch((e: Error) => {
              console.error(e); //TODO add actual error handling here
              return;
            })
            .then((val) => {
              if (!val) throw "user auth code not returned";
              context.login(val.authCode, val.expiresAt);
            });
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
