import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { openMobileSidebar } from "../redux/slices/uiSlice";
import { useNavigate } from "react-router-dom";

function Topbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center bg-white shadow px-4 py-3">
      {/* Hamburger menu for mobile */}
      <button
        onClick={() => dispatch(openMobileSidebar())}
        className="lg:hidden text-gray-700 mr-2"
      >
        ☰
      </button>

      <h1 className="font-bold text-lg">FB-GHL Integration</h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}

export default Topbar;
