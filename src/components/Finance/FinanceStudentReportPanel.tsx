import React, { useState, useEffect, useMemo } from "react";
import { Search, Trash2, Download } from "lucide-react";
import { getFinanceStudentReports } from "../../api/finance";
import * as XLSX from "xlsx";
import { getClasses } from "../../services/classApi";
import StatusBadge from "./StatusBadge";

interface StudentRow {
  course: string;
  studentName: string;
  admissionNumber: string;
  gender: string;
  collectedFees: string;
  attendance: string;
  batch: string;
  parentNumber: string;
  status: "Active" | "Inactive" | "Drop out";
}

const FinanceStudentReportPanel: React.FC = () => {
  const [studentRows, setStudentRows] = useState<StudentRow[]>([]);
  const [reportMeta, setReportMeta] = useState<{
    count: number;
    next: string | null;
    previous: string | null;
  }>({ count: 0, next: null, previous: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 10;

  const batchOptions = ["All Batch", "2019", "2020", "2021"];
  const genderOptions = ["All Gender", "Male", "Female", "Other"];

  const [courseOptions, setCourseOptions] = useState<string[]>(["All Course"]);
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All Course");
  const [selectedBatch, setSelectedBatch] = useState(batchOptions[0]);
  const [selectedGender, setSelectedGender] = useState(genderOptions[0]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setIsLoading(true);
        const classes = await getClasses();
        if (mounted) {
          const labels = classes.map((course) =>
            String(
              course.class_section
                ? `${course.class_name} - ${course.class_section}`
                : course.class_name,
            ),
          );
          const unique = Array.from(new Set(labels)) as string[];
          setCourseOptions(["All Course", ...unique]);
        }

        const data = await getFinanceStudentReports(currentPage, pageSize);
        if (!mounted) return;

        // Handle multiple possible response shapes:
        // 1) data.results is array
        // 2) data.results.data is array
        // 3) data.data is array
        let results: any[] = [];
        if (Array.isArray(data?.results)) results = data.results;
        else if (Array.isArray(data?.results?.data))
          results = data.results.data;
        else if (Array.isArray(data?.data)) results = data.data;
        console.log("Student report raw data:", data);
        console.log("Student report results length:", results.length);
        const mapped = results.map((item: any) => ({
          course: `${item.class_name ?? ""}${item.section ? " - " + item.section : ""}`,
          studentName: item.fullname ?? item.student_name ?? item.name ?? "",
          admissionNumber: item.admission_id ?? item.admissionNumber ?? "",
          gender: item.gender ?? "",
          collectedFees:
            item.collected_fees != null ? String(item.collected_fees) : "",
          attendance: item.attendance_percentage ?? item.attendance ?? "",
          batch: item.batch ?? "",
          parentNumber: item.parent_number ?? item.parentNumber ?? "",
          status: item.student_status ?? item.status ?? "Inactive",
        }));

        setStudentRows(mapped);
        setReportMeta({
          count: data.count ?? 0,
          next: data.next,
          previous: data.previous,
        });
      } catch (error) {
        console.error("Failed to load student reports", error);
      } finally {
        setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [currentPage]);

  const filtered = useMemo(() => {
    return studentRows.filter((r) => {
      const matchesSearch =
        r.studentName.toLowerCase().includes(search.toLowerCase()) ||
        r.admissionNumber.toLowerCase().includes(search.toLowerCase());
      const matchesCourse =
        selectedCourse === courseOptions[0] || r.course === selectedCourse;
      const matchesBatch =
        selectedBatch === batchOptions[0] || r.batch === selectedBatch;
      const matchesGender =
        selectedGender === genderOptions[0] || r.gender === selectedGender;
      return matchesSearch && matchesCourse && matchesBatch && matchesGender;
    });
  }, [search, selectedCourse, selectedBatch, selectedGender, studentRows]);

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#1F2937]">
            Students report
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
            <Trash2 size={16} />
            Delete all
          </button> */}

          <button
            onClick={() => {
              try {
                const exportData = filtered.map((r) => ({
                  Course: r.course,
                  "Student Name": r.studentName,
                  "Admission Number": r.admissionNumber,
                  Gender: r.gender,
                  "Collected Fees": r.collectedFees,
                  Attendance: r.attendance,
                  Batch: r.batch,
                  "Parent Number": r.parentNumber,
                  Status: r.status,
                }));

                const worksheet = XLSX.utils.json_to_sheet(exportData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Student Report");
                XLSX.writeFile(
                  workbook,
                  `student-report-${new Date().toISOString().split("T")[0]}.xlsx`,
                );
              } catch (error) {
                console.error("Student export failed", error);
              }
            }}
            className="inline-flex items-center gap-2 rounded-[10px] border border-[#D1D5DB] bg-white px-4 py-2 text-sm font-semibold text-[#111827] shadow-sm hover:bg-[#F8F8F8]"
          >
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6 max-w-[980px]">
        <div className="flex flex-col gap-2 max-w-[320px]">
          <p className="text-sm font-medium text-[#111827]">Select Course</p>
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
              <th className="px-5 py-4">Course & Std</th>
              <th className="px-5 py-4">Stud Name</th>
              <th className="px-5 py-4">Adm Number</th>
              <th className="px-5 py-4">Gender</th>
              <th className="px-5 py-4"> Fees</th>
              <th className="px-5 py-4">Attendance %</th>
              <th className="px-5 py-4">Batch</th>
              <th className="px-5 py-4">Parent phno</th>
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
                  {r.course}
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">
                  {r.studentName}
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">
                  {r.admissionNumber}
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">{r.gender}</td>
                <td className="px-5 py-4 text-sm text-[#374151]">
                  {r.collectedFees}
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">
                  {r.attendance}
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">{r.batch}</td>
                <td className="px-5 py-4 text-sm text-[#374151]">
                  {r.parentNumber}
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
          Showing {filtered.length} of {reportMeta.count} Students
        </span>
        <div className="flex items-center gap-2 rounded-[10px] border border-[#E5E7EB] bg-white px-3 py-2">
          <button
            disabled={!reportMeta.previous || isLoading}
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className={`rounded-[10px] px-3 py-1 text-sm ${
              !reportMeta.previous
                ? "text-[#9CA3AF]"
                : "text-[#6B7280] hover:bg-[#F8F8F8]"
            }`}
          >
            Previous
          </button>
          {Array.from(
            { length: Math.max(1, Math.ceil(reportMeta.count / pageSize)) },
            (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`rounded-[10px] px-3 py-1 text-sm font-semibold ${
                  currentPage === index + 1
                    ? "bg-[#083b9a] text-white"
                    : "text-[#6B7280] hover:bg-[#F8F8F8]"
                }`}
              >
                {index + 1}
              </button>
            ),
          )}
          <button
            disabled={!reportMeta.next || isLoading}
            onClick={() => setCurrentPage(currentPage + 1)}
            className={`rounded-[10px] px-3 py-1 text-sm ${
              !reportMeta.next
                ? "text-[#9CA3AF]"
                : "text-[#6B7280] hover:bg-[#F8F8F8]"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinanceStudentReportPanel;
