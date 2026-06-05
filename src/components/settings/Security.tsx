import React, { useEffect, useState } from "react"
import { Download, ChevronLeft, ChevronRight } from "lucide-react"

const activeSessions = [
  {
    device: "Chrome-PC-1",
    location: "Kochi, INDIA",
    status: "Active Now",
  },
  {
    device: "Chrome-PC-2",
    location: "Riyadh, Saudi",
    status: "Last Seen",
  },
  {
    device: "Chrome-PC-3",
    location: "Goa, India",
    status: "Offline",
  },
]

const loginHistory = [
  {
    date: "21-05-2025",
    name: "Devan",
    loginTime: "11:00 AM",
    logoutTime: "11:00 PM",
    device: "Mobile",
    browser: "Android App",
    ip: "192.168.1.20",
    location: "Kochi",
    status: "Successful",
  },
  {
    date: "21-05-2025",
    name: "Devan",
    loginTime: "11:00 AM",
    logoutTime: "11:00 PM",
    device: "Mobile",
    browser: "Android App",
    ip: "192.168.1.25",
    location: "Kochi",
    status: "Failed",
  },
  {
    date: "21-05-2025",
    name: "Devan",
    loginTime: "11:00 AM",
    logoutTime: "11:00 PM",
    device: "Mobile",
    browser: "Android App",
    ip: "192.168.1.15",
    location: "Kochi",
    status: "Successful",
  },
  {
    date: "21-05-2025",
    name: "Devan",
    loginTime: "11:00 AM",
    logoutTime: "11:00 PM",
    device: "Mobile",
    browser: "Android App",
    ip: "192.168.1.35",
    location: "Kochi",
    status: "Successful",
  },
]

const staffs = [
  {
    id: "SUPADM1234",
    name: "Devan Thomas",
    role: "Super Admin",
    initial: "D",
  },
  {
    id: "EMP1001",
    name: "Arun Kumar",
    role: "Teacher",
    initial: "A",
  },
  {
    id: "EMP1002",
    name: "Athira",
    role: "Accountant",
    initial: "AT",
  },
]

const Security = () => {
  const [selectedStaff, setSelectedStaff] = useState<any | null>(null)

  const [searchName, setSearchName] = useState("")
  const [searchDate, setSearchDate] = useState("")

  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 7

  const handleResetPassword = () => {
    alert(
      `Password reset link sent for ${selectedStaff?.name || "the selected staff"}`,
    )
  }

  //filtering logic
  const filteredLoginHistory = loginHistory.filter((item) => {
    const matchName = item?.name
      .toLowerCase()
      .includes(searchName.toLowerCase())

    const formattedDate = item.date // 21-05-2025

    const matchDate = searchDate
      ? (() => {
          const [year, month, day] = searchDate.split("-")
          const selectedDate = `${day}-${month}-${year}`
          return formattedDate === selectedDate
        })()
      : true

    return matchName && matchDate
  })

  //pagination logic
  const totalPages = Math.ceil(filteredLoginHistory.length / itemsPerPage)

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
    setCurrentPage(1)
  }, [searchName, searchDate])

  return (
    <div className="space-y-6 p-6 w-full max-w-[1200px]">
      <div className="rounded-2xl bg-white p-4 md:p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[320px_1fr_auto]">
          {/* Staff ID */}
          <div>
            <label className="mb-2 block text-sm font-semibold">Staff ID</label>

            <select
              value={selectedStaff?.id || ""}
              onChange={(e) => {
                const staff = staffs.find((s) => s.id === e.target.value)
                if (staff) setSelectedStaff(staff)
              }}
              className="h-12 w-full rounded-xl border border-[#D9D9D9] px-4 outline-none"
            >
              {staffs.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.id}
                </option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold">Name</label>

            <input
              readOnly
              value={selectedStaff?.name || ""}
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
              {selectedStaff.initial}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[#2F2F2F]">
                {selectedStaff.name}
              </h2>

              <p className="text-sm text-[#767676]">{selectedStaff.role}</p>
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
                <th className="rounded-tl-xl px-6 py-3">Device</th>
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
                  <td className="px-6 py-4">{session.device}</td>

                  <td className="px-6 py-4">{session.location}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`font-medium ${
                        session.status === "Active Now"
                          ? "text-green-600"
                          : session.status === "Last Seen"
                            ? "text-blue-600"
                            : "text-gray-500"
                      }`}
                    >
                      {session.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button className="text-red-500 hover:text-red-600">
                      Sign Out
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Login History */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-[28px] font-semibold text-[#3F3F3F]">
            Login History
          </h3>

          <button className="flex items-center gap-2 rounded-lg border border-[#D9D9D9] bg-white px-4 py-2 text-sm text-[#444] hover:bg-gray-50">
            <Download size={16} />
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
              {filteredLoginHistory.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-[#E5E5E5] text-[15px]"
                >
                  <td className="py-4">{item.date}</td>
                  <td className="py-4">{item.name}</td>
                  <td className="py-4">{item.loginTime}</td>
                  <td className="py-4">{item.logoutTime}</td>
                  <td className="py-4">{item.device}</td>
                  <td className="py-4">{item.browser}</td>
                  <td className="py-4">{item.ip}</td>

                  <td className="py-4 text-[#A0A0A0]">
                    Kochi,
                    <br />
                    Kerala
                  </td>

                  <td className="py-4">
                    <span
                      className={`inline-flex min-w-[100px] justify-center rounded-lg border px-3 py-1 text-sm font-medium ${
                        item.status === "Successful"
                          ? "border-green-500 text-green-600"
                          : "border-red-500 text-red-500"
                      }`}
                    >
                      {item.status}
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
