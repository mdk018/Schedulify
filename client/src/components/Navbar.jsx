import { Link } from "react-router-dom";
import { Cpu } from "lucide-react";
const Navbar = () => {
  return (
    <div className="navbar bg-base-100 sticky top-0 z-50 shadow-sm justify-between">
      
      {/* Logo on the left */}
      <div className="navbar-start">
        <Cpu className="ml-3 h-6 w-6 text-primary" />
        <Link to="/" className="btn btn-ghost text-xl">
           OS Scheduler
        </Link>
      </div>

      {/* Links on the right (mobile + desktop) */}
      <div className="navbar-end mr-10">
        {/* Mobile dropdown */}
        <div className="dropdown lg:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/visualize">Visualize</Link>
            </li>
            <li>
              <Link to="/compare">Compare</Link>
            </li>
            <li>
              <Link to="/realtime-simulator">Realtime Simulator Engine</Link>
            </li>
          </ul>
        </div>

        {/* Desktop menu */}
        <ul className="menu menu-horizontal px-1 hidden lg:flex">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/visualize">Visualize</Link>
          </li>
          <li>
            <Link to="/compare">Compare</Link>
          </li>
          <li>
              <Link to="/realtime-simulator">Realtime Simulator Engine</Link>
            </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
