import React, { useEffect, useState } from "react"
import { Download, ChevronLeft, ChevronRight } from "lucide-react"
import api from "../../api/axios";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

interface DashboardData {
  total_logins: number;
  total_failed_logins: number;
  active_sessions: number;
  password_resets: number;
}

interface Staff {
  id: number;
  user_id: string;
  staff_name: string;
  designation: string;
  photo: string | null;
}

interface LoginHistory {
  id: number;
  user_id: string;
  fullname: string;
  role: string;
  login_time: string;
  logout_time: string | null;
  device_name: string;
  browser: string | null;
  ip_address: string;
  location: string;
  login_status: string;
}

interface ActiveSession {
  id: number;
  user_id: string;
  fullname: string;
  role: string;
  device_name: string;
  browser: string;
  ip_address: string;
  location: string;
  is_active: boolean;
}






const Security = () => {
const [selectedStaff, setSelectedStaff] =
  useState<Staff | null>(null);

const [staffs, setStaffs] = useState<Staff[]>([]);
  const [searchName, setSearchName] = useState("")
  const [searchDate, setSearchDate] = useState("")

  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 7

  const handleResetPassword = async () => {
  if (!selectedStaff) return;

  try {
    const response = await api.post(
      "/security/reset-password/",
      {
        user_id: selectedStaff.user_id,
        send_email: true,
        remarks: "Password reset requested by admin",
      }
    );

    toast.success(
      // `Temporary Password: ${response.data.temporary_password}`
      "temporary password was send successfully"
    );
  } catch (error) {
    console.error(error);
  }
};

  const [dashboard, setDashboard] =
  useState<DashboardData | null>(null);

const [activeSessions, setActiveSessions] =
  useState<ActiveSession[]>([]);

const [loginHistory, setLoginHistory] =
  useState<LoginHistory[]>([]);
const [loading, setLoading] = useState(false);


const fetchStaffs = async () => {
  try {
    const response = await api.get(
      "/list-teaching-staff/"
    );

    setStaffs(response.data.data);

    if (response.data.data.length > 0) {
      setSelectedStaff(response.data.data[0]);
    }
  } catch (error) {
    console.error(error);
  }
};


const fetchDashboard = async () => {
  try {
    const response = await api.get(
      "/security/dashboard/"
    );

    setDashboard(response.data.data);
  } catch (error) {
    console.error(error);
  }
};

const fetchActiveSessions = async () => {
  try {
    const response = await api.get(
      "/security/active-sessions/"
    );

    setActiveSessions(response.data.data);
  } catch (error) {
    console.error(error);
  }
};


const fetchLoginHistory = async () => {
  try {
    const params = new URLSearchParams();

    if (searchName) {
      params.append("name", searchName);
    }

    if (searchDate) {
      params.append("login_date", searchDate);
    }

    const response = await api.get(
      `/security/login-history/?${params.toString()}`
    );
console.log(response.data);

    setLoginHistory(response.data.data || []);
  } catch (error) {
    console.error(error);
  }
};


const handleSignoutSession = async (
  sessionId: number
) => {
  try {
    await api.post(
      "/security/session-signout/",
      {
        session_id: sessionId,
      }
    );

    fetchActiveSessions();
  } catch (error) {
    console.error(error);
  }
};
const handleExport = () => {
  try {
    const exportData = loginHistory.map((item) => ({
      "Login Date": new Date(item.login_time).toLocaleDateString(),
      Name: item.fullname,
      "Login Time": new Date(item.login_time).toLocaleTimeString(),
      "Logout Time": item.logout_time
        ? new Date(item.logout_time).toLocaleTimeString()
        : "--",
      "Device Type": item.device_name,
      "Browser / App": item.browser || "--",
      "IP Address": item.ip_address,
      Location: item.location || "--",
      "Login Status": item.login_status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Login History"
    );

    XLSX.writeFile(
      workbook,
      `login-history-${new Date()
        .toISOString()
        .split("T")[0]}.xlsx`
    );
  } catch (error) {
    console.error("Export Error:", error);
  }
};


// const handleLogoutAllDevices = async () => {
//   try {
//     const response = await api.post(
//       "/security/logout-all-devices/"
//     );

//     alert(response.data.message);

//     fetchActiveSessions();
//     fetchLoginHistory();
//   } catch (error) {
//     console.error(error);
//   }
// };

const handleForceLogout = async () => {
  try {
    const response = await api.post(
      "/security/force-logout/"
    );

    alert(response.data.message);

    fetchActiveSessions();
    fetchLoginHistory();
  } catch (error) {
    console.error(error);
  }
};








  const filteredLoginHistory = loginHistory || [];

  //pagination logic
const totalPages = Math.max(
  1,
  Math.ceil(filteredLoginHistory.length / itemsPerPage)
)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const paginatedData = filteredLoginHistory.slice(startIndex, endIndex)

  //visible pages logic
  const maxVisiblePages = 4

  const startPage =
    Math.floor((currentPage - 1) / maxVisiblePages) * maxVisiblePages + 1

  const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages)

  const visiblePages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  )

  //reset to page 1 when filters change
  const totalRecords = filteredLoginHistory.length

  const startRecord = (currentPage - 1) * itemsPerPage + 1

  const endRecord = Math.min(currentPage * itemsPerPage, totalRecords)

 useEffect(() => {
  fetchStaffs();
  fetchDashboard();
  fetchActiveSessions();
}, []);

useEffect(() => {
  fetchLoginHistory();
  setCurrentPage(1);
}, [searchName, searchDate]);

  return (
    <div className="space-y-6 p-6 w-full max-w-[1200px]">
      <div className="rounded-2xl bg-white p-4 md:p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[320px_1fr_auto]">
          {/* Staff ID */}
          <div>
            <label className="mb-2 block text-sm font-semibold">Staff ID</label>

            <select
value={selectedStaff?.user_id || ""}              onChange={(e) => {
               const staff = staffs.find(
  (s) => s.user_id === e.target.value
)
                if (staff) setSelectedStaff(staff)
              }}
              className="h-12 w-full rounded-xl border border-[#D9D9D9] px-4 outline-none"
            >
              {staffs.map((staff) => (
                <option key={staff.user_id} value={staff.user_id}>
                 {staff.user_id}
                </option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold">Name</label>

            <input
              readOnly
              value={selectedStaff?.staff_name || ""}
              className="h-12 w-full rounded-xl border border-[#D9D9D9] px-4"
            />
          </div>

          {/* Reset Button */}
          <div className="flex items-end">
            <button
              onClick={handleResetPassword}
              className="h-12 rounded-xl border border-[#D9D9D9] px-5 text-sm font-medium hover:bg-gray-50"
            >
              Reset Password
            </button>
          </div>
        </div>
      </div>
      {/* Profile Section */}
      {selectedStaff && (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-2xl font-semibold text-white shadow-lg">
              {selectedStaff.staff_name
  ?.split(" ")
  .map((n) => n[0])
  .join("")
  .slice(0, 2)}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[#2F2F2F]">
                {selectedStaff.staff_name}
              </h2>

              <p className="text-sm text-[#767676]">{selectedStaff.designation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Session Management */}
      <div className="rounded-2xl bg-white shadow-sm px-6 py-4">
        <div className="mb-6">
          <h3 className="text-lg font-bold font-arimo text-[#101828]">
            Session Management
          </h3>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#E5E7EB] mb-6">
          <table className="w-full min-w-max border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#8FAAE5] text-left text-sm text-white">
                <th className="rounded-tl-xl px-6 py-3">Name</th>
                <th className=" px-6 py-3">ID</th>
                <th className=" px-6 py-3">Device</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Status</th>
                <th className="rounded-tr-xl px-6 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {activeSessions.map((session, index) => (
                <tr
                  key={index}
                  className={`text-sm ${
                    index !== activeSessions.length - 1
                      ? "border-b border-[#F1F1F1]"
                      : ""
                  }`}
                >
                  <td className="px-6 py-4">{session.fullname}</td>
                  <td className="px-6 py-4">{session.user_id}</td>
                  <td className="px-6 py-4">{session.device_name}</td>

                  <td className="px-6 py-4">{session.location}</td>

                 <td className="px-6 py-4">
  <span
    className={`font-medium ${
      session.is_active
        ? "text-green-600"
        : "text-gray-500"
    }`}
  >
    {session.is_active ? "Active Now" : "Inactive"}
  </span>
</td>

                  <td className="px-6 py-4 text-right">
                    <button className="text-[#E7000B] border p-2 rounded-lg hover:bg-red-200"
  onClick={() =>
    handleSignoutSession(session.id)
  }
>
  Sign Out
</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

<div className="flex gap-5">

<button
  onClick={handleForceLogout}
  className="text-[#E7000B] text-[14px] border p-2 rounded-lg hover:bg-red-200"
>
  Force Logout
</button> 
{/* <button
onClick={() => handleLogoutAllDevices()}
 className="text-[#E7000B] text-[14px] border p-2 rounded-lg hover:bg-red-200">
  Logout From All Devices
  </button>   */}
  </div>
      </div>

      {/* Login History */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-[28px] font-semibold text-[#3F3F3F]">
            Login History
          </h3>

         <button
  onClick={handleExport}
  className="flex items-center gap-2 rounded-lg border border-[#D9D9D9] bg-white px-4 py-2 text-sm text-[#444] hover:bg-gray-50"
>
            Export Report
          </button>
        </div>

        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#444]">
              Login Date
            </label>

            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="h-10 w-full sm:w-[180px] rounded-lg border border-[#D9D9D9] px-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#444]">
              Name
            </label>

            <input
              type="text"
              placeholder="Enter Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="h-10 w-full sm:w-[180px] rounded-lg border border-[#D9D9D9] px-3 outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-[#D9D9D9] text-left">
                <th className="pb-4 text-[16px] font-semibold text-[#4A4A4A]">
                  Login Date
                </th>
                <th className="pb-4 text-[16px] font-semibold text-[#4A4A4A]">
                  Name
                </th>
                <th className="pb-4 text-[16px] font-semibold text-[#4A4A4A]">
                  Login Time
                </th>
                <th className="pb-4 text-[16px] font-semibold text-[#4A4A4A]">
                  Logout Time
                </th>
                <th className="pb-4 text-[16px] font-semibold text-[#4A4A4A]">
                  Device Type
                </th>
                <th className="pb-4 text-[16px] font-semibold text-[#4A4A4A]">
                  Browser / App
                </th>
                <th className="pb-4 text-[16px] font-semibold text-[#4A4A4A]">
                  IP Address
                </th>
                <th className="pb-4 text-[16px] font-semibold text-[#A5A5A5]">
                  Location
                </th>
                <th className="pb-4 text-[16px] font-semibold text-[#4A4A4A]">
                  Login Status
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-[#E5E5E5] text-[15px]"
                >
                  <td className="py-4">{new Date(item.login_time).toLocaleDateString()}</td>
                  <td className="py-4">{item.fullname}</td>
                  <td className="py-4">{new Date(item.login_time).toLocaleTimeString()}</td>
                  <td className="py-4">{item.logout_time
  ? new Date(item.logout_time).toLocaleTimeString()
  : "--"}</td>
                  <td className="py-4">{item.device_name}</td>
                  <td className="py-4">{item.browser}</td>
                  <td className="py-4">{item.ip_address}</td>

                  <td className="py-4 text-[#A0A0A0]">
                  {item.location || "--"}
                  </td>

                  <td className="py-4">
                    <span
                      className={`inline-flex min-w-[100px] justify-center rounded-lg border px-3 py-1 text-sm font-medium ${
                        item.login_status === "SUCCESS"
                          ? "border-green-500 text-green-600"
                          : "border-red-500 text-red-500"
                      }`}
                    >
                    {item.login_status}                   
 </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-[#767676]">
            Showing {startRecord} to {endRecord} of {totalRecords} Records
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className={`rounded-md border px-3 py-1 text-sm ${
                currentPage === 1
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-gray-100"
              }`}
            >
              Previous
            </button>

            {visiblePages.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`rounded-md px-3 py-1 text-sm ${
                  currentPage === page
                    ? "bg-[#EAF2FF] text-[#2563EB]"
                    : "border border-[#D9D9D9]"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className={`rounded-md border px-3 py-1 text-sm ${
                currentPage === totalPages
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Security
