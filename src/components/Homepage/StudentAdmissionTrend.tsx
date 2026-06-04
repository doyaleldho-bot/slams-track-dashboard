import React, { useState } from "react";

const StudentAdmissionTrend = () => {
  const [showAll, setShowAll] = useState(false);

  const students = [
    {
      id: "School-1234",
      name: "Aarav Sharma",
      class: "Class 10",
      section: "Section A",
      rollNo: "10A01",
      admitted: "12 Jun 2025",
      feeStatus: "Paid",
      attendance: "92%",
      status: "Active",
    },
    {
      id: "School-1234",
      name: "Aarav Sharma",
      class: "Class 10",
      section: "Section A",
      rollNo: "10A01",
      admitted: "12 Jun 2025",
      feeStatus: "Pending",
      attendance: "85%",
      status: "Active",
    },
    {
      id: "School-1234",
      name: "Aarav Sharma",
      class: "Class 10",
      section: "Section A",
      rollNo: "10A01",
      admitted: "12 Jun 2025",
      feeStatus: "Paid",
      attendance: "60%",
      status: "Inactive",
    },
    {
      id: "School-1234",
      name: "Aarav Sharma",
      class: "Class 10",
      section: "Section A",
      rollNo: "10A01",
      admitted: "12 Jun 2025",
      feeStatus: "Pending",
      attendance: "85%",
      status: "Active",
    },
    {
      id: "School-1234",
      name: "Aarav Sharma",
      class: "Class 10",
      section: "Section A",
      rollNo: "10A01",
      admitted: "12 Jun 2025",
      feeStatus: "Pending",
      attendance: "85%",
      status: "Active",
    },
    {
      id: "School-1234",
      name: "Aarav Sharma",
      class: "Class 10",
      section: "Section A",
      rollNo: "10A01",
      admitted: "12 Jun 2025",
      feeStatus: "Paid",
      attendance: "60%",
      status: "Inactive",
    },
    {
      id: "School-1234",
      name: "Aarav Sharma",
      class: "Class 10",
      section: "Section A",
      rollNo: "10A01",
      admitted: "12 Jun 2025",
      feeStatus: "Paid",
      attendance: "60%",
      status: "Inactive",
    },
    {
      id: "School-1234",
      name: "Aarav Sharma",
      class: "Class 10",
      section: "Section A",
      rollNo: "10A01",
      admitted: "12 Jun 2025",
      feeStatus: "Pending",
      attendance: "88%",
      status: "Active",
    },
    {
      id: "School-1234",
      name: "Aarav Sharma",
      class: "Class 10",
      section: "Section A",
      rollNo: "10A01",
      admitted: "12 Jun 2025",
      feeStatus: "Paid",
      attendance: "95%",
      status: "Active",
    },
  ];

  const visibleData = showAll ? students : students.slice(0, 7);

  const feeBadge = (status) => {
    return status === "Paid"
      ? "border border-green-500 text-green-600 bg-green-50"
      : "border border-orange-500 text-orange-600 bg-orange-50";
  };

  const statusBadge = (status) => {
    return status === "Active"
      ? "border border-green-500 text-green-600 bg-green-50"
      : "border border-gray-400 text-gray-400 bg-gray-50";
  };

  const attendanceColor = (attendance) => {
    const value = parseInt(attendance);

    if (value >= 90) return "text-green-600";
    if (value >= 80) return "text-green-600";

    return "text-orange-500";
  };

  return (
    <div className="w-full rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-[18px] font-semibold text-gray-800">
        Student admission trend
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="text-left text-[18px] font-bold text-[#4A5565]">
              <th className="pb-4">ID</th>
              <th className="pb-4">Students</th>
              <th className="pb-4">Class</th>
              <th className="pb-4">Section/Roll No</th>
              <th className="pb-4">Admitted</th>
              <th className="pb-4">Fee Status</th>
              <th className="pb-4">Attend</th>
              <th className="pb-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {visibleData.map((student, index) => (
              <tr
                key={index}
                className="border-b border-transparent text-[14px] font-medium text-[#101828] last:border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <td className="py-2">
                  <span className="cursor-pointer font-medium text-[#155DFC] hover:underline">
                    {student.id}
                  </span>
                </td>

                <td className="py-2 text-gray-800">{student.name}</td>

                <td className="py-2 text-gray-800">{student.class}</td>

                <td className="py-2">
                  <div className="flex flex-col leading-4">
                    <span className="font-medium text-gray-700">
                      {student.section}
                    </span>
                    <span className="text-gray-500">
                      Roll: {student.rollNo}
                    </span>
                  </div>
                </td>

                <td className="py-2 text-gray-800">{student.admitted}</td>

                <td className="py-2">
                  <span
                    className={`rounded-md px-3 py-1 text-xs font-medium ${feeBadge(
                      student.feeStatus,
                    )}`}
                  >
                    {student.feeStatus}
                  </span>
                </td>

                <td
                  className={`py-2 text-xs font-medium ${attendanceColor(
                    student.attendance,
                  )}`}
                >
                  {student.attendance}
                </td>

                <td className="py-2">
                  <span
                    className={`rounded-md px-3 py-1 text-xs font-medium ${statusBadge(
                      student.status,
                    )}`}
                  >
                    {student.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {students.length > 7 && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-medium text-blue-500 hover:text-blue-600 hover:underline"
          >
            {showAll ? "View less" : "View more"}
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentAdmissionTrend;
