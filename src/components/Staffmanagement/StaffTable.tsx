import React from "react";
import { FiEdit2, FiSearch, FiTrash2 } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import AssignSubstitute from ".//stafftabs/AssignSubstitute";
import NonTeachingTable from "../Staffmanagement/NonTeachingTable";
import SubstituteList from "../Staffmanagement/stafftabs/SubstituteList";
import type { SubstituteDetails } from "./SubstituteDetailsModal";

interface Props {
  mainTab: string;
  staffTypeTab: string;
  subTab: string;
  substituteAssignments?: SubstituteDetails[];
  onSubstituteAssigned?: (assignment: SubstituteDetails) => void;
  teacherList?: any[];
  nonTeachingList?: any[];
}

const sampleData = [
  {
    id: "TCH001",
    name: "Sarah Johnson",
    phone: "+1 234-567-8901",
    email: "sarah.j@school.com",
    department: "Mathematics",
    attendance: "92%",
    status: "Active",
  },
];

type StaffRecord = {
  id: string;
  name: string;
  phone: string;
  email: string;
  department: string;
  attendance?: string;
  status?: string;
  [key: string]: any;
};

type StaffTableProps = Props & {
  onEditStaff?: (staff: StaffRecord) => void;
  onDeleteStaff?: (id: string) => void;
};

const StaffTable = ({
  mainTab,
  staffTypeTab,
  subTab,
  substituteAssignments = [],
  onSubstituteAssigned,
  teacherList,
  nonTeachingList,
  onEditStaff,
  onDeleteStaff,
}: Props & {
  onEditStaff?: (staff: any) => void;
  onDeleteStaff?: (id: string) => void;
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [departmentFilter, setDepartmentFilter] = React.useState(
    "All Department"
  );
  const [statusFilter, setStatusFilter] = React.useState("All Status");

  const items: StaffRecord[] =
    teacherList && teacherList.length ? (teacherList as StaffRecord[]) : sampleData;

  const filteredItems = items.filter((item: StaffRecord) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === "" ||
      item.name.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query);
    const matchesDepartment =
      departmentFilter === "All Department" ||
      item.department === departmentFilter;
    const matchesStatus =
      statusFilter === "All Status" || item.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  if (mainTab === "Non-Teaching Staff") {
    return <NonTeachingTable data={nonTeachingList || []} />;
  }

  if (
    mainTab === "Teaching Staff" &&
    staffTypeTab === "Substitute" &&
    subTab === "Assign Substitute"
  ) {
    return <AssignSubstitute onSubstituteAssigned={onSubstituteAssigned} />;
  }

  if (
    mainTab === "Teaching Staff" &&
    staffTypeTab === "Substitute" &&
    subTab === "Substitute List"
  ) {
    return <SubstituteList assignments={substituteAssignments} />;
  }

  // 🔥 DEFAULT → NORMAL TABLE (Teacher / Non-Teaching)
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col xl:flex-row items-center gap-4 bg-[#F4F6F8] rounded-[18px] p-4">
        <div className="flex items-center gap-3 rounded-[14px] bg-white px-4 h-12 w-full shadow-sm">
          <FiSearch className="text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or Id"
            className="outline-none text-sm bg-transparent w-full text-[#2F2F2F] placeholder:text-[#9CA3AF]"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="border border-[#E5E7EB] bg-white rounded-[14px] px-4 h-12 text-sm text-[#2F2F2F] w-full xl:w-auto"
          >
            <option>All Department</option>
            <option>Mathematics</option>
            <option>Physics</option>
            <option>Chemistry</option>
            <option>Biology</option>
            <option>Computer Science</option>
            <option>English</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-[#E5E7EB] bg-white rounded-[14px] px-4 h-12 text-sm text-[#2F2F2F] w-full xl:w-auto"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[12px] border p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[#767676] border-b">
              <tr>
                <th className="text-left py-3">Teacher ID</th>
                <th className="text-left">Photo</th>
                <th className="text-left">Teacher Name</th>
                <th className="text-left">Phone</th>
                <th className="text-left">Email</th>
                <th className="text-left">Department</th>
                <th className="text-left">Attendance %</th>
                <th className="text-left">Status</th>
                <th className="text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 text-indigo-600 font-medium">{item.id}</td>
                  <td>
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <FaUser className="text-gray-500 text-xs" />
                    </div>
                  </td>
                  <td>{item.name}</td>
                  <td>{item.phone}</td>
                  <td>{item.email}</td>
                  <td>{item.department}</td>
                  <td
                    className={`font-medium ${
                      item.attendance === "92%"
                        ? "text-green-600"
                        : item.attendance === "82%"
                        ? "text-blue-600"
                        : "text-orange-500"
                    }`}
                  >
                    {item.attendance}
                  </td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        item.status === "Active"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="inline-flex items-center justify-center gap-4">
<button
                        className="text-indigo-600"
                        aria-label="Edit staff"
                        onClick={() => onEditStaff?.(item)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="text-red-600"
                        aria-label="Delete staff"
                        onClick={() => onDeleteStaff?.(item.id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4 text-sm text-[#767676]">
          <p>
            Showing {filteredItems.length} of {items.length} Staff
          </p>

          <div className="flex gap-2">
            <button className="px-2 py-1 border rounded">Previous</button>
            <button className="px-2 py-1 bg-indigo-600 text-white rounded">1</button>
            <button className="px-2 py-1 border rounded">2</button>
            <button className="px-2 py-1 border rounded">3</button>
            <button className="px-2 py-1 border rounded">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffTable;

