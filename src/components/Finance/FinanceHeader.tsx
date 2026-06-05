import React, { useRef } from "react";
import { CalendarDays, Download } from "lucide-react";

interface FinanceHeaderProps {
  title: string;
  description: string;
  selectedDate: string;
  onSelectedDateChange: (value: string) => void;
  onExport: () => void;
  onAddAdmission?: () => void;
}

const FinanceHeader: React.FC<FinanceHeaderProps> = ({
  title,
  description,
  selectedDate,
  onSelectedDateChange,
  onExport,
  // onAddAdmission,
}) => {
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  const handleDateButtonClick = () => {
    const input = dateInputRef.current;
    if (!input) return;

    if (typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }

    input.focus();
    input.click();
  };

  const formatHeaderDate = () => {
    if (!selectedDate) return "Select date";

    const today = new Date().toISOString().slice(0, 10);
    const dateValue = new Date(selectedDate);

    if (selectedDate === today) {
      return `Today: ${dateValue.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;
    }

    return dateValue.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 className="font-poppins text-[24px] leading-[32px] font-semibold text-gray-900">
          {title}
        </h1>
        <p className="text-gray-600 text-sm mt-1">{description}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
          <button
            type="button"
            onClick={handleDateButtonClick}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700"
          >
            <CalendarDays size={16} className="text-gray-600" />
            <span>{formatHeaderDate()}</span>
          </button>
          <input
            ref={dateInputRef}
            type="date"
            value={selectedDate}
            onChange={(event) => onSelectedDateChange(event.target.value)}
            className="absolute inset-0 h-full w-full opacity-0 pointer-events-none"
          />
        </div>
        <button
          onClick={onExport}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Download size={16} />
          Export Report
        </button>
        {/* {onAddAdmission ? (
          <button
            onClick={onAddAdmission}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md transition-colors"
          >
            + Add Admission
          </button>
        ) : null} */}
      </div>
    </div>
  );
};

export default FinanceHeader;
