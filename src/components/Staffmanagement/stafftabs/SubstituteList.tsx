import React, { useEffect, useState } from "react";
import { FiSearch, FiEye, FiRefreshCw } from "react-icons/fi";
import { Loader2, AlertCircle } from "lucide-react";
import api from "../../../api/axios";
import SubstituteDetailsModal, {
  type SubstituteDetails,
} from "../../Staffmanagement/SubstituteDetailsModal";



type SubstituteListProps = {
  assignments?: SubstituteDetails[];
};

const SubstituteList = ({ assignments: localAssignments = [] }: SubstituteListProps) => {
  const [selectedSubstitute, setSelectedSubstitute] = useState<SubstituteDetails | null>(null);
  const [assignments, setAssignments] = useState<SubstituteDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Format selectedDate as YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [batchFilter, setBatchFilter] = useState("All Batch");
  const [sectionFilter, setSectionFilter] = useState("All Section");

  const fetchAssignments = React.useCallback(async (dateStr: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get(`/list-substitute-teacher-assignments/?date=${dateStr}`);
      if (res.data && res.data.status) {
        const mapped: SubstituteDetails[] = (res.data.assignments || []).map((item: any) => ({
          id: item.substitute_teacher_id ? String(item.substitute_teacher_id) : String(item.assignment_id),
          regularTeacher: item.original_teacher_name || "Unknown",
          substituteTeacher: item.substitute_teacher_name || "Unknown",
          batch: item.class_name || "Class 9th",
          section: item.period ? `Period ${item.period}` : "A",
          date: dateStr,
          reason: item.reason || "Substitution requested",
          reasonDescription: `${item.original_teacher_name} is substituted by ${item.substitute_teacher_name} for ${item.subject || "subject"} in ${item.class_name || "class"} during period ${item.period || "N/A"}.`,
        }));
        setAssignments(mapped);
      } else {
        setError(res.data?.message || "Failed to fetch substitute assignments.");
      }
    } catch (err: any) {
      console.error("Error fetching substitute assignments:", err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "An error occurred while fetching substitute assignments."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignments(selectedDate);
  }, [selectedDate, fetchAssignments]);

  // Merge API data and locally-added assignments
  const tableData = [...localAssignments, ...assignments];

  const filteredItems = tableData.filter((item) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === "" ||
      item.substituteTeacher.toLowerCase().includes(query) ||
      item.regularTeacher.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query);
    const matchesBatch =
      batchFilter === "All Batch" || item.batch === batchFilter;
    const matchesSection =
      sectionFilter === "All Section" || item.section === sectionFilter;
    return matchesSearch && matchesBatch && matchesSection;
  });

  return (
    <>
      <div className="bg-white rounded-[12px] border p-4">
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] font-medium text-[#2F2F2F]">
              Substitute Assignment List
            </h3>
            <button
              onClick={() => fetchAssignments(selectedDate)}
              disabled={isLoading}
              className="flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-600 disabled:opacity-50 font-medium"
            >
              <FiRefreshCw className={isLoading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          <div className="flex flex-col xl:flex-row items-center gap-4 bg-[#F4F6F8] rounded-[18px] p-4">
            {/* Search */}
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

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto shrink-0">
              {/* Date Selector */}
              <div className="relative flex items-center bg-white border border-[#E5E7EB] rounded-[14px] px-4 h-12 text-sm text-[#2F2F2F] w-full sm:w-auto shadow-sm">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="outline-none bg-transparent w-full h-full cursor-pointer text-gray-700 font-medium"
                />
              </div>

              {/* Batch Filter */}
              <select
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
                className="border border-[#E5E7EB] bg-white rounded-[14px] px-4 h-12 text-sm text-[#2F2F2F] w-full sm:w-auto shadow-sm"
              >
                <option>All Batch</option>
                {Array.from(new Set(tableData.map((d) => d.batch))).map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>

              {/* Section Filter */}
              <select
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
                className="border border-[#E5E7EB] bg-white rounded-[14px] px-4 h-12 text-sm text-[#2F2F2F] w-full sm:w-auto shadow-sm"
              >
                <option>All Section</option>
                {Array.from(new Set(tableData.map((d) => d.section))).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[#767676] border-b">
              <tr>
                <th className="text-left py-3">Substitute ID</th>
                <th className="text-left">Regular Teacher</th>
                <th className="text-left">Substitute Teacher</th>
                <th className="text-left">Batch</th>
                <th className="text-left">Section</th>
                <th className="text-left">Date</th>
                <th className="text-left">Reason</th>
                <th className="text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                      <Loader2 className="animate-spin text-blue-500" size={24} />
                      <span>Fetching substitute assignments...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-red-500">
                      <AlertCircle size={24} />
                      <span className="font-medium">Error loading assignments</span>
                      <span className="text-xs text-gray-500">{error}</span>
                      <button
                        type="button"
                        onClick={() => fetchAssignments(selectedDate)}
                        className="mt-2 rounded bg-red-100 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-200"
                      >
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-500">
                    No substitute assignments found for this filter/date.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, index) => (
                  <tr
                    key={`${item.id}-${item.regularTeacher}-${index}`}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-3 text-indigo-600 font-medium">{item.id}</td>
                    <td>{item.regularTeacher}</td>
                    <td>{item.substituteTeacher}</td>
                    <td>{item.batch}</td>
                    <td>{item.section}</td>
                    <td>{item.date}</td>
                    <td>
                      <span className="rounded-full border border-orange-300 px-3 py-1 text-xs text-orange-500 bg-orange-50/50">
                        {item.reason}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => setSelectedSubstitute(item)}
                        className="text-gray-600 hover:text-black"
                        aria-label={`View substitute details for ${item.substituteTeacher}`}
                      >
                        <FiEye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedSubstitute && (
        <SubstituteDetailsModal
          substitute={selectedSubstitute}
          onClose={() => setSelectedSubstitute(null)}
        />
      )}
    </>
  );
};

export default SubstituteList;
