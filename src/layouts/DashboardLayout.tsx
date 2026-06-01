import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const DashboardLayout: React.FC = () => {
  return (
    <div className="h-screen w-full flex bg-[#F6F5FA] overflow-hidden">

      {/* SIDEBAR */}
      <div className="flex w-0 md:w-[340px] md:min-w-[260px] flex-shrink-0 overflow-hidden">
        <div className="hidden md:flex w-0 max-w-[340px] min-w-[260px]">
          <Sidebar />
        </div>
      </div>

      {/* MAIN AREA */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* NAVBAR */}
        <div className="sticky top-0 z-20 bg-white">
          <Navbar />
        </div>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;
