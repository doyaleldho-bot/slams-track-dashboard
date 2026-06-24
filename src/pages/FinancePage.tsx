import React, { useState, useEffect } from "react";
import { Landmark } from "lucide-react";
import * as XLSX from "xlsx";
import {
  FinanceHeader,
  FinanceStats,
  FinanceTabs,
  FinanceNoteCard,
  FinanceAdmissionPanel,
  FinanceReportPanel,
  FinanceStudentReportPanel,
  FinanceTeacherReportPanel,
  ReturnVsExpenseChart,
} from "../components/Finance";
import type { FinanceStatItem } from "../components/Finance";
import { getFinanceDashboard, getFinanceAdmissions } from "../api/finance";

const FinancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Payroll");
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [currentPage, setCurrentPage] = useState(1);

  const [statsData, setStatsData] = useState<FinanceStatItem[]>([
    {
      title: "Total Admission",
      value: "-",
      icon: <Landmark size={18} className="text-[#083b9a]" />,
      subtitle: undefined,
    },
    {
      title: "Total Amount Collected",
      value: "-",
      icon: <Landmark size={18} className="text-[#083b9a]" />,
    },
    {
      title: "Admission Pending amount",
      value: "-",
      icon: <Landmark size={18} className="text-[#083b9a]" />,
    },
  ]);

  const [admissionsData, setAdmissionsData] = useState<{
    count: number;
    next: string | null;
    previous: string | null;
    results: any[];
  } | null>(null);
  const [admissionsLoading, setAdmissionsLoading] = useState(false);

  const hasNextPage = Boolean(admissionsData?.next);
  const hasPreviousPage = Boolean(admissionsData?.previous);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await getFinanceDashboard();

        if (!mounted) return;

        const stats: FinanceStatItem[] = [
          {
            title: "Total Admission",
            value:
              data?.total_students ??
              data?.total_admission_revenue ??
              data?.total_admission ??
              0,
            icon: <Landmark size={18} className="text-[#083b9a]" />,
            subtitle: data?.active_students
              ? `Active students ${data.active_students}`
              : undefined,
          },
          {
            title: "Total Fee Collection",
            value:
              data?.total_fee_collection ?? data?.total_amount_collected ?? 0,
            icon: <Landmark size={18} className="text-[#083b9a]" />,
          },
          {
            title: "Total Pending Amount",
            value: data?.total_pending_amount ?? data?.pending_amount ?? 0,
            icon: <Landmark size={18} className="text-[#083b9a]" />,
          },
        ];

        setStatsData(stats);
      } catch (err: unknown) {
        console.error("Failed to fetch finance dashboard", err);
        const e = err as any;
        if (e?.response?.status === 401) {
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [selectedDate]);

  // Fetch admissions when tab is "Admission"
  useEffect(() => {
    if (activeTab !== "Admission") return;

    let mounted = true;

    (async () => {
      setAdmissionsLoading(true);
      try {
        const data = await getFinanceAdmissions(currentPage, 10);

        if (!mounted) return;

        const mapped = {
          ...data,
          results: data.results.map((item: any) => {
            const courseName = item.class_name ?? item.course ?? "";
            const section = item.class_section ?? item.section ?? "";
            const courseLabel = section
              ? `${courseName} - ${section}`
              : courseName;

            return {
              id: item.admission_id
                ? String(item.admission_id)
                : String(item.id),
              internalId: String(item.id),
              studentName: item.student_name ?? "",
              gender: item.gender ?? "",
              birthDate: item.admission_date ?? "",
              course: courseLabel,
              class_id: item.class_id ?? item.course_id ?? undefined,
              section: item.class_section ?? item.section ?? undefined,
              admissionDate: item.admission_date ?? "",
              admissionAmount: item.admission_amount ?? "",
              courseFee: item.course_fee ?? "",
              discountAmount: item.discount_amount ?? item.discount ?? "",
              receiptId: item.admission_id ?? String(item.id),
              paidAmount: item.paid_amount ?? "",
              balanceAmount: item.balance_amount ?? item.balance ?? "",
              paymentMode: item.payment_mode ?? "",
              paymentStatus: item.payment_status ?? "Pending",
              fatherName: item.father_name ?? "",
              motherName: item.mother_name ?? "",
              address: item.address ?? "",
              mobileNumber: item.mobile_number ?? "",
              email: item.email ?? "",
              documents: item.documents ?? [],
            };
          }),
        };

        setAdmissionsData(mapped);
        setAdmissionsLoading(false);
      } catch (err: unknown) {
        console.error("Failed to fetch admissions", err);
        const e = err as any;
        if (e?.response?.status === 401) {
          localStorage.clear();
          window.location.href = "/login";
          return;
        }
        if (!mounted) return;
        setAdmissionsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [activeTab, currentPage]);

  const tabs = ["Payroll", "Admission", "Reports"];

  const handleExport = () => {
    try {
      const statsExport = statsData.map((stat) => ({
        Metric: stat.title,
        Value: stat.value,
        Details: stat.subtitle ?? "",
      }));

      const admissionExport =
        admissionsData?.results.map((item) => ({
          "Admission ID": item.receiptId,
          "Student Name": item.studentName,
          Course: item.course,
          "Admission Date": item.admissionDate,
          "Admission Amount": item.admissionAmount,
          "Course Fee": item.courseFee,
          "Discount Amount": item.discountAmount,
          "Paid Amount": item.paidAmount,
          "Balance Amount": item.balanceAmount,
          "Payment Mode": item.paymentMode,
          "Payment Status": item.paymentStatus,
        })) ?? [];

      const workbook = XLSX.utils.book_new();

      const statsSheet = XLSX.utils.json_to_sheet(statsExport);
      XLSX.utils.book_append_sheet(workbook, statsSheet, "Finance Summary");

      if (admissionExport.length > 0) {
        const admissionsSheet = XLSX.utils.json_to_sheet(admissionExport);
        XLSX.utils.book_append_sheet(workbook, admissionsSheet, "Admissions");
      }

      XLSX.writeFile(
        workbook,
        `finance-dashboard-export-${new Date().toISOString().split("T")[0]}.xlsx`,
      );
    } catch (error) {
      console.error("Finance dashboard export failed", error);
    }
  };

  const handleAddAdmission = () => {
    console.log("Add admission");
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto">
        <FinanceHeader
          title="Finance"
          description="Track admissions, payments, and financial records in one place."
          selectedDate={selectedDate}
          onSelectedDateChange={setSelectedDate}
          onExport={handleExport}
          onAddAdmission={
            activeTab === "Admission" ? handleAddAdmission : undefined
          }
        />

        <div className="space-y-6">
          <FinanceStats stats={statsData} />

          <div className="flex justify-start">
            <FinanceTabs
              tabs={tabs}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          </div>

          {activeTab === "Admission" ? (
            <FinanceAdmissionPanel
              admissions={admissionsData?.results}
              admissionCount={admissionsData?.count ?? 0}
              currentPage={currentPage}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              onPageChange={setCurrentPage}
              loading={admissionsLoading}
            />
          ) : activeTab === "Reports" ? (
            <div>
              <div className="mb-4">
                {/* <div className="inline-flex rounded-full bg-[#F3F4F6] p-1">
                  <button
                    onClick={() => setActiveTab((_) => "Reports")}
                    className={`px-5 py-2 rounded-full text-sm font-medium ${
                      true ? "text-[#6B7280]" : ""
                    }`}
                  >
                    Course report
                  </button>
                  <button
                    onClick={() => setActiveTab((_) => "Reports")}
                    className={`px-5 py-2 rounded-full text-sm font-medium ${
                      true ? "bg-[#474747] text-white rounded-full" : ""
                    }`}
                  >
                    Students report
                  </button>
                </div> */}
              </div>

              <div className="grid gap-6">
                <FinanceReportPanel />
                <FinanceStudentReportPanel />
                <FinanceTeacherReportPanel />
              </div>
              <div className="mt-6">
                <ReturnVsExpenseChart />
              </div>
            </div>
          ) : (
            <div className="rounded-[10px] bg-white p-6 shadow-sm">
              <FinanceNoteCard
                title="Important Note"
                description="This Page is Under Construction"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancePage;
