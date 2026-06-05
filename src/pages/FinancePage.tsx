import React, { useState } from "react";
import { Landmark } from "lucide-react";
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

const FinancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Payroll");
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );

  const statsData: FinanceStatItem[] = [
    {
      title: "Total Admission",
      value: "842 / 900",
      icon: <Landmark size={18} className="text-[#083b9a]" />,
      subtitle: "Admission rate 92%",
    },
    {
      title: "Total Amount Collected",
      value: "$1,50,000",
      icon: <Landmark size={18} className="text-[#083b9a]" />,
    },
    {
      title: "Admission Pending amount",
      value: "$1,50,000",
      icon: <Landmark size={18} className="text-[#083b9a]" />,
    },
  ];

  const tabs = ["Payroll", "Admission", "Reports"];

  const handleExport = () => {
    console.log("Export report");
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
            <FinanceAdmissionPanel />
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
