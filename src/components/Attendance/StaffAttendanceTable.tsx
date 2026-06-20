import React, { useEffect, useState } from "react";
import type { TeacherAttendance } from "./types/TeacherAttendance";
import {
  Search,
  ChevronDown,
  SquarePen,
} from "lucide-react";
import api from "../../api/axios";

interface StaffAttendanceTableProps {
  onEdit: (staff: TeacherAttendance) => void;
  refreshKey: number;
}

interface StaffAttendanceApi {
  id: number;
  profile_id: number;
  staff_id: string;
  staff_name: string;
  staff_department: string;
  staff_designation: string;
  date: string;
  status: string;
  remarks: string;
  checked_in_time: string;
  checked_out_time: string | null;
}

interface StaffAttendanceResponse {
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
    attendance: StaffAttendanceApi[];
  };
}

interface StaffAttendanceData extends TeacherAttendance {
  designation?: string;
}



const StaffAttendanceTable: React.FC<
  StaffAttendanceTableProps
> = ({ onEdit, refreshKey }) => {
 
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedDate, setSelectedDate] =
    useState(
      new Date().toISOString().split("T")[0]
    );
    


const [selectedDepartment, setSelectedDepartment] =
  useState<string>("All Departments");

  const [staffData, setStaffData] = useState<
    StaffAttendanceData[]
  >([]);
  const departmentOptions = [
  "All Departments",
  ...Array.from(
    new Set(
      staffData
        .map((staff) => staff.section)
        .filter(Boolean)
    )
  ),
];

  const [loading, setLoading] =
    useState(false);

  const fetchStaffAttendance = async (
    date?: string
  ) => {
    try {
      setLoading(true);

      const selected =
        date ||
        new Date()
          .toISOString()
          .split("T")[0];

      const response =
        await api.get<StaffAttendanceResponse>(
          `/staff-attendance-list/?date=${selected}`
        );

      const formattedData: StaffAttendanceData[] =
        response.data.data.attendance.map(
          (staff) => ({
            id: staff.profile_id,
            profileId: staff.profile_id,
            attendanceDate: staff.date,

            teacherId: staff.staff_id,
            teacherName: staff.staff_name,

            section:
              staff.staff_department || "---",

            designation:
              staff.staff_designation || "---",

            status: staff.status as
              | "Present"
              | "Absent"
              | "Late"
              | "Half day",

            checkIn:
              staff.checked_in_time || "",

            checkOut:
              staff.checked_out_time ||
              "",

            remark:
              staff.remarks || "",
          })
        );

      setStaffData(formattedData);
    } catch (error) {
      console.error(
        "Error fetching staff attendance:",
        error
      );
      setStaffData([]);
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  fetchStaffAttendance(selectedDate);
}, [selectedDate, refreshKey]);

  const filteredAttendanceData = staffData.filter((staff) => {
  const matchesSearch =
    staff.teacherId
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    staff.teacherName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

  const matchesDepartment =
    selectedDepartment === "All Departments" ||
    staff.section === selectedDepartment;

  return matchesSearch && matchesDepartment;
});

  const getStatusClass = (
    status: string
  ) => {
    switch (status) {
      case "Present":
        return "border border-[#22C55E] text-[#22C55E]";

      case "Absent":
        return "border border-[#F97316] text-[#F97316]";

      case "Late":
        return "border border-[#F59E0B] text-[#F59E0B]";

      case "Half day":
        return "border border-[#3B82F6] text-[#3B82F6]";

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
            placeholder="Search id or name..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
            className="w-[220px] h-[40px] pl-9 pr-3 border border-[#E5E7EB] rounded-md text-[13px] outline-none"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-6 mt-10">
        {/* Date */}
        <div>
          <label
            htmlFor="attendance-date"
            className="block text-[18px] font-medium text-[#474747] mb-2"
          >
            Select Date
          </label>

          <input
            id="attendance-date"
            type="date"
            value={selectedDate}
            onChange={(e) =>
              setSelectedDate(
                e.target.value
              )
            }
            className="w-[230px] h-[44px] border border-[#D4D4D4] rounded-md px-3 text-[18px] outline-none"
          />
        </div>

        {/* Department */}
    <div>
  <label className="block text-[18px] font-medium text-[#474747] mb-2">
    Select Department
  </label>

  <div className="relative">
    <select
      value={selectedDepartment}
      onChange={(e) =>
        setSelectedDepartment(e.target.value)
      }
      className="w-[240px] h-[44px] border border-[#D4D4D4] rounded-md px-3 text-[16px] text-[#525252] appearance-none outline-none bg-white"
    >
      {departmentOptions.map((department) => (
        <option
          key={department}
          value={department}
        >
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
      </div>

      {/* Table */}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E5E7EB]">
              <th className="text-left pb-4 text-[18px] font-medium text-[#525252]">
                Staff ID
              </th>

              <th className="text-left pb-4 text-[18px] font-medium text-[#525252]">
                Staff Name
              </th>

              <th className="text-left pb-4 text-[18px] font-medium text-[#525252]">
                Department
              </th>

              <th className="text-left pb-4 text-[18px] font-medium text-[#525252]">
                Designation
              </th>

              <th className="text-left pb-4 text-[18px] font-medium text-[#525252]">
                Status
              </th>

              <th className="text-left pb-4 text-[18px] font-medium text-[#525252]">
                Check-in
              </th>

              <th className="text-left pb-4 text-[18px] font-medium text-[#525252]">
                Check-out
              </th>

              <th className="text-left pb-4 text-[18px] font-medium text-[#525252]">
                Remark
              </th>

              <th className="text-right pb-4 text-[18px] font-medium text-[#525252]">
                Action
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
            ) : filteredAttendanceData.length >
              0 ? (
              filteredAttendanceData.map(
                (item) => (
                  <tr
                    key={
                      item.teacherId
                    }
                    className="border-b border-[#E5E7EB]"
                  >
                    <td className="py-5 text-[16px] text-[#525252]">
                      {
                        item.teacherId
                      }
                    </td>

                    <td className="py-5 text-[16px] text-[#525252]">
                      {
                        item.teacherName
                      }
                    </td>

                    <td className="py-5 text-[16px] text-[#525252]">
                      {item.section}
                    </td>

                    <td className="py-5 text-[16px] text-[#525252]">
                      {
                        item.designation
                      }
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

                    <td className="py-5 text-[16px] text-[#525252]">
                      {
                        item.checkIn
                      }
                    </td>

                    <td className="py-5 text-[16px] text-[#525252]">
                      {
                        item.checkOut
                      }
                    </td>

                    <td className="py-5 text-[16px] text-[#525252]">
                      {item.remark}
                    </td>

                    <td className="py-5">
                      <button
                        type="button"
                        className="flex justify-end w-full"
                        onClick={() =>
                          onEdit(
                            item
                          )
                        }
                      >
                        <SquarePen
                          size={15}
                          className="text-[#3B82F6]"
                        />
                      </button>
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="py-8 text-center text-[#737373]"
                >
                  No staff found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffAttendanceTable;