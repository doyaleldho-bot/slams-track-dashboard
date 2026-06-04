import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  subtitle?: string;
  icon: React.ReactNode;
  highlight?: boolean;
  width?: string;
  height?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  subtitle,
  icon,
  highlight = false,
  width = "252px",
  height = "172px",
}) => {
  return (
    <div
      className="bg-white rounded-[14px] border flex flex-col gap-2 shadow-[0_8px_12px_-6px_rgba(0,0,0,0.15)] w-full"
      style={{
        maxWidth: width,
        minHeight: height,
        padding: "25.23px 25.23px 1.25px 25.23px",
        borderWidth: "1.25px",
        borderColor: highlight ? "#3B82F6" : "#E5E7EB",
      }}
    >
      <div className="flex items-center justify-between">
        <p className="text-[14px] font-medium text-gray-500">
          {title}
        </p>

        <div className="w-8 h-8 rounded-full flex items-center justify-center">
          {icon}
        </div>
      </div>

      <div className="pt-6">
        <h2 className="text-[20px] font-medium">
          {value}
        </h2>

        {change && (
          <p className="text-xs text-green-600">
            {change}
          </p>
        )}

        {subtitle && (
          <p className="text-[14px] text-[#1B84FF] pt-2">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;