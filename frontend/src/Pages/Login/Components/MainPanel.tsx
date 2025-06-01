import { useContext, useRef, useState, type RefObject } from "react";

import { DoLogin } from "./Service";
import { useNavigate } from "react-router-dom";
import { authContext } from "../../Secure/SecurityContext";
import MiniPanel from "../../Secure/LogWorkout/Components/MainPanel/MiniPanel";

export default function MainPanel() {
  const idRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;
  const passwordRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;
  const context = useContext(authContext);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();
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

      {!loginSuccess && (
        <>
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
              const id = idRef.current.innerText;
              DoLogin(id, passwordRef.current.innerText)
                .catch((e: Error) => {
                  console.error(e); //TODO add actual error handling here
                  return;
                })
                .then((val) => {
                  if (!val) throw "user auth code not returned";
                  context.login(val.authCode, val.expiresAt, id);
                  setLoginSuccess(true);
                  setTimeout(() => {
                    navigate("/log-workout");
                  }, 3000);
                });
            }}
          >
            <MiniPanel
              placeholderText="Continue"
              color="bg-blue-ogg-0 text-white cursor-pointer shadow-xl"
              contentEditable={false}
            />
          </div>
        </>
      )}
      {loginSuccess && (
        <div className="w-full h-15 mt-[24px] text-center text-xl font-inter ">
          Login Success,{" "}
          <span className="text-blue-ogg-0 cursor-pointer">redirecting</span>{" "}
          now...
        </div>
      )}
    </div>
  );
}
