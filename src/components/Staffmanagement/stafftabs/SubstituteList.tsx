import React from "react";
import { FiSearch, FiEye } from "react-icons/fi";
import SubstituteDetailsModal, {
  type SubstituteDetails,
} from "../../Staffmanagement/SubstituteDetailsModal";

const data: SubstituteDetails[] = [
  {
    id: "TCH003",
    regularTeacher: "Michael Chen",
    substituteTeacher: "Sarah John",
    batch: "2024-A",
    section: "A",
    date: "2026-05-28",
    reason: "Teacher On Leave",
    reasonDescription:
      "Regular teacher has requested medical leave for personal health reasons. Expected to return on May 28, 2026.",
  },
  {
    id: "TCH003",
    regularTeacher: "Lisa Martinez",
    substituteTeacher: "Emily Rodriguez",
    batch: "2024-A",
    section: "A",
    date: "2026-05-26",
    reason: "Emergency",
    reasonDescription:
      "Regular teacher is unavailable due to an emergency assignment change. Substitute coverage has been arranged for the listed class.",
  },
];

type SubstituteListProps = {
  assignments?: SubstituteDetails[];
};

const SubstituteList = ({ assignments = [] }: SubstituteListProps) => {
  const [selectedSubstitute, setSelectedSubstitute] =
    React.useState<SubstituteDetails | null>(null);
  const tableData = [...assignments, ...data];

  return (
    <>
      <div className="bg-white rounded-[12px] border p-4">
        <div className="mb-6 space-y-4">
          <h3 className="text-[16px] font-medium text-[#2F2F2F]">
            Substitute Assignment List
          </h3>

          <div className="flex flex-col xl:flex-row items-center gap-4 bg-[#F4F6F8] rounded-[18px] p-4">
            <div className="flex items-center gap-3 rounded-[14px] bg-white px-4 h-12 w-full shadow-sm">
              <FiSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or Id"
                className="outline-none text-sm bg-transparent w-full text-[#2F2F2F] placeholder:text-[#9CA3AF]"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
              <select className="border border-[#E5E7EB] bg-white rounded-[14px] px-4 h-12 text-sm text-[#2F2F2F] w-full xl:w-auto">
                <option>All Batch</option>
                <option>2024-A</option>
                <option>2024-B</option>
              </select>

              <select className="border border-[#E5E7EB] bg-white rounded-[14px] px-4 h-12 text-sm text-[#2F2F2F] w-full xl:w-auto">
                <option>All Section</option>
                <option>A</option>
                <option>B</option>
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
              {tableData.map((item, index) => (
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
                  <td>{item.reason}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => setSelectedSubstitute(item)}
                      className="text-gray-600 hover:text-black"
                      aria-label={`View substitute details for ${item.substituteTeacher}`}
                    >
                      <FiEye />
                    </button>
                  </td>
                </tr>
              ))}
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
