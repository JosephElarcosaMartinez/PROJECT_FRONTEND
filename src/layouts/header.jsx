import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/hooks/use-theme";
import { ChevronsLeft, Search, Sun, Moon, Bell } from "lucide-react";
import profileImage from "@/assets/Joseph_prof.png";
import PropTypes from "prop-types";

export const Header = ({ collapsed, setCollapsed }) => {
  const { theme, setTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="relative z-10 flex h-[60px] items-center justify-between border-b border-slate-200 bg-[#eef4ff] px-4 shadow-sm transition-colors dark:bg-slate-900">
      {/* Left Section */}
      <div className="flex items-center gap-x-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="btn-ghost size-10 text-slate-600 dark:text-white"
        >
          <ChevronsLeft className={collapsed ? "rotate-180" : ""} />
        </button>

        {/* Search Input */}
        <div className="relative w-[300px]">
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-md border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm text-slate-700 placeholder:text-slate-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-x-4">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="btn-ghost size-10 text-slate-600 dark:text-white"
        >
          <Sun className="block dark:hidden" size={20} />
          <Moon className="hidden dark:block" size={20} />
        </button>

        {/* Bell Icon */}
        <button className="btn-ghost size-10 text-slate-600 dark:text-white">
          <Bell size={20} />
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-x-2 rounded-md border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <span>Admin User</span>
            <img
              src={profileImage}
              alt="profile"
              className="h-8 w-8 rounded-full object-cover"
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 rounded-md border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
              <ul className="text-sm text-slate-700 dark:text-white">
                <li className="cursor-pointer px-4 py-2 font-semibold hover:bg-slate-100 dark:hover:bg-slate-700">
                  Joseph Martinez
                </li>
                <li className="cursor-pointer px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700">
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func,
};

