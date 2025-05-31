import { useContext, type ReactNode } from "react";
import { authContext } from "./SecurityContext";
import { Outlet } from "react-router-dom";

export default function ProtectedWrapper() {
  const context = useContext(authContext);
  try {
    if (!context) {
      throw "context not in security context";
    }
    if (context.authCode === "" || context.expiresAt < new Date()) {
      throw "auth code expired";
    }
  } catch (e) {
    return (
      <div className="text-center mt-[25px] font-bold w-full text-3xl font-inter">
        401 UNAUTHORIZED
      </div>
    );
  }
  return <Outlet />;
}
