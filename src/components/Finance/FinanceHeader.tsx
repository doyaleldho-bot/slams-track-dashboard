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
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="font-poppins text-[24px] leading-[32px] font-semibold text-gray-900">
          {title}
        </h1>
        <p className="text-gray-600 text-sm mt-1">{description}</p>
      </div>
      <div className="flex items-center gap-4">
        <button className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <CalendarDays size={16} />
          {dateLabel}
        </button>
        <button
          onClick={onExport}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Download size={16} />
          Export Report
        </button>
        {onAddAdmission ? (
          <button
            onClick={onAddAdmission}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md transition-colors"
          >
            + Add Admission
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default FinanceHeader;
