import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ModeToggle } from "./shadcn/mode-toggle";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);
  return (
    <header className="shadow-md ">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <div className="flex gap-4 items-center">

        <ModeToggle />
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span>chomchom</span>
            <span>Estate</span>
          </h1>
        </Link>
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-3 rounded-lg flex items-center gap-4"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="" />
          </button>
        </form>
        <ul className="flex gap-6">
          <Link to="/profile">
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt="profile"
                className="rounded-full h-7 w-7 object-cover"
              />
            ) : (
              <li className="font-bold hover:underline">Log In</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
