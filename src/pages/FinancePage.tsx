import React, { useState } from "react";
import { Landmark } from "lucide-react";
import {
  FinanceHeader,
  FinanceStats,
  FinanceTabs,
  FinanceNoteCard,
  FinanceAdmissionPanel,
} from "../components/Finance";
import type { FinanceStatItem } from "../components/Finance";

const FinancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Payroll");

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
    <div className="p-6">
      <FinanceHeader
        title="Finance"
        description="Track admissions, payments, and financial records in one place."
        dateLabel="Today: May 23, 2026"
        onExport={handleExport}
        onAddAdmission={
          activeTab === "Admission" ? handleAddAdmission : undefined
        }
      />

      <div className="rounded-[32px] bg-[#F3F4F9] p-6 shadow-sm">
        <FinanceStats stats={statsData} />

        <div className="mt-8 flex justify-center">
          <FinanceTabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        <div className="mt-8">
          {activeTab === "Admission" ? (
            <FinanceAdmissionPanel />
          ) : (
            <FinanceNoteCard
              title="Important Note"
              description="This Page is Under Construction"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancePage;
