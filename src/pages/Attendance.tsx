import React, { useState,useEffect } from 'react'
import StatsCard from '../components/StatsCard'
import { PiUserList } from "react-icons/pi";
import type { TeacherAttendance } from "../components/Attendance/types/TeacherAttendance";
import api from "../api/axios"; // adjust path

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
import TeacherAttendanceTab from "../components/Attendance/TeacherAttendanceTable";import ActionModal from "../components/Attendance/modal/ActionModal";

const Attendance = () => {
    const [activeTab, setActiveTab] = React.useState("Teacher Attendance");
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedTeacher, setSelectedTeacher] =
  useState<TeacherAttendance | null>(null);


    const today = new Date().toLocaleDateString("en-US", {
  month: "long",
  day: "2-digit",
  year: "numeric",
});

const [attendanceType, setAttendanceType] =
  useState<"teacher" | "staff">(
    "teacher"
  );

  const handleTeacherEdit = (
  teacher: TeacherAttendance
) => {
  setAttendanceType("teacher");
  setSelectedTeacher(teacher);
  setIsModalOpen(true);
};

const handleStaffEdit = (
  staff: TeacherAttendance
) => {
   console.log("Staff Row", staff);
  setAttendanceType("staff");
  setSelectedTeacher(staff);
  setIsModalOpen(true);
};

interface TeacherAttendanceTableProps {
  onEdit: (teacher: TeacherAttendance) => void;
  selectedDate: string;
  setSelectedDate: React.Dispatch<
    React.SetStateAction<string>
  >;
  refreshKey: number;
}

const initialTeachers: TeacherAttendance[] = [
  {
    teacherId: "TCH-001",
    teacherName: "Robort Williams",
    section: "A",
    status: "Present",
    checkIn: "08:45 AM",
    checkOut: "---",
    remark: "---",
  },
  {
    teacherId: "TCH-002",
    teacherName: "Emily Davis",
    section: "A",
    status: "Present",
    checkIn: "08:30 AM",
    checkOut: "---",
    remark: "---",
  },
  {
    teacherId: "TCH-003",
    teacherName: "Jhon Benddit",
    section: "B",
    status: "Absent",
    checkIn: "---",
    checkOut: "---",
    remark: "Medical Leave",
  },
  {
    teacherId: "TCH-004",
    teacherName: "Binu James",
    section: "A",
    status: "Late",
    checkIn: "09:40 AM",
    checkOut: "---",
    remark: "Traffic Delay",
  },
  {
    teacherId: "TCH-005",
    teacherName: "Sindhu Ragav",
    section: "B",
    status: "Present",
    checkIn: "08:40 AM",
    checkOut: "---",
    remark: "---",
  },
  {
    teacherId: "TCH-006",
    teacherName: "Merry Jonson",
    section: "B",
    status: "Absent",
    checkIn: "---",
    checkOut: "---",
    remark: "Casual Leave",
  },
];

const handleExport = async () => {
  try {
    let endpoint = "";
    let filename = "";

    switch (activeTab) {
      case "Teacher Attendance":
        endpoint = `/export-teachers-attendance/?date=${selectedDate}`;
        filename = "teacher-attendance.xlsx";
        break;

      case "Staff Attendance":
        endpoint = `/export-staff-attendance/?date=${selectedDate}`;
        filename = "staff-attendance.xlsx";
        break;

      case "Student Attendance":
        endpoint = `/export-students-attendance/?date=${selectedDate}`;
        filename = "student-attendance.xlsx";
        break;

      default:
        return;
    }

    const response = await api.get(endpoint, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], {
      type:
        response.headers["content-type"] ||
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Export failed:", error);
  }
};

const [refreshKey, setRefreshKey] = useState(0);

const handleSaveTeacher = () => {
  setRefreshKey((prev) => prev + 1);
  setIsModalOpen(false);
};
const [teachers, setTeachers] =
  useState<TeacherAttendance[]>([]);

interface AttendanceKPI {
  title: string;
  present: number;
  total: number;
  count: string;
  attendance_rate: number;
}

interface AttendanceKPIResponse {
  status: boolean;
  message: string;
  data: AttendanceKPI[];
}

    const [statsData, setStatsData] = useState<AttendanceStatsCard[]>([]);
const [statsLoading, setStatsLoading] = useState(true);
const [selectedDate, setSelectedDate] = useState(
  new Date().toISOString().split("T")[0]
);


useEffect(() => {
  const fetchAttendanceStats = async () => {
    try {
      setStatsLoading(true);

      const response = await api.get<AttendanceKPIResponse>(
        `/attendance-kpi-cards/?date=${selectedDate}`
      );

      const formattedData: AttendanceStatsCard[] =
        response.data.data.map((item) => {
          let icon;

          switch (item.title) {
            case "Student Attendance Today":
              icon = <Users size={18} />;
              break;

            case "Teachers Attendance Today":
              icon = <PiUserList size={18} />;
              break;

            case "Staff Attendance Today":
              icon = <UserX size={18} />;
              break;

            default:
              icon = <Users size={18} />;
          }

          return {
            title: item.title,
            value: item.count,
            subtitle: `Attendance rate ${item.attendance_rate}%`,
            icon,
            highlight: false,
          };
        });

      setStatsData(formattedData);
    } catch (error) {
      console.error("Failed to fetch attendance KPI cards:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  fetchAttendanceStats();
}, [selectedDate]);


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
  onClick={handleExport}
  className="flex gap-2 justify-center items-center h-9 rounded-[10px] text-[14px] leading-[20px] font-normal px-4 border bg-[#1F1F1F] text-white"
>
    <Download size={18} className="" />
       Export report
      </button>
      </div>
      </div>
    

    </div>

   



<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6 pt-10">
  {statsLoading ? (
    <div>Loading...</div>
  ) : (
    statsData.map((card, index) => (
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
    ))
  )}
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
<TeacherAttendanceTab
  onEdit={handleTeacherEdit}
  selectedDate={selectedDate}
  setSelectedDate={setSelectedDate}
  refreshKey={refreshKey}
/>   )}

        {activeTab === "Student Attendance" && (
          <StudentAttendanceTable />
        )}

       {activeTab === "Staff Attendance" && (
  <StaffAttendanceTable
    onEdit={handleStaffEdit}
    refreshKey={refreshKey}
  />
)}
      </div>
    </div>

  <ActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        teacher={selectedTeacher}
        onSave={handleSaveTeacher}
        attendanceType={attendanceType}
      />

    </div>
  );
};

export default Attendance; 