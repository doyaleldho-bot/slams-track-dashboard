import React from "react";
import { FiSearch, FiEdit2, FiTrash2 } from "react-icons/fi";
import { FaUser } from "react-icons/fa";

interface NonTeachingTableProps {
  data?: any[];
  isLoading?: boolean;
  error?: string | null;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onEditStaff?: (staff: any) => void;
  onDeleteStaff?: (id: string) => void;
}

const NonTeachingTable: React.FC<NonTeachingTableProps> = ({
  data = [],
  isLoading = false,
  error = null,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onEditStaff,
  onDeleteStaff,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [departmentFilter, setDepartmentFilter] = React.useState("All Department");
  const [statusFilter, setStatusFilter] = React.useState("All Status");

  // Normalise API fields → display fields
  const items = data.map((t) => ({
    ...t,
    id: t.user_id ?? t.id,
    name: t.staff_name ?? t.name,
    phone: t.phone_number ?? t.phone,
    dbId: t.id,
  }));

  const filteredItems = items.filter((item) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === "" ||
      item.name?.toLowerCase().includes(query) ||
      String(item.id).toLowerCase().includes(query);
    const matchesDepartment =
      departmentFilter === "All Department" ||
      item.department === departmentFilter;
    const matchesStatus =
      statusFilter === "All Status" || item.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="bg-[#F4F6F8] rounded-[18px] p-4 h-16 animate-pulse" />
        <div className="bg-white rounded-[12px] border p-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center py-16 text-red-500 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
            <option>Administration</option>
            <option>Library</option>
            <option>Transport</option>
            <option>Front Office</option>
            <option>Cafeteria</option>
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
                <th className="text-left py-3">Staff ID</th>
                <th className="text-left">Photo</th>
                <th className="text-left">Name</th>
                <th className="text-left">Phone</th>
                <th className="text-left">Email</th>
                <th className="text-left">Department</th>
                {/* <th className="text-left">Attendance %</th> */}
                {/* <th className="text-left">Status</th> */}
                <th className="text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 text-indigo-600 font-medium">{item.id}</td>
                  <td>
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {item.photo ? (
                        <img
                          src={item.photo}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                          }}
                        />
                      ) : (
                        <FaUser className="text-gray-500 text-xs" />
                      )}
                    </div>
                  </td>
                  <td>{item.name}</td>
                  <td>{item.phone}</td>
                  <td>{item.email}</td>
                  <td>{item.department}</td>
                  {/* <td
                    className={`font-medium ${
                      item.attendance === "95%"
                        ? "text-green-600"
                        : item.attendance === "88%"
                        ? "text-blue-600"
                        : "text-orange-500"
                    }`}
                  >
                    {item.attendance}
                  </td> */}
                  {/* <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        item.status === "Active"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td> */}
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
            Showing {filteredItems.length} of {items.length} staff
            {totalPages > 1 && ` — Page ${currentPage} of ${totalPages}`}
          </p>
          {totalPages > 1 && (
            <div className="flex gap-2">
              <button
                className="px-2 py-1 border rounded disabled:opacity-40"
                disabled={currentPage <= 1}
                onClick={() => onPageChange?.(currentPage - 1)}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => onPageChange?.(i + 1)}
                  className={`px-2 py-1 rounded ${
                    currentPage === i + 1
                      ? "bg-indigo-600 text-white"
                      : "border"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="px-2 py-1 border rounded disabled:opacity-40"
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange?.(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NonTeachingTable;

