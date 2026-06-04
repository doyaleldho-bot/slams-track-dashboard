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
    <div className="inline-flex h-11 w-full max-w-[611px] overflow-hidden rounded-full border border-[#E5E7EB] bg-[#F8F8F8] shadow-sm">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`flex-1 h-full rounded-full px-4 text-sm font-medium transition duration-200 ${
            activeTab === tab
              ? "bg-[#474747] text-white"
              : "text-[#20232A] hover:bg-white"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default FinanceTabs;
