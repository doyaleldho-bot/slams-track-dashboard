import React, { useState, useEffect } from "react";
import type { TeacherAttendance } from "./types/TeacherAttendance";
import api from "../../api/axios";
import {
  Search,
  ChevronDown,
  SquarePen,
} from "lucide-react";

interface TeacherAttendanceApi {
  id: number;
  profile_id: number;
  teacher_id: string;
  teacher_name: string;
  teacher_department: string;
  level: string[];
  date: string;
  status: string;
  remarks: string;
  checked_in_time: string;
  checked_out_time: string;
}

interface TeacherAttendanceResponse {
  status: boolean;
  message: string;
  total_items: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  data: {
    status: boolean;
    message: string;
    attendance: TeacherAttendanceApi[];
  };
}

interface TeacherAttendanceTableProps {
  onEdit: (teacher: TeacherAttendance) => void;
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
  refreshKey: number;
}


const TeacherAttendanceTab: React.FC<
  TeacherAttendanceTableProps
> = ({
  onEdit,
  selectedDate,
  setSelectedDate,
  refreshKey,
}) => {
  const batchOptions = [
    "2025-2026",
    "2024-2025",
    "2023-2024",
  ];

  const departmentOptions = [
    "All departments",
    "Science",
    "Commerce",
    "Humanities",
  ];

  const sectionOptions = [
    "All Section",
    "A",
    "B",
    "C",
  ];

  const institutionType = localStorage.getItem("institutionType");

  // const isSchool = institutionType === "school"; // unused
  const isCollege = institutionType === "college";

  const [searchTerm, setSearchTerm] = useState("");

 
  const [selectedDepartment, setSelectedDepartment] =
    useState("All departments");

  const [selectedSection, setSelectedSection] =
    useState("All Section");

  const [attendanceData, setAttendanceData] = useState<
    TeacherAttendance[]
  >([]);

  const [loading, setLoading] = useState(false);

  const fetchTeacherAttendance = async (date?: string) => {
    try {
      setLoading(true);

      const selected =
        date || new Date().toISOString().split("T")[0];

      const response =
        await api.get<TeacherAttendanceResponse>(
          `/teacher-attendance-list/?date=${selected}`
        );

      const formattedData: TeacherAttendance[] =
  response.data.data.attendance.map((teacher) => ({
    id: teacher.profile_id,
    attendanceDate: teacher.date,

    teacherId: teacher.teacher_id,
    teacherName: teacher.teacher_name,

    section:
      teacher.level?.length > 0
        ? teacher.level.join(", ")
        : "---",

    status: teacher.status as
      | "Present"
      | "Absent"
      | "Late"
      | "Half Day",

    checkIn: teacher.checked_in_time || "",

    checkOut: teacher.checked_out_time || "",

    remark: teacher.remarks || "---",
  }));
      setAttendanceData(formattedData);
    } catch (error) {
      console.error(
        "Error fetching teacher attendance:",
        error
      );
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  fetchTeacherAttendance(selectedDate);
}, [selectedDate, refreshKey]);

  const filteredAttendanceData = attendanceData.filter(
    (teacher) => {
      const matchesSearch =
        teacher.teacherId
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        teacher.teacherName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesDepartment =
        selectedDepartment === "All departments" ||
        teacher.section === selectedDepartment;

      const matchesSection =
        selectedSection === "All Section" ||
        teacher.section === selectedSection;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesSection
      );
    }
  );

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Present":
        return "border border-[#22C55E] text-[#22C55E]";
      case "Absent":
        return "border border-[#F97316] text-[#F97316]";
      case "Late":
        return "border border-[#F59E0B] text-[#F59E0B]";
      case "Half Day":
        return "border border-[#3B82F6] text-[#3B82F6]";
      default:
        return "";
    }
  };

  return (
    <div className="bg-white rounded-[10px] p-6 border border-[#E5E7EB]">
      <div className="flex items-center justify-between">
        <h2 className="text-[24px] font-medium text-[#2F2F2F]">
          Teacher Attendance Management
        </h2>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3A3A3]"
            />

            <input
              type="text"
              placeholder="Search id or name..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="w-[220px] h-[40px] pl-9 pr-3 border border-[#E5E7EB] rounded-md text-[13px] outline-none"
            />
          </div>

          {isCollege && (
            <div className="relative">
              <select
                aria-label="Select batch"
                className="w-[180px] h-[40px] border border-[#E5E7EB] rounded-md px-4 text-[13px] text-[#737373] appearance-none outline-none bg-white"
              >
                <option value="">
                  -Select Batch-
                </option>

                {batchOptions.map((batch) => (
                  <option
                    key={batch}
                    value={batch}
                  >
                    {batch}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#737373]"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-6 mt-10">
        <div>
          <label
            htmlFor="attendance-date"
            className="block text-[20px] font-medium text-[#474747] mb-2"
          >
            Select Date
          </label>

          <div className="relative">
            <input
              id="attendance-date"
              type="date"
              value={selectedDate}
              onChange={(e) =>
                setSelectedDate(e.target.value)
              }
              className="max-w-[230px] h-[44px] border border-[#D4D4D4] rounded-md px-3 text-[20px] outline-none"
            />
          </div>
        </div>

        {isCollege && (
          <div>
            <label
              htmlFor="department-select"
              className="block text-[20px] font-medium text-[#474747] mb-2"
            >
              Select Department
            </label>

            <div className="relative">
              <select
                id="department-select"
                value={selectedDepartment}
                onChange={(e) =>
                  setSelectedDepartment(
                    e.target.value
                  )
                }
                className="w-full h-[44px] border border-[#D4D4D4] rounded-md px-3 pr-10 text-[20px] text-[#525252] appearance-none outline-none bg-white"
              >
                {departmentOptions.map(
                  (department) => (
                    <option
                      key={department}
                      value={department}
                    >
                      {department}
                    </option>
                  )
                )}
              </select>

              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#525252]"
              />
            </div>
          </div>
        )}

        <div>
          <label
            htmlFor="section-select"
            className="block text-[20px] font-medium text-[#474747] mb-2"
          >
            Select Section
          </label>

          <div className="relative">
            <select
              id="section-select"
              value={selectedSection}
              onChange={(e) =>
                setSelectedSection(
                  e.target.value
                )
              }
              className="w-[230px] h-[44px] border border-[#D4D4D4] rounded-md px-3 text-[20px] text-[#525252] appearance-none outline-none bg-white"
            >
              {sectionOptions.map((section) => (
                <option
                  key={section}
                  value={section}
                >
                  {section}
                </option>
              ))}
            </select>

            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E5E7EB]">
              <th className="text-left pb-4 text-[20px] font-medium text-[#525252]">
                Teacher ID
              </th>
              <th className="text-left pb-4 text-[20px] font-medium text-[#525252]">
                TeacherName
              </th>
              <th className="text-left pb-4 text-[20px] font-medium text-[#525252]">
                Section
              </th>
              <th className="text-left pb-4 text-[20px] font-medium text-[#525252]">
                Status
              </th>
              <th className="text-left pb-4 text-[20px] font-medium text-[#525252]">
                Check-in
              </th>
              <th className="text-left pb-4 text-[20px] font-medium text-[#525252]">
                Check-out
              </th>
              <th className="text-left pb-4 text-[20px] font-medium text-[#525252]">
                Remark
              </th>
              <th className="text-right pb-4 text-[20px] font-medium text-[#525252]">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-8 text-center text-[#737373]"
                >
                  Loading...
                </td>
              </tr>
            ) : filteredAttendanceData.length > 0 ? (
              filteredAttendanceData.map((item) => (
                <tr
                  key={item.teacherId}
                  className="border-b border-[#E5E7EB]"
                >
                  <td className="py-5 text-[20px] text-[#525252]">
                    {item.teacherId}
                  </td>

                  <td className="py-5 text-[20px] text-[#525252]">
                    {item.teacherName}
                  </td>

                  <td className="py-5 text-[20px] text-[#525252]">
                    {item.section}
                  </td>

                  <td className="py-5">
                    <span
                      className={`px-3 py-[2px] rounded-md text-[13px] ${getStatusClass(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="py-5 text-[20px] text-[#525252]">
                    {item.checkIn}
                  </td>

                  <td className="py-5 text-[20px] text-[#525252]">
                    {item.checkOut}
                  </td>

                  <td className="py-5 text-[20px] text-[#525252]">
                    {item.remark}
                  </td>

                  <td className="py-5">
                    <button
                      type="button"
                      className="flex justify-end"
                      onClick={() => onEdit(item)}
                      aria-label="Edit attendance"
                      title="Edit attendance"
                    >
                      <SquarePen
                        size={15}
                        className="text-[#3B82F6] cursor-pointer"
                      />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="py-8 text-center text-[#737373]"
                >
                  No teachers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherAttendanceTab;