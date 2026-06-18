import { Users, SquareChartGantt, UserX, GraduationCap } from "lucide-react"
import StatsCard from "../components/StatsCard"
import { PiUserList } from "react-icons/pi"
import MonthlyCollectionChart from "../components/Homepage/MonthlyCollectionChart"
import BatchWiseStudentCountChart from "../components/Homepage/BatchWiseStudentCountChart"
import StudentAdmissionTrendChart from "../components/Homepage/StudentAdmissionTrendChart"
import StudentAdmissionTrend from "../components/Homepage/StudentAdmissionTrend"
import { useEffect, useState } from "react";
import api from "../api/axios"; // adjust path if needed

interface HomeStatsCard {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ReactNode;
  change?: string | undefined;
  highlight?: boolean;
}

const HomePage = () => {
 const [statsData, setStatsData] = useState<HomeStatsCard[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const getIcon = (key: string) => {
  switch (key) {
    case "total_students":
      return <Users size={18} />;
    case "total_teachers":
      return <PiUserList size={18} />;
    case "total_non_teaching_staffs":
      return <UserX size={18} />;
    case "total_active_students":
      return <GraduationCap size={18} />;
    case "new_admission_count":
      return <SquareChartGantt size={18} />;
    default:
      return <Users size={18} />;
  }
};

useEffect(() => {
  const fetchDashboardKPI = async () => {
    try {
      setLoading(true);

      const res = await api.get("/dashboard-kpi-cards/");

      const apiData = res.data?.data;

      if (!apiData) return;

      const mapped: HomeStatsCard[] = [
        {
          title: "Total Students",
          value: apiData.total_students,
          subtitle: "from system",
          change: "",
          icon: getIcon("total_students"),
          highlight: false,
        },
        {
          title: "Total Teachers",
          value: apiData.total_teachers,
          subtitle: "from system",
          change: "",
          icon: getIcon("total_teachers"),
          highlight: false,
        },
        {
          title: "Non Teaching Staffs",
          value: apiData.total_non_teaching_staffs,
          subtitle: "from system",
          change: "",
          icon: getIcon("total_non_teaching_staffs"),
          highlight: false,
        },
        {
          title: "Active Students",
          value: apiData.total_active_students,
          subtitle: "from system",
          change: "",
          icon: getIcon("total_active_students"),
          highlight: false,
        },
        {
          title: "New Admission",
          value: apiData.new_admission_count,
          subtitle: "from system",
          change: "",
          icon: getIcon("new_admission_count"),
          highlight: false,
        },
        {
          title: "Total Batches",
          value: apiData.total_batches,
          subtitle: "from system",
          change: "",
          icon: getIcon("total_batches"),
          highlight: false,
        },
      ];

      setStatsData(mapped);
    } catch (err: any) {
      setError(err.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  fetchDashboardKPI();
}, []);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-6">
        {" "}
       {loading ? (
  <div>Loading dashboard...</div>
) : error ? (
  <div className="text-red-500">{error}</div>
) : (
  statsData.map((card, index) => (
    <StatsCard
      key={index}
      title={card.title}
      value={card.value}
      change={card.change}
      subtitle={card.subtitle}
      icon={card.icon}
      highlight={card.highlight}
    />
  ))
)}
      </div>
      <div className="p-6 mt-10 bg-white h-full max-h-[850px] rounded-3xl">
        <MonthlyCollectionChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
        <StudentAdmissionTrendChart />
        <BatchWiseStudentCountChart />
      </div>
      <div className=" bg-gray-100 mt-10 rounded-3xl">
        <StudentAdmissionTrend />
      </div>
    </div>
  )
}

export default HomePage
