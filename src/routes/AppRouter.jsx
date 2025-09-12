import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";
import PrivateRoute from "../components/PrivateRoute";
import Dashboard from "../pages/Dashboard";
import Settings from "../pages/Settings";
import Account from "../pages/Account";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import FacebookAccounts from "../pages/FacebookAccounts";
import ResetPassword from "../pages/ResetPassword";
import FBChat from "../pages/FBChat";

function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected layout with sidebar & topbar */}
      <Route 
        path="/*"
        element={
          <PrivateRoute>
            <div className="flex h-screen">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Topbar />
                <div className="p-4 flex-1 overflow-y-auto">
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="settings" element={<Settings />} />  
                    <Route path="account" element={<Account />} />
                    <Route path="facebook-accounts" element={<FacebookAccounts />} />
                    <Route path="fb/:id" element={<FBChat />} />

                  </Routes>
                </div>
              </div>
            </div>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default AppRouter;
