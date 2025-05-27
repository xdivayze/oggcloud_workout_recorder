import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="font-inter font-bold text-3xl text-center px-5 mt-5">
        Workout Tracking, Made Better
      </div>
      <div className="text-center font-inter text-xl py-5 font-light">
        <Link className="text-blue-600" to="/login">
          {" "}
          Join/Login
        </Link>{" "}
        Now
      </div>
    </div>
  );
}
