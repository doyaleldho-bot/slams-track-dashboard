import React from "react";
import StatsCard from "../StatsCard";

export interface FinanceStatItem {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
}

interface FinanceStatsProps {
  stats: FinanceStatItem[];
}

const FinanceStats: React.FC<FinanceStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {stats.map((item, index) => (
        <div key={index}>
          <StatsCard
            title={item.title}
            value={item.value}
            subtitle={item.subtitle}
            icon={item.icon}
          />
        </div>
      ))}
    </div>
  );
};

export default FinanceStats;
