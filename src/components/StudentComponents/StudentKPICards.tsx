import React from "react";
import StatsCard from "../StatsCard";
import { Users, UserX, UserCheck, UserPlus, Clock } from "lucide-react";

interface StudentKPICardsProps {
  totalStudents: number;
  totalStudentsChange: string;

  absentStudents: number;
  absentStudentsChange: string;

  presentStudents: number;
  presentStudentsChange: string;

  newAdmissions: number;

  feePending: number;
  feePendingChange: string;
}

const StudentKPICards: React.FC<StudentKPICardsProps> = ({
totalStudents,
  totalStudentsChange,
  absentStudents,
  absentStudentsChange,
  presentStudents,
  presentStudentsChange,
  newAdmissions,
  feePending,
  feePendingChange,
}) => {
 const kpiData: Array<{ title: string; value: number; change: string; icon: React.ReactNode; subtitle?: string }> = [
  {
    title: "Total Students",
    value: totalStudents,
    change: totalStudentsChange,
    icon: <Users className="w-5 h-5 text-gray-600" />,
    subtitle: undefined,
  },
  {
    title: "Absent Students",
    value: absentStudents,
    change: absentStudentsChange,
    icon: <UserX className="w-5 h-5 text-red-500" />,
    subtitle: undefined,
  },
  {
    title: "Present Students",
    value: presentStudents,
    change: presentStudentsChange,
    icon: <UserCheck className="w-5 h-5 text-green-500" />,
    subtitle: undefined,
  },
  {
    title: "New Admissions",
    value: newAdmissions,
    change: "This academic year",
    icon: <UserPlus className="w-5 h-5 text-blue-500" />,
    subtitle: undefined,
  },
  {
    title: "Fee Pending",
    value: feePending,
    change: feePendingChange,
    icon: <Clock className="w-5 h-5 text-orange-500" />,
    subtitle: undefined,
  },
];

  return (
    <div className="grid grid-cols-5 gap-4 mb-6">
      {kpiData.map((kpi, index) => (
        <div key={index}>
          <StatsCard
            title={kpi.title}
            value={kpi.value}
            // change={kpi.change}
            subtitle={kpi.subtitle}
            icon={kpi.icon}
          />
        </div>
      ))}
    </div>
  );
};

export default StudentKPICards;