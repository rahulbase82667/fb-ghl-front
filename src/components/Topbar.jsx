// import React from "react";
// import { useDispatch } from "react-redux";
// import { logout } from "../redux/slices/authSlice";
// import { openMobileSidebar } from "../redux/slices/uiSlice";
// import { useNavigate } from "react-router-dom";

// function Topbar() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/login");
//   };

//   return (
//     <div className="flex justify-between items-center bg-white shadow px-4 py-3">
//       {/* Hamburger menu for mobile */}
//       <button
//         onClick={() => dispatch(openMobileSidebar())}
//         className="lg:hidden text-gray-700 mr-2"
//       >
//         ☰
//       </button>

//       <h1 className="font-bold text-lg">FB-GHL Integration</h1>

//       <button
//         onClick={handleLogout}
//         className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//       >
//         Logout
//       </button>
//     </div>
//   );
// }

// export default Topbar;


import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { openMobileSidebar } from "../redux/slices/uiSlice";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu } from "lucide-react"; // modern icons

function Topbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center bg-gray-950 border-b border-gray-800 px-4 py-3 shadow-md">
      {/* Hamburger menu for mobile */}
      <button
        onClick={() => dispatch(openMobileSidebar())}
        className="lg:hidden flex items-center justify-center w-10 h-10 text-gray-300 hover:text-green-400 transition-colors"
      >
        <Menu size={22} />
      </button>

      {/* App Title */}
      <h1 className="font-bold text-lg text-green-400 tracking-wide">
        {user && `  ${user.name}`}
      </h1>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 active:scale-95 transition-all"
      >
        <LogOut size={18} />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </div>
  );
}

export default Topbar;
