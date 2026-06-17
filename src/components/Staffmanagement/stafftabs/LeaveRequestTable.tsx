import React, { useEffect, useState } from "react";
import { FiSearch as SearchIcon, FiEye as EyeIcon, FiCheck as CheckIcon, FiX as XIcon, FiRefreshCw as RefreshIcon } from "react-icons/fi";
import { Loader2, AlertCircle } from "lucide-react";
import api from "../../../api/axios";
import { toast } from "react-toastify";

interface LeaveRequest {
  id: number;
  teacher_id: string;
  teacher_name: string;
  department: string;
  designation: string;
  leave_type: string;
  from_date: string;
  to_date: string;
  reason: string;
  status: "Approved" | "Reject" | "Rejected" | "Pending";
  created_at: string;
  SubstituteTeacher?: string | null;
  half_day_type?: string | null;
  reachable_contact_number?: string;
  no_of_days: number;
}

export default function LeaveRequestTable() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  // Fetch Leave Requests
  const fetchLeaveRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get("/all-teachers-leave-list/");
      if (res.data && res.data.status) {
        // Map backend objects and compute days count
        const mapped = (res.data.data || []).map((item: any) => {
          let computedDays = 1;
          if (item.from_date && item.to_date) {
            const start = new Date(item.from_date);
            const end = new Date(item.to_date);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            if (!isNaN(diffDays)) {
              computedDays = diffDays;
            }
          }
          return {
            ...item,
            no_of_days: item.no_of_days ?? computedDays,
          };
        });
        setRequests(mapped);
      } else {
        setError(res.data?.message || "Failed to fetch leave requests.");
      }
    } catch (err: any) {
      console.error("Error fetching leave requests:", err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "An error occurred while fetching leave requests."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const updateLeaveStatus = async (id: number, action: "approve" | "reject") => {
    try {
      const res = await api.post("/approve-reject-leave-requets/", {
        leave_id: String(id),
        action,
      });
      if (res.data && res.data.status) {
        // Map lowercase action back to display status
        const displayStatus: "Approved" | "Rejected" =
          action === "approve" ? "Approved" : "Rejected";
        setRequests((prev) =>
          prev.map((req) => (req.id === id ? { ...req, status: displayStatus } : req))
        );
        toast.success(res.data.message || `Leave request ${displayStatus.toLowerCase()} successfully!`);
      } else {
        toast.error(res.data?.message || "Failed to update leave request status.");
      }
    } catch (err: any) {
      console.error("Error updating leave request:", err);
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        "An error occurred while updating status."
      );
    }
  };

  const handleApprove = (id: number) => {
    updateLeaveStatus(id, "approve");
  };

  const handleReject = (id: number) => {
    updateLeaveStatus(id, "reject");
  };

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      (req.teacher_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.leave_type || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.reason || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All Status" ||
      req.status === statusFilter ||
      (statusFilter === "Reject" && req.status === "Rejected");

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col xl:flex-row items-center gap-4 bg-[#F4F6F8] rounded-[18px] p-4">
        <div className="flex items-center gap-3 rounded-[14px] bg-white px-4 h-12 w-full shadow-sm">
          <SearchIcon className="text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by employee, leave type or reason"
            className="outline-none text-sm bg-transparent w-full text-[#2F2F2F] placeholder:text-[#9CA3AF]"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-[#E5E7EB] bg-white rounded-[14px] px-4 h-12 text-sm text-[#2F2F2F] w-full sm:w-auto shadow-sm"
          >
            <option>All Status</option>
            <option>Approved</option>
            <option>Reject</option>
            <option>Pending</option>
          </select>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-[12px] border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[18px] font-semibold text-[#2F2F2F]">
            Leave Requests
          </h3>
          <button
            onClick={fetchLeaveRequests}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-600 disabled:opacity-50 font-medium"
          >
            <RefreshIcon className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[#767676] border-b">
              <tr>
                <th className="text-left py-3 font-semibold">Employee</th>
                <th className="text-left font-semibold">Leave Type</th>
                <th className="text-left font-semibold">Start Date</th>
                <th className="text-left font-semibold">End Date</th>
                <th className="text-left font-semibold">Days</th>
                <th className="text-left font-semibold">Reason</th>
                <th className="text-left font-semibold">Status</th>
                <th className="text-left font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                      <Loader2 className="animate-spin text-blue-500" size={24} />
                      <span>Loading leave requests...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-red-500">
                      <AlertCircle size={24} />
                      <span className="font-medium">Error loading leave requests</span>
                      <span className="text-xs text-gray-500">{error}</span>
                      <button
                        onClick={fetchLeaveRequests}
                        className="mt-2 rounded bg-red-100 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-200"
                      >
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-500">
                    No leave requests found.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((item) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50/50 transition">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold shrink-0">
                          {(item.teacher_name || "S")[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-[#2F2F2F] text-[15px]">
                            {item.teacher_name || "Unknown Staff"}
                          </div>
                          <div className="text-[12px] text-gray-500">
                            {item.designation || "Teaching Staff"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text-gray-700 font-medium">{item.leave_type}</td>
                    <td className="text-gray-600">{item.from_date}</td>
                    <td className="text-gray-600">{item.to_date}</td>
                    <td className="text-gray-700 font-semibold">{item.no_of_days}</td>
                    <td className="text-gray-600">{item.reason || "None"}</td>
                    <td>
                      <span
                        className={`inline-flex px-3 py-1 rounded-[10px] text-xs font-semibold border ${
                          item.status === "Approved"
                            ? "border-green-300 text-green-600 bg-green-50/20"
                            : (item.status === "Reject" || item.status === "Rejected")
                            ? "border-red-300 text-red-500 bg-red-50/20"
                            : "border-yellow-300 text-yellow-600 bg-yellow-50/20"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2.5">
                        {/* View Action */}
                        <button
                          type="button"
                          onClick={() => setSelectedRequest(item)}
                          className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition"
                          title="View Details"
                        >
                          <EyeIcon size={16} />
                        </button>
                        {/* Approve Action */}
                        {item.status !== "Approved" && (
                          <button
                            type="button"
                            onClick={() => handleApprove(item.id)}
                            className="p-1.5 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition"
                            title="Approve"
                          >
                            <CheckIcon size={16} />
                          </button>
                        )}
                        {/* Reject Action */}
                        {item.status !== "Reject" && item.status !== "Rejected" && (
                          <button
                            type="button"
                            onClick={() => handleReject(item.id)}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Reject"
                          >
                            <XIcon size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="bg-[#3B82F6] px-8 py-5">
              <h3 className="text-xl font-medium text-white">
                Leave Request Details
              </h3>
            </div>

            {/* Body */}
            <div className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-x-16 gap-y-6">
                {/* Column 1 */}
                <div className="space-y-6">
                  <div>
                    <span className="text-sm text-gray-500 block mb-1">
                      Leave Request Details
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      {selectedRequest.teacher_name}
                    </span>
                  </div>

                  <div>
                    <span className="text-sm text-gray-500 block mb-1">
                      Start Date
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      {selectedRequest.from_date}
                    </span>
                  </div>

                  <div>
                    <span className="text-sm text-gray-500 block mb-1">
                      Days
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      {selectedRequest.no_of_days}
                    </span>
                  </div>

                  <div>
                    <span className="text-sm text-gray-500 block mb-2">
                      Status
                    </span>
                    <span
                      className={`inline-flex px-4 py-1.5 rounded-[8px] text-sm font-semibold border ${
                        selectedRequest.status === "Approved"
                          ? "border-[#10B981] text-[#10B981] bg-green-50/10"
                          : (selectedRequest.status === "Reject" || selectedRequest.status === "Rejected")
                          ? "border-[#EF4444] text-[#EF4444] bg-red-50/10"
                          : "border-[#F59E0B] text-[#F59E0B] bg-yellow-50/10"
                      }`}
                    >
                      {selectedRequest.status}
                    </span>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-6">
                  <div>
                    <span className="text-sm text-gray-500 block mb-1">
                      Leave Type
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      {selectedRequest.leave_type}
                    </span>
                  </div>

                  <div>
                    <span className="text-sm text-gray-500 block mb-1">
                      End Date
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      {selectedRequest.to_date}
                    </span>
                  </div>

                  <div>
                    <span className="text-sm text-gray-500 block mb-1">
                      Reason
                    </span>
                    <span className="text-lg font-semibold text-gray-900 block leading-relaxed">
                      {selectedRequest.reason || "None"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="px-6 py-2 bg-[#E5E7EB] hover:bg-gray-300 text-gray-700 font-medium rounded-lg text-sm transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
