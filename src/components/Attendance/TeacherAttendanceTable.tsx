import React from "react";
import {
  Search,
  ChevronDown,
  CalendarDays,
  SquarePen,
} from "lucide-react";

interface TeacherAttendance {
  teacherId: string;
  teacherName: string;
  section: string;
  status: "Present" | "Absent" | "Late";
  checkIn: string;
  checkOut: string;
  remark: string;
}

const TeacherAttendanceTab = () => {
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
  const attendanceData: TeacherAttendance[] = [
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
          Teacher Attendance Management
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
      placeholder="Search id or name..."
      className="w-[220px] h-[40px] pl-9 pr-3 border border-[#E5E7EB] rounded-md text-[13px] outline-none"
    />
  </div>

  {/* Batch Dropdown */}
  <div className="relative">
    <select className="w-[180px] h-[40px] border border-[#E5E7EB] rounded-md px-4 text-[13px] text-[#737373] appearance-none outline-none bg-white">
      <option value="">-Select Batch-</option>

      {batchOptions.map((batch) => (
        <option key={batch} value={batch}>
          {batch}
        </option>
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
      <div className="flex gap-6 mt-10">
  {/* Date */}
  <div>
    <label className="block text-[20px] font-medium text-[#474747] mb-2">
      Select Date
    </label>

    <div className="relative">
      <input
        type="date"
        className="max-w-[230px] h-[44px] border border-[#D4D4D4] rounded-md px-3   text-[20px] outline-none"
      />

      {/* <CalendarDays
        size={16}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] pointer-events-none"
      /> */}
    </div>
  </div>

  {/* Department Dropdown */}
  <div>
    <label className="block text-[20px] font-medium text-[#474747] mb-2">
      Select Department
    </label>

    <div className="relative">
      <select className="max-w-[230px] h-[44px] border border-[#D4D4D4] rounded-md px-3   text-[20px] text-[#525252] appearance-none outline-none bg-white">
        {departmentOptions.map((department) => (
          <option key={department} value={department}>
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

  {/* Section Dropdown */}
  <div>
    <label className="block text-[20px] font-medium text-[#474747] mb-2">
      Select Section
    </label>

    <div className="relative">
      <select className="w-[230px] h-[44px] border border-[#D4D4D4] rounded-md px-3   text-[20px] text-[#525252] appearance-none outline-none bg-white">
        {sectionOptions.map((section) => (
          <option key={section} value={section}>
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
              <th className="text-left pb-4   text-[20px] font-medium text-[#525252]">
                Teacher ID
              </th>
              <th className="text-left pb-4   text-[20px] font-medium text-[#525252]">
                TeacherName
              </th>
              <th className="text-left pb-4   text-[20px] font-medium text-[#525252]">
                Section
              </th>
              <th className="text-left pb-4   text-[20px] font-medium text-[#525252]">
                Status
              </th>
              <th className="text-left pb-4   text-[20px] font-medium text-[#525252]">
                Check-in
              </th>
              <th className="text-left pb-4   text-[20px] font-medium text-[#525252]">
                Check-out
              </th>
              <th className="text-left pb-4   text-[20px] font-medium text-[#525252]">
                Remark
              </th>
              <th className="text-right pb-4   text-[20px] font-medium text-[#525252]">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {attendanceData.map((item) => (
              <tr
                key={item.teacherId}
                className="border-b border-[#E5E7EB]"
              >
                <td className="py-5    text-[20px]text-[#525252]">
                  {item.teacherId}
                </td>

                <td className="py-5   text-[20px] text-[#525252]">
                  {item.teacherName}
                </td>

                <td className="py-5   text-[20px] text-[#525252]">
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

                <td className="py-5   text-[20px] text-[#525252]">
                  {item.checkIn}
                </td>

                <td className="py-5   text-[20px] text-[#525252]">
                  {item.checkOut}
                </td>

                <td className="py-5   text-[20px] text-[#525252]">
                  {item.remark}
                </td>

                <td className="py-5">
                  <div className="flex justify-end">
                    <SquarePen
                      size={15}
                      className="text-[#3B82F6] cursor-pointer"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherAttendanceTab;