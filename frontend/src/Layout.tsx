import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className=" bg-gray-ogg-0 h-screen w-screen flex flex-col">
      <Navbar />
      <Outlet />
    </div>
  );
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className=" bg-black/40  text-black-700 bg-opacity-0 font-inter p-4 pb-2 ">
      <div className="flex justify-between">
        <div className="text-2xl font-bold"> OGGCloud</div>
        <div className="md:hidden cursor-pointer" onClick={toggleMenu}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </div>
      </div>
      <div>
        <ul
          className={`md:hidden pt-2  space-y-2 font-light overflow-hidden 
            transition-all duration-300 ease-in-out ${
              isOpen ? "opacity-100 max-h-40" : "opacity-0 max-h-0"
            }`}
        >
          <li>
            <Link to={"/"}>Home</Link>
          </li>

          <li> Progress</li>
          <li> <Link to={"/log-workout"} >Log Workout</Link> </li>
          <li> Change Account</li>
          <li> Sign out</li>
        </ul>
      </div>
    </nav>
  );
};
