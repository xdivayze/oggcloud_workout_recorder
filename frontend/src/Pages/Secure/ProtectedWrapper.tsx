import { useContext } from "react";
import { authContext } from "./SecurityContext";
import { Outlet, useNavigate } from "react-router-dom";

export default function ProtectedWrapper() {
  const context = useContext(authContext);
  const navigate = useNavigate();
  try {
    if (!context) {
      throw "context not in security context";
    }
    if (context.authCode === "" || context.expiresAt < new Date()) {
      throw "auth code expired";
    }
  } catch (e) {
    setTimeout(() => {
      navigate("/");
    }, 2700);
    // Redirect to login page if auth code is expired or not set
    // Using setTimeout to ensure the redirect happens after the current render cycle
    // And make sure user sees the 401 message
    return (
      <div className="text-center mt-[25px] font-bold w-full text-3xl font-inter">
        401 UNAUTHORIZED 
        <br />
        <br />
        Please log in and try again.
        <br />
        Redirecting to{" "}
        <span className="text-blue-ogg-0 cursor-pointer"> login </span> page...
      </div>
    );
  }
  return <Outlet />;
}
