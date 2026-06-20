import React, { useState, useEffect, useMemo } from "react";

import { Search, Download } from "lucide-react";
import * as XLSX from "xlsx";
import StatusBadge from "./StatusBadge";
import { getFinanceCourseReports } from "../../api/finance";
import { getClasses } from "../../services/classApi";

interface ReportRow {
  course: string;
  duration: string;
  activeStudents: number;
  completedStudents: number;
  revenue: string;
  pendingFees: string;
  totalTeachers: number;
  batch: string;
  status: "Active" | "Inactive";
}

const batchOptions = ["All Batch", "Batch 1", "Batch 2", "Batch 3", "Batch 4"];

const FinanceReportPanel: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All Course");
  const [selectedBatch, setSelectedBatch] = useState(batchOptions[0]);
  const [courseOptions, setCourseOptions] = useState<string[]>(["All Course"]);
  const [reportRows, setReportRows] = useState<ReportRow[]>([]);
  const [reportMeta, setReportMeta] = useState<{
    count: number;
    next: string | null;
    previous: string | null;
  }>({ count: 0, next: null, previous: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 10;

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

        const data = await getFinanceCourseReports(currentPage, pageSize);

        if (!mounted) return;

        const results = data?.results ?? [];

        const mapped = results.map((item: any) => ({
          course: item.course_standard ?? item.course_name ?? item.course ?? "",
          duration: item.duration ?? "",
          activeStudents: item.active_students ?? 0,
          completedStudents: item.completed_students ?? 0,
          revenue: item.revenue_generated ?? item.revenue ?? "",
          pendingFees: item.pending_fees ?? "",
          totalTeachers: item.total_teachers ?? 0,
          batch: item.batch ?? "",
          status: item.status ?? "Inactive",
        }));

        setReportRows(mapped);
        setReportMeta({
          count: data.count ?? 0,
          next: data.next,
          previous: data.previous,
        });
      } catch (error) {
        console.error("Failed to load course reports", error);
      } finally {
        setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [currentPage]);

  const filteredRows = useMemo(() => {
    return reportRows.filter((row) => {
      const matchesSearch =
        row.course.toLowerCase().includes(search.toLowerCase()) ||
        row.batch.toLowerCase().includes(search.toLowerCase());
      const matchesCourse =
        selectedCourse === "All Course" || row.course === selectedCourse;
      const matchesBatch =
        selectedBatch === batchOptions[0] || row.batch === selectedBatch;
      return matchesSearch && matchesCourse && matchesBatch;
    });
  }, [search, selectedCourse, selectedBatch, reportRows]);

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#1F2937]">
            Course report
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

          <button
            onClick={() => {
              try {
                const exportData = filteredRows.map((row) => ({
                  Course: row.course,
                  Duration: row.duration,
                  "Active Students": row.activeStudents,
                  "Completed Students": row.completedStudents,
                  Revenue: row.revenue,
                  "Pending Fees": row.pendingFees,
                  "Total Teachers": row.totalTeachers,
                  Batch: row.batch,
                  Status: row.status,
                }));

                const worksheet = XLSX.utils.json_to_sheet(exportData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(
                  workbook,
                  worksheet,
                  "Course Report",
                );
                XLSX.writeFile(
                  workbook,
                  `course-report-${new Date().toISOString().split("T")[0]}.xlsx`,
                );
              } catch (error) {
                console.error("Course export failed", error);
              }
            }}
            className="inline-flex items-center gap-2 rounded-[10px] border border-[#D1D5DB] bg-white px-4 py-2 text-sm font-semibold text-[#111827] shadow-sm hover:bg-[#F8F8F8]"
          >
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-6 max-w-[480px]">
        <div className="flex flex-col gap-2 max-w-[340px]">
          <p className="text-sm font-medium text-[#111827]">Select Course</p>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="h-11 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-4 text-sm text-[#111827] outline-none"
          >
            {courseOptions.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 max-w-[340px]">
          <p className="text-sm font-medium text-[#111827]">Batch-wise</p>
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="h-11 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-4 text-sm text-[#111827] outline-none"
          >
            {batchOptions.map((batch) => (
              <option key={batch} value={batch}>
                {batch}
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
              <th className="px-5 py-4">Duration</th>
              <th className="px-5 py-4">Active Stud</th>
              <th className="px-5 py-4">Completed Stud</th>
              <th className="px-5 py-4">Revenue Generated</th>
              <th className="px-5 py-4">Pending Fees</th>
              <th className="px-5 py-4">Total Teachers</th>
              <th className="px-5 py-4">Batch</th>
              <th className="px-5 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row, index) => (
              <tr
                key={index}
                className="border-t border-[#F1F5F9] hover:bg-[#F9FAFB]"
              >
                <td className="px-5 py-4 text-sm font-medium text-[#111827]">
                  {row.course}
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">
                  {row.duration}
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">
                  {row.activeStudents}
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">
                  {row.completedStudents}
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">
                  {row.revenue}
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">
                  {row.pendingFees}
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">
                  {row.totalTeachers}
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">
                  {row.batch}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge
                    label={row.status}
                    variant={row.status === "Active" ? "active" : "inactive"}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-[#6B7280]">
        <span>
          Showing {filteredRows.length} of {reportMeta.count} Courses
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

export default FinanceReportPanel;
