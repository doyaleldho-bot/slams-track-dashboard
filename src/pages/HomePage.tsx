import { Users, SquareChartGantt, UserX, GraduationCap } from "lucide-react"
import StatsCard from "../components/StatsCard"
import { PiUserList } from "react-icons/pi"
import MonthlyCollectionChart from "../components/Homepage/MonthlyCollectionChart"
import BatchWiseStudentCountChart from "../components/Homepage/BatchWiseStudentCountChart"
import StudentAdmissionTrendChart from "../components/Homepage/StudentAdmissionTrendChart"
import StudentAdmissionTrend from "../components/Homepage/StudentAdmissionTrend"

const HomePage = () => {
  const statsData = [
    {
      title: "Total Students",
      value: 1250,
      change: "+15%",
      subtitle: "from last month",
      icon: <Users size={18} className="" />,
      highlight: true,
    },
    {
      title: "Total Teachers",
      value: 45,
      change: "+5%",
      subtitle: "openings this week",
      icon: <PiUserList size={18} className="" />,
    },
    {
      title: "Non Teaching Staffs",
      value: 70,
      change: "+24%",
      subtitle: "from last month",
      icon: <UserX size={18} className="" />,
    },
    {
      title: "Active Students",
      value: 85,
      change: "+230",
      subtitle: "this week",
      icon: <GraduationCap size={18} className="" />,
    },
    {
      title: "New Admission",
      value: 120,
      change: "+24%",
      subtitle: "from last month",
      icon: <SquareChartGantt size={18} className="" />,
    },
  ]

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
        {" "}
        {statsData.map((card, index) => (
          <StatsCard
            key={index}
            title={card.title}
            value={card.value}
            change={card.change}
            subtitle={card.subtitle}
            icon={card.icon}
            highlight={card.highlight}
          />
        ))}
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
