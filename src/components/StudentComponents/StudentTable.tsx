import React, { useState } from "react";
import { Eye, Edit } from "lucide-react";
import type { StudentTableProps } from "../../pages/StudentPage";

const StudentTable: React.FC<StudentTableProps> = ({ students }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto h-full">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-semibold text-gray-700">ID</span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-semibold text-gray-700">
                  Students
                </span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-semibold text-gray-700">
                  Class
                </span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-semibold text-gray-700">
                  Section/Roll No
                </span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-semibold text-gray-700">
                  Admitted
                </span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-semibold text-gray-700">
                  Fee Status
                </span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-semibold text-gray-700">
                  Attend
                </span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-semibold text-gray-700">
                  Status
                </span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-semibold text-gray-700">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students?.map((student, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm">
                  <a
                    href="#"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {student.id}
                  </a>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {student.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {student.class}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <div>{student.section}</div>
                  <div className="text-xs text-gray-500">{student.rollNo}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {student.admitted}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      student.feeStatus === "Paid"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-orange-50 text-orange-700 border-orange-200"
                    }`}
                  >
                    {student.feeStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {student.attend}%
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      student.status === "Present"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                  >
                    {student.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-3">
                    <button className="text-gray-500 hover:text-gray-700">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-gray-500 hover:text-gray-700">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-3 flex items-center justify-between text-sm">
        <span className="text-gray-600">
          Showing {students?.length} Students
        </span>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
            Previous
          </button>
          <button className="px-3 py-1 rounded bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
            1
          </button>
          <button className="px-3 py-1 rounded bg-blue-600 text-white">
            2
          </button>
          <button className="px-3 py-1 rounded bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
            3
          </button>
          <button className="px-3 py-1 rounded bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentTable;
