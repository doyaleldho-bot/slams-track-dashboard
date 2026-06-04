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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
      {stats.map((item, index) => (
        <StatsCard
          key={index}
          title={item.title}
          value={item.value}
          subtitle={item.subtitle}
          icon={item.icon}
        />
      ))}
    </div>
  );
};

export default FinanceStats;
