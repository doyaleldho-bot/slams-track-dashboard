import { Search, ChevronDown, CalendarDays } from "lucide-react";

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

  const attendanceData: StudentAttendance[] = [
    {
      classId: "CLS-001",
      className: "5th std",
      section: "A",
      totalStudents: 60,
      present: 52,
      absent: 8,
      halfDay: 2,
      attendanceTakenBy: {
        name: "Devika",
        id: "TCH-001",
      },
      incharge: {
        name: "Devika",
        id: "TCH-001",
      },
    },
    {
      classId: "CLS-002",
      className: "UKG",
      section: "A",
      totalStudents: 58,
      present: 49,
      absent: 9,
      halfDay: 1,
      attendanceTakenBy: {
        name: "Cinda",
        id: "TCH-005",
      },
      incharge: {
        name: "Devika",
        id: "TCH-001",
      },
    },
    {
      classId: "CLS-003",
      className: "6th std",
      section: "B",
      totalStudents: 60,
      present: 55,
      absent: 5,
      halfDay: 0,
      attendanceTakenBy: {
        name: "Doyal",
        id: "TCH-014",
      },
      incharge: {
        name: "Doyal",
        id: "TCH-014",
      },
    },
    {
      classId: "CLS-004",
      className: "2nd std",
      section: "A",
      totalStudents: 62,
      present: 56,
      absent: 6,
      halfDay: 0,
      attendanceTakenBy: {
        name: "Anoop",
        id: "TCH-025",
      },
      incharge: {
        name: "Anoop",
        id: "TCH-025",
      },
    },
    {
      classId: "CLS-005",
      className: "LKG",
      section: "B",
      totalStudents: 57,
      present: 50,
      absent: 7,
      halfDay: 2,
      attendanceTakenBy: {
        name: "Amal km",
        id: "TCH-011",
      },
      incharge: {
        name: "Amal",
        id: "TCH-011",
      },
    },
    {
      classId: "CLS-006",
      className: "7th std",
      section: "B",
      totalStudents: 59,
      present: 51,
      absent: 6,
      halfDay: 3,
      attendanceTakenBy: {
        name: "Ashwin",
        id: "TCH-029",
      },
      incharge: {
        name: "Ashwin",
        id: "TCH-029",
      },
    },
  ];

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
              className="w-[240px] h-[44px] border border-[#D4D4D4] rounded-md px-3 text-[16px] outline-none"
            />

            <CalendarDays
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] pointer-events-none"
            />
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
            {attendanceData.map((item) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentAttendanceTable;