import React from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <header className="bg-grey-slate-2 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span>chomchom</span>
            <span>Page</span>
          </h1>
        </Link>
        <form className="bg-grey-slate-1 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <FaSearch className="text-grey-slate-3" />
        </form>
        <ul className="flex gap-4 ">
          <Link to="/">
            <li className="hidden sm:inline font-bold hover:underline">Home</li>
          </Link>
          <Link to="/">
            <li className="hidden sm:inline font-bold hover:underline">
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img src={currentUser.avatar} alt="profile" className="rounded-full h-7 w-7 object-cover"/>
            ) : (
              <li className="font-bold hover:underline">Log In</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
