import { Search, ChevronDown, CalendarDays } from "lucide-react";
import React, { useState,useEffect } from "react";
import api from "../../api/axios";
interface StudentAttendance {
  classId: string;
  className: string;
  section: string;
  totalStudents: number;
  present: number;
  absent: number;
  halfDay: number;
  attendanceTakenBy: {
    name: string;
    id: string;
  };
  incharge: {
    name: string;
    id: string;
  };
}

const StudentAttendanceTable = () => {
  const batchOptions = [
    "2025-2026",
    "2024-2025",
    "2023-2024",
  ];

  const classOptions = [
    "All Class",
    "LKG",
    "UKG",
    "1st Std",
    "2nd Std",
    "3rd Std",
    "4th Std",
    "5th Std",
    "6th Std",
    "7th Std",
  ];
  const [searchTerm, setSearchTerm] = useState("");
const [selectedClass, setSelectedClass] = useState("All Class");
const [selectedDate, setSelectedDate] = useState(
  new Date().toISOString().split("T")[0]
);
interface StudentAttendanceApi {
  class_id: number;
  class_code: string;
  class_name: string;
  section: string;
  total_students: number;
  present: number;
  absent: number;
  half_day: number;
  attendance_taken_by: {
    id: number;
    name: string;
  } | null;
  incharge: {
    id: number;
    name: string;
  } | null;
}

interface StudentAttendanceResponse {
  status: boolean;
  message: string;
  data: StudentAttendanceApi[];
}

const [attendanceData, setAttendanceData] = useState<StudentAttendance[]>([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  fetchStudentAttendance();
}, [selectedDate]);

const fetchStudentAttendance = async () => {
  try {
    setLoading(true);

    const response =
      await api.get<StudentAttendanceResponse>(
        `/students-attendance-list/?date=${selectedDate}`
      );

    const formattedData: StudentAttendance[] =
      response.data.data.map((item) => ({
        classId: item.class_code,
        className: item.class_name,
        section: item.section,

        totalStudents: item.total_students,
        present: item.present,
        absent: item.absent,
        halfDay: item.half_day,

        attendanceTakenBy: {
          name:
            item.attendance_taken_by?.name ||
            "---",
          id:
            item.attendance_taken_by?.id?.toString() ||
            "---",
        },

        incharge: {
          name:
            item.incharge?.name ||
            "---",
          id:
            item.incharge?.id?.toString() ||
            "---",
        },
      }));

    setAttendanceData(formattedData);
  } catch (error) {
    console.error(
      "Failed to fetch student attendance",
      error
    );
    setAttendanceData([]);
  } finally {
    setLoading(false);
  }
};
  

   const filteredAttendanceData = attendanceData.filter((student) => {
  const matchesSearch =
    student.classId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.className.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesClass =
    selectedClass === "All Class" ||
    student.className.toLowerCase() === selectedClass.toLowerCase();

  return matchesSearch && matchesClass;
});

  return (
    <div className="bg-white rounded-[10px] p-6 border border-[#E5E7EB]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[24px] font-medium text-[#2F2F2F]">
          Student Attendance Management
        </h2>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3A3A3]"
            />

            <input
              type="text"
              aria-label="Search by id or name"
              title="Search by id or name"
              placeholder="Search id or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[220px] h-[40px] pl-9 pr-3 border border-[#E5E7EB] rounded-md text-[13px] outline-none"
            />
          </div>

          {/* Batch */}
          <div className="relative">
            <select
              aria-label="Select batch"
              title="Select batch"
              className="w-[180px] h-[40px] border border-[#E5E7EB] rounded-md px-4 text-[13px] text-[#737373] appearance-none outline-none bg-white"
            >
              <option>-Select Batch-</option>

              {batchOptions.map((batch) => (
                <option key={batch}>{batch}</option>
              ))}
            </select>

            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#737373]"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-8 mt-10">
        {/* Date */}
        <div>
          <label htmlFor="attendanceDate" className="block text-[20px] font-medium text-[#474747] mb-2">
            Select Date
          </label>

          <div className="relative">
           <input
  id="attendanceDate"
  type="date"
  value={selectedDate}
  onChange={(e) => setSelectedDate(e.target.value)}
  className="w-[240px] h-[44px] border border-[#D4D4D4] rounded-md px-3 text-[16px] outline-none"
/>

            {/* <CalendarDays
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] pointer-events-none"
            /> */}
          </div>
        </div>

        {/* Class */}
        <div>
          <label htmlFor="classSelect" className="block text-[20px] font-medium text-[#474747] mb-2">
            Select Class
          </label>

          <div className="relative">
            <select
              id="classSelect"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-[240px] h-[44px] border border-[#D4D4D4] rounded-md px-3 text-[16px] text-[#525252] appearance-none outline-none bg-white"
            >
              {classOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b border-[#E5E7EB]">
              <th className="text-left pb-4 text-[15px] font-medium text-[#525252]">
                Class ID
              </th>

              <th className="text-left pb-4 text-[15px] font-medium text-[#525252]">
                Class
              </th>

              <th className="text-left pb-4 text-[15px] font-medium text-[#525252]">
                Section
              </th>

              <th className="text-left pb-4 text-[15px] font-medium text-[#525252]">
                Total Students
              </th>

              <th className="text-left pb-4 text-[15px] font-medium text-[#525252]">
                Present
              </th>

              <th className="text-left pb-4 text-[15px] font-medium text-[#525252]">
                Absent
              </th>

              <th className="text-left pb-4 text-[15px] font-medium text-[#525252]">
                Half-Day
              </th>

              <th className="text-left pb-4 text-[15px] font-medium text-[#525252]">
                Attendance taken by
              </th>

              <th className="text-left pb-4 text-[15px] font-medium text-[#525252]">
                Incharge
              </th>
            </tr>
          </thead>

        <tbody>
{loading ? (
  <tr>
    <td
      colSpan={9}
      className="py-8 text-center text-[#737373]"
    >
      Loading...
    </td>
  </tr>
) : filteredAttendanceData.length > 0 ? (
      filteredAttendanceData.map((item) => (
      <tr
        key={item.classId}
        className="border-b border-[#E5E7EB]"
      >
                <td className="py-4 text-[15px] text-[#525252]">
                  {item.classId}
                </td>

                <td className="py-4 text-[15px] text-[#525252]">
                  {item.className}
                </td>

                <td className="py-4 text-[15px] text-[#525252]">
                  {item.section}
                </td>

                <td className="py-4 text-[15px] text-[#525252]">
                  {item.totalStudents}
                </td>

                <td className="py-4 text-[15px] text-[#525252]">
                  {item.present}
                </td>

                <td className="py-4 text-[15px] text-[#525252]">
                  {item.absent}
                </td>

                <td className="py-4 text-[15px] text-[#525252]">
                  {item.halfDay.toString().padStart(2, "0")}
                </td>

                <td className="py-4">
                  <div className="flex flex-col">
                    <span className="text-[15px] text-[#525252]">
                      {item.attendanceTakenBy.name}
                    </span>

                    <span className="text-[12px] text-[#A3A3A3]">
                      {item.attendanceTakenBy.id}
                    </span>
                  </div>
                </td>

                <td className="py-4">
                  <div className="flex flex-col">
                    <span className="text-[15px] text-[#525252]">
                      {item.incharge.name}
                    </span>

                    <span className="text-[12px] text-[#A3A3A3]">
                      {item.incharge.id}
                    </span>
                  </div>
                </td>
                </tr>
    ))
  ) : (
    <tr>
      <td
        colSpan={9}
        className="py-8 text-center text-[#737373]"
      >
        No classes found
      </td>
    </tr>
  )}
</tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentAttendanceTable;