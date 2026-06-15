import React, { useEffect, useState } from "react";
import api from "../../api/axios";

interface StudentApi {
  id: number;
  student_id: string;
  fullname: string;
  phone_number: string;
  class_name: string;
  section_roll: {
    section: string;
    roll_no: string;
  };
  admission_date: string;
  fee_status: string;
  attendance_date: string;
  attendance_status: string;
  status: string;
}

interface StudentResponse {
  status: boolean;
  message: string;
  total_students: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  data: StudentApi[];
}

const StudentAdmissionTrend = () => {
  const [showAll, setShowAll] = useState(false);
  const [students, setStudents] = useState<StudentApi[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const response = await api.get<StudentResponse>(
        "/student-list/?status=all&class_id=4&page=1&section=A"
      );

      setStudents(response.data.data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const visibleData = showAll ? students : students.slice(0, 7);

  const feeBadge = (status: string) => {
    return status === "Paid"
      ? "border border-green-500 text-green-600 bg-green-50"
      : "border border-orange-500 text-orange-600 bg-orange-50";
  };

  const statusBadge = (status: string) => {
    return status === "Active"
      ? "border border-green-500 text-green-600 bg-green-50"
      : "border border-gray-400 text-gray-400 bg-gray-50";
  };

  return (
    <div className="w-full rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-[18px] font-semibold text-gray-800">
        Student Admission Trend
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
              <th className="pb-4">Attendance</th>
              <th className="pb-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="py-10 text-center">
                  Loading...
                </td>
              </tr>
            ) : visibleData.length > 0 ? (
              visibleData.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-transparent text-[14px] font-medium text-[#101828] last:border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-2">
                    <span className="font-medium text-[#155DFC] hover:underline cursor-pointer">
                      {student.student_id}
                    </span>
                  </td>

                  <td className="py-2 text-gray-800">
                    {student.fullname}
                  </td>

                  <td className="py-2 text-gray-800">
                    {student.class_name}
                  </td>

                  <td className="py-2">
                    <div className="flex flex-col leading-4">
                      <span className="font-medium text-gray-700">
                        {student.section_roll?.section || "---"}
                      </span>

                      <span className="text-gray-500">
                        Roll: {student.section_roll?.roll_no || "---"}
                      </span>
                    </div>
                  </td>

                  <td className="py-2 text-gray-800">
                    {new Date(
                      student.admission_date
                    ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  <td className="py-2">
                    <span
                      className={`rounded-md px-3 py-1 text-xs font-medium ${feeBadge(
                        student.fee_status
                      )}`}
                    >
                      {student.fee_status}
                    </span>
                  </td>

                  <td
                    className={`py-2 text-xs font-medium ${
                      student.attendance_status === "Present"
                        ? "text-green-600"
                        : "text-orange-500"
                    }`}
                  >
                    {student.attendance_status}
                  </td>

                  <td className="py-2">
                    <span
                      className={`rounded-md px-3 py-1 text-xs font-medium ${statusBadge(
                        student.status
                      )}`}
                    >
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-10 text-center">
                  No students found
                </td>
              </tr>
            )}
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