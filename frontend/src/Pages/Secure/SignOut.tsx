import { useContext, useEffect } from "react";
import { authContext } from "./SecurityContext";
import { useNavigate } from "react-router-dom";

export default function SignOut() {
  const navigate = useNavigate();
  const context = useContext(authContext);
  useEffect(() => {
    setTimeout(() => {
      context?.logout();
      navigate("/");
    }, 2000);
  }, []); //TODO add server call to invalidate authCode

  return (
    <div className="text-2xl font-inter text-center mt-[25px] ">
      Signing out and redirecting...
    </div>
  );
}
