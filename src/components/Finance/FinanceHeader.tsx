import React from "react";
import { CalendarDays, Download } from "lucide-react";

interface FinanceHeaderProps {
  title: string;
  description: string;
  dateLabel: string;
  onExport: () => void;
  onAddAdmission?: () => void;
}

const FinanceHeader: React.FC<FinanceHeaderProps> = ({
  title,
  description,
  dateLabel,
  onExport,
  onAddAdmission,
}) => {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between mb-8">
      <div>
        <p className="text-sm text-gray-500">Finance</p>
        <h1 className="text-3xl font-semibold text-[#1F2937]">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm text-gray-600">{description}</p>
      </div>

      <div className="flex flex-wrap items-start justify-end gap-3 sm:items-center">
        <button className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
          <CalendarDays size={16} />
          {dateLabel}
        </button>
        <button
          onClick={onExport}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#083b9a] shadow-sm hover:bg-gray-50 border border-gray-200"
        >
          <Download size={16} />
          Export Report
        </button>
        {onAddAdmission ? (
          <button
            onClick={onAddAdmission}
            className="inline-flex items-center gap-2 rounded-full bg-[#083b9a] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#062d75]"
          >
            + Add Admission
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default FinanceHeader;
