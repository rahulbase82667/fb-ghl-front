import React from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar, closeMobileSidebar } from "../redux/slices/uiSlice";

function Sidebar() {
  const dispatch = useDispatch();
  const { sidebarOpen, mobileSidebarOpen } = useSelector((state) => state.ui);

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/settings", label: "Settings" },
    { path: "/account", label: "Account" },
    { path: "/facebook-accounts", label: "Facebook Accounts" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => dispatch(closeMobileSidebar())}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed z-50 lg:static top-0 left-0 h-full bg-gray-900 text-white transition-all duration-1000
        ${sidebarOpen ? "w-64" : "w-16"} 
        ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0`}
      >
        <div className="p-4">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="mb-6 text-sm bg-gray-700 px-2 py-1 rounded hidden lg:block"
          >
            {sidebarOpen ? "Close" : "Open"}
          </button>

          <nav className="flex flex-col gap-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-2 py-1 rounded block ${
                    isActive ? "bg-gray-600" : "hover:bg-gray-700"
                  }`
                }
                onClick={() => dispatch(closeMobileSidebar())}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
