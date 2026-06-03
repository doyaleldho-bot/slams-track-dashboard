import React from "react";

interface FinanceTabsProps {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
}

const FinanceTabs: React.FC<FinanceTabsProps> = ({
  tabs,
  activeTab,
  onChange,
}) => {
  return (
    <div className="inline-flex rounded-full bg-gray-100 p-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
            activeTab === tab
              ? "bg-[#083b9a] text-white"
              : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default FinanceTabs;
