import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F6F5FA]">
      <Sidebar />

      <div className="lg:ml-[340px] flex flex-col min-h-screen">
        <div className="sticky top-0 z-20 bg-white">
          <Navbar />
        </div>

        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;