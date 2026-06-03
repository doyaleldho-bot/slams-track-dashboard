import React from "react";
import StatsCard from "../StatsCard";
import { Users, UserX, UserCheck, UserPlus, Clock } from "lucide-react";

interface KPIData {
  title: string;
  value: string | number;
  change?: string;
  subtitle?: string;
  icon: React.ReactNode;
  highlight?: boolean;
}

const StudentKPICards: React.FC = () => {
  const kpiData: KPIData[] = [
    {
      title: "Total students",
      value: "1,138",
      change: "+12% from last year",
      icon: <Users className="w-5 h-5 text-gray-600" />,
    },
    {
      title: "Absent Students",
      value: "120",
      change: "-10% from last month",
      icon: <UserX className="w-5 h-5 text-red-500" />,
    },
    {
      title: "Present Students",
      value: "45",
      change: "+90% from last month",
      icon: <UserCheck className="w-5 h-5 text-green-500" />,
    },
    {
      title: "New Admissions",
      value: "60",
      subtitle: "This academic year",
      icon: <UserPlus className="w-5 h-5 text-blue-500" />,
      highlight: true,
    },
    {
      title: "Fee Pending",
      value: "60",
      change: "Requires attention",
      icon: <Clock className="w-5 h-5 text-orange-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-4 mb-6">
      {kpiData.map((kpi, index) => (
        <div key={index}>
          <StatsCard
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            subtitle={kpi.subtitle}
            icon={kpi.icon}
          />
        </div>
      ))}
    </div>
  );
};

export default StudentKPICards;
