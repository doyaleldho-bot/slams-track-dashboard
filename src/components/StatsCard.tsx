import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  subtitle?: string;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  subtitle,
  icon,
}) => {
  return (
    <div className="bg-white rounded-[10px] border border-[#E5E7EB] flex flex-col gap-4 shadow-[0_8px_12px_-6px_rgba(0,0,0,0.12)] w-full min-h-[172px] p-6">
      <div className="flex items-start justify-between gap-6">
        <p className="text-[14px] font-medium text-gray-500">{title}</p>

        <div className="w-8 h-8 rounded-full flex items-center justify-center">
          {icon}
        </div>
      </div>

      <div className="pt-6">
        <h2 className="text-[20px] font-medium">{value}</h2>

        {change && <p className="text-xs text-green-600">{change}</p>}

        {subtitle && (
          <p className="text-[14px] text-[#1B84FF] pt-2">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
