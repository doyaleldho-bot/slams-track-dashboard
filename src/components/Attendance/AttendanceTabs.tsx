import React from "react";

interface AttendanceTabsProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

const tabs = [
  "Teacher Attendance",
  "Student Attendance",
  "Staff Attendance",
];

const AttendanceTabs: React.FC<AttendanceTabsProps> = ({
  activeTab,
  onChange,
}) => {
  return (
    <div className="inline-flex  bg-white rounded-full p-1 border border-[#E5E7EB]">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-8 h-7 text-[15px] lg:text-[20px]  font-semibold rounded-full transition-all ${
            activeTab === tab
              ? "bg-[#4B5563] text-white"
              : "text-[#4B5563]"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default AttendanceTabs;