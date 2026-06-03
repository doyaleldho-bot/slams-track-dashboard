import React from "react";
import type { TeacherAttendance } from "./types/TeacherAttendance";
import {
  Search,
  ChevronDown,
  SquarePen,
} from "lucide-react";

interface StaffAttendanceTableProps {
  onEdit: (staff: TeacherAttendance) => void;
}

const StaffAttendanceTable: React.FC<StaffAttendanceTableProps> = ({
  onEdit,
}) => {
  const departmentOptions = [
    "All departments",
    "Administration",
    "Front Office",
    "IT Support",
    "Laboratory",
    "Library",
  ];

  const sectionOptions = [
    "All Section",
    "A",
    "B",
    "C",
  ];

  const staffData: TeacherAttendance[] = [
    {
      teacherId: "TCH-001",
      teacherName: "Robort Williams",
      section: "Administration",
      status: "Present",
      checkIn: "08:45 AM",
      checkOut: "---",
      remark: "---",
    },
    {
      teacherId: "TCH-002",
      teacherName: "Emily Davis",
      section: "Front Office",
      status: "Present",
      checkIn: "08:30 AM",
      checkOut: "---",
      remark: "---",
    },
    {
      teacherId: "TCH-003",
      teacherName: "Jhon Benadit",
      section: "IT Support",
      status: "Absent",
      checkIn: "---",
      checkOut: "---",
      remark: "Medical Leave",
    },
    {
      teacherId: "TCH-004",
      teacherName: "Binu James",
      section: "Laboratory",
      status: "Late",
      checkIn: "09:40 AM",
      checkOut: "---",
      remark: "Traffic Delay",
    },
    {
      teacherId: "TCH-005",
      teacherName: "Sindhu Ragav",
      section: "Library",
      status: "Present",
      checkIn: "08:40 AM",
      checkOut: "---",
      remark: "---",
    },
    {
      teacherId: "TCH-006",
      teacherName: "Merry Jonson",
      section: "Front Office",
      status: "Absent",
      checkIn: "---",
      checkOut: "---",
      remark: "Casual Leave",
    },
  ];

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Present":
        return "border border-[#22C55E] text-[#22C55E]";
      case "Absent":
        return "border border-[#F97316] text-[#F97316]";
      case "Late":
        return "border border-[#F59E0B] text-[#F59E0B]";
      default:
        return "";
    }
  };

  return (
    <div className="bg-white rounded-[10px] p-6 border border-[#E5E7EB]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[24px] font-medium text-[#2F2F2F]">
          Staff Attendance Management
        </h2>

        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3A3A3]"
          />

          <input
            type="text"
            aria-label="Search id or name"
            placeholder="Search id or name..."
            className="w-[220px] h-[40px] pl-9 pr-3 border border-[#E5E7EB] rounded-md text-[13px] outline-none"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-6 mt-10">
        {/* Date */}
        <div>
          <label htmlFor="attendance-date" className="block text-[20px] font-medium text-[#474747] mb-2">
            Select Date
          </label>

          <input
            id="attendance-date"
            type="date"
            className="w-[230px] h-[44px] border border-[#D4D4D4] rounded-md px-3 text-[20px] outline-none"
          />
        </div>

        {/* Department */}
        <div>
          <label htmlFor="department-select" className="block text-[20px] font-medium text-[#474747] mb-2">
            Select Department
          </label>

          <div className="relative">
            <select
              id="department-select"
              aria-label="Select Department"
              className="w-[230px] h-[44px] border border-[#D4D4D4] rounded-md px-3 text-[20px] text-[#525252] appearance-none outline-none bg-white">
              {departmentOptions.map((department) => (
                <option key={department}>
                  {department}
                </option>
              ))}
            </select>

            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            />
          </div>
        </div>

        {/* Section */}
        <div>
          <label htmlFor="section-select" className="block text-[20px] font-medium text-[#474747] mb-2">
            Select Section
          </label>

          <div className="relative">
            <select
              id="section-select"
              aria-label="Select Section"
              className="w-[230px] h-[44px] border border-[#D4D4D4] rounded-md px-3 text-[20px] text-[#525252] appearance-none outline-none bg-white">
              {sectionOptions.map((section) => (
                <option key={section}>
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

      {/* Table */}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E5E7EB]">
              <th className="text-left pb-4 text-[20px] font-medium text-[#525252]">
                Staff ID
              </th>
              <th className="text-left pb-4 text-[20px] font-medium text-[#525252]">
                Staff Name
              </th>
              <th className="text-left pb-4 text-[20px] font-medium text-[#525252]">
                Department
              </th>
              <th className="text-left pb-4 text-[20px] font-medium text-[#525252]">
                Designation
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
            {staffData.map((item) => (
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

                <td className="py-5 text-[20px] text-[#525252]">
                  {item.section === "Administration"
                    ? "Accountant"
                    : item.section === "Front Office"
                    ? "Receptionist"
                    : item.section === "IT Support"
                    ? "Technical Support"
                    : item.section === "Laboratory"
                    ? "Lab Assistant"
                    : "Librarian"}
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
                    aria-label={`Edit attendance for ${item.teacherName}`}
                    className="flex justify-end w-full"
                    onClick={() => onEdit(item)}
                  >
                    <SquarePen
                      size={15}
                      className="text-[#3B82F6]"
                      aria-hidden="true"
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffAttendanceTable;