import React, { useMemo, useState } from "react";
import { Search, Trash2, Download } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface TeacherRow {
  id: string;
  name: string;
  joinedDate: string;
  gender: string;
  salary: string;
  attendance: string;
  inChargeClasses: string;
  teacherNumber: string;
  status: "Active" | "Inactive" | "Resign";
}

const teacherRows: TeacherRow[] = [
  {
    id: "TE123",
    name: "Devanand",
    joinedDate: "21-05-2026",
    gender: "Male",
    salary: "$25000",
    attendance: "75%",
    inChargeClasses: "10th A Section",
    teacherNumber: "3625012589",
    status: "Active",
  },
  {
    id: "TE124",
    name: "Deva",
    joinedDate: "21-05-2026",
    gender: "Male",
    salary: "$25000",
    attendance: "35%",
    inChargeClasses: "B.com 1st Year",
    teacherNumber: "6525895641",
    status: "Inactive",
  },
  {
    id: "TE125",
    name: "Deva",
    joinedDate: "21-05-2026",
    gender: "Male",
    salary: "$25000",
    attendance: "35%",
    inChargeClasses: "B.com 1st Year",
    teacherNumber: "6352145258",
    status: "Resign",
  },
  {
    id: "TE126",
    name: "Devika",
    joinedDate: "21-05-2026",
    gender: "Female",
    salary: "$25000",
    attendance: "35%",
    inChargeClasses: "B.com 1st Year",
    teacherNumber: "958745623",
    status: "Resign",
  },
  {
    id: "TE127",
    name: "Deva",
    joinedDate: "21-05-2026",
    gender: "Male",
    salary: "$25000",
    attendance: "35%",
    inChargeClasses: "B.com 1st Year",
    teacherNumber: "9874563214",
    status: "Resign",
  },
];

const courseOptions = [
  "All Course & Standard",
  "All Course",
  "10th Standard",
  "B.com 1st Year",
  "M.com",
  "BCA",
];
const batchOptions = ["All Batch", "2019", "2020", "2021"];
const genderOptions = ["All Gender", "Male", "Female", "Other"];

const FinanceTeacherReportPanel: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(courseOptions[0]);
  const [selectedBatch, setSelectedBatch] = useState(batchOptions[0]);
  const [selectedGender, setSelectedGender] = useState(genderOptions[0]);
  const [selectAll, setSelectAll] = useState(false);

  const filtered = useMemo(() => {
    return teacherRows.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase());
      const matchesCourse =
        selectedCourse === courseOptions[0] ||
        r.inChargeClasses === selectedCourse;
      const matchesBatch =
        selectedBatch === batchOptions[0] || r.teacherNumber === selectedBatch;
      const matchesGender =
        selectedGender === genderOptions[0] || r.gender === selectedGender;
      return matchesSearch && matchesCourse && matchesBatch && matchesGender;
    });
  }, [search, selectedCourse, selectedBatch, selectedGender]);

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#1F2937]">
            Teacher report
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3 justify-end">
          <div className="relative w-full sm:w-[260px]">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search id or name..."
              className="h-11 w-full rounded-[10px] border border-[#E5E7EB] bg-white pl-11 pr-4 text-sm text-[#444] outline-none focus:border-[#083b9a]"
            />
          </div>

          {/* <label className="inline-flex items-center gap-2 text-sm font-medium text-[#444] whitespace-nowrap">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={() => setSelectAll((p) => !p)}
              className="h-4 w-4 rounded border-gray-300 text-[#083b9a]"
            />
            Select all
          </label> */}

          {/* <button className="inline-flex items-center gap-2 rounded-[10px] border border-[#F74D57] bg-[#FFF5F7] px-4 py-2 text-sm font-semibold text-[#F74D57] hover:bg-[#FFE6EB]">
            <Trash2 size={16} /> Delete all
          </button> */}
          <button className="inline-flex items-center gap-2 rounded-[10px] border border-[#D1D5DB] bg-white px-4 py-2 text-sm font-semibold text-[#111827] shadow-sm hover:bg-[#F8F8F8]">
            <Download size={16} /> Export Report
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6 max-w-[980px]">
        <div className="flex flex-col gap-2 max-w-[320px]">
          <p className="text-sm font-medium text-[#111827]">
            Select Course & Standard
          </p>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="h-11 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-4 text-sm text-[#111827] outline-none"
          >
            {courseOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2 max-w-[320px]">
          <p className="text-sm font-medium text-[#111827]">Batch-wise</p>
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="h-11 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-4 text-sm text-[#111827] outline-none"
          >
            {batchOptions.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2 max-w-[320px]">
          <p className="text-sm font-medium text-[#111827]">Gender</p>
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="h-11 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-4 text-sm text-[#111827] outline-none"
          >
            {genderOptions.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-0 overflow-x-auto">
        <table className="w-full border-collapse text-left min-w-[900px]">
          <thead>
            <tr className="text-sm uppercase tracking-[0.15em] text-[#6B7280]">
              <th className="px-5 py-4">Teacher ID</th>
              <th className="px-5 py-4">Teacher Name</th>
              <th className="px-5 py-4">Joined Date</th>
              <th className="px-5 py-4">Gender</th>
              <th className="px-5 py-4">Salary</th>
              <th className="px-5 py-4">Attendance Percentage</th>
              <th className="px-5 py-4">In-charge Classes</th>
              <th className="px-5 py-4">Teacher Number</th>
              <th className="px-5 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr
                key={i}
                className="border-t border-[#F1F5F9] hover:bg-[#F9FAFB]"
              >
                <td className="px-5 py-4 text-sm font-medium text-[#111827]">
                  {r.id}
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">{r.name}</td>
                <td className="px-5 py-4 text-sm text-[#374151]">
                  {r.joinedDate}
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">{r.gender}</td>
                <td className="px-5 py-4 text-sm text-[#374151]">{r.salary}</td>
                <td className="px-5 py-4 text-sm text-[#374151]">
                  {r.attendance}
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">
                  {r.inChargeClasses}
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">
                  {r.teacherNumber}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge
                    label={r.status}
                    variant={
                      r.status === "Active"
                        ? "active"
                        : r.status === "Inactive"
                          ? "inactive"
                          : "failed"
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-[#6B7280]">
        <span>
          Showing {filtered.length} of {teacherRows.length} Teachers
        </span>
        <div className="flex items-center gap-2 rounded-[10px] border border-[#E5E7EB] bg-white px-3 py-2">
          <button className="rounded-[10px] px-3 py-1 text-sm text-[#6B7280] hover:bg-[#F8F8F8]">
            Previous
          </button>
          <button className="rounded-[10px] px-3 py-1 text-sm text-[#6B7280] hover:bg-[#F8F8F8]">
            1
          </button>
          <button className="rounded-[10px] bg-[#083b9a] px-3 py-1 text-sm font-semibold text-white">
            2
          </button>
          <button className="rounded-[10px] px-3 py-1 text-sm text-[#6B7280] hover:bg-[#F8F8F8]">
            3
          </button>
          <button className="rounded-[10px] px-3 py-1 text-sm text-[#6B7280] hover:bg-[#F8F8F8]">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinanceTeacherReportPanel;
