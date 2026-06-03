import React from 'react'
import StatsCard from '../components/StatsCard'
import { PiUserList } from "react-icons/pi";

import {
  Users,
  Calendar,
  UserX,
  Download,
  
} from "lucide-react";
import Notice from '../components/Attendance/Notice';
import AttendanceTabs from '../components/Attendance/AttendanceTabs';
import StaffAttendanceTable from '../components/Attendance/StaffAttendanceTable';
import StudentAttendanceTable from '../components/Attendance/StudentAttendanceTable';
import TeacherAttendanceTable from '../components/Attendance/TeacherAttendanceTable';

const Attendance = () => {
    const [activeTab, setActiveTab] = React.useState("Teacher Attendance");
    const today = new Date().toLocaleDateString("en-US", {
  month: "long",
  day: "2-digit",
  year: "numeric",
});
     const statsData = [
    {
      title: "Student Attendance Today",
      value: "842/900",
      subtitle: "Attendance rate 92%",
      icon: <Users size={18} className="" />,
      // highlight: true,
    },
    {
      title: "Teachers Attendance Today",
      value: "33/44",
      subtitle: "Attendance rate 75%",
      icon: <PiUserList size={18} className="" />,
    },
    {
      title: "Staff Attendance Today",
      value: "18/20",
      subtitle: "Attendance rate 90%",
      icon: <UserX size={18} className="" />,
    },
  
  ];

  return (
    

<div className="p-6">


  <div className="flex items-center justify-between">
      
      {/* Left content */}
      <div>
        <h2 className="font-bold text-[24px] leading-[32px] text-[#2F2F2F]">
Attendance Management        </h2>
        <p className="font-normal text-[14px] leading-[20px] text-[#767676] pt-2">
Track and manage attendance for teachers, students, and staff      </p>
      </div>

      {/* Right button */}
      <div className="flex">
      <button className="flex gap-2 justify-center items-center h-9 rounded-[10px] text-[14px] leading-[20px] font-normal bg-[#FFFFFF] text-[#0A0A0A] px-4  border">
        <Calendar size={18} className="" />
        Today: {today}
      </button>
      <div className="pl-2">
      <button        
 className="flex gap-2 justify-center items-center h-9 rounded-[10px] text-[14px] leading-[20px] font-normal  px-4 border bg-[#1F1F1F] text-white">
    <Download size={18} className="" />
       Export report
      </button>
      </div>
      </div>
    

    </div>

   



<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6 pt-10">  {statsData.map((card, index) => (
          <StatsCard
            key={index}
            title={card.title}
            value={card.value}
            change={card.change}
            subtitle={card.subtitle}
            icon={card.icon}
            highlight={card.highlight}
             width="450px"
  height="200px"
          />
        ))}
      </div>


 <div className="pt-10">
        <Notice />
    </div>

    <div className="pt-10">
        <AttendanceTabs
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="mt-10">
        {activeTab === "Teacher Attendance" && (
          <TeacherAttendanceTable />
        )}

        {activeTab === "Student Attendance" && (
          <StudentAttendanceTable />
        )}

        {activeTab === "Staff Attendance" && (
          <StaffAttendanceTable />
        )}
      </div>
    </div>



    </div>
  );
};

export default Attendance;