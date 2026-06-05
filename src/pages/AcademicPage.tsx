import React, { useState } from "react"
import { Users, UserX, GraduationCap, Plus } from "lucide-react"
import { PiUserList } from "react-icons/pi"
import StatsCard from "../components/StatsCard"

import SchoolManagement from "../components/AcademicComponents/SchoolManagement"
import TeacherTimeTable from "../components/AcademicComponents/TacherTimeTable"
import AddClassModal from "../components/AcademicComponents/AddClassModal"

interface StatsData {
  title: string
  value: number
  icon: React.ReactNode
  change?: string
  subtitle?: string
  highlight?: boolean
}

const AcademicPage: React.FC = () => {
  const [academitabs, setAcademicTabs] = useState("SchoolMangement")
  const [openModal, setOpenModal] = useState(false)

  const statsData: StatsData[] = [
    {
      title: "Total Students",
      value: 48,
      icon: <Users size={18} />,
    },
    {
      title: "Total Teachers",
      value: 45,
      icon: <PiUserList size={18} />,
    },
    {
      title: "Administration Staffs",
      value: 70,
      icon: <UserX size={18} />,
    },
    {
      title: "Other Staffs",
      value: 85,
      icon: <GraduationCap size={18} />,
    },
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col gap-4">
          <h1 className="font-poppins text-[24px] font-semibold leading-[16px] tracking-[0.08em]">
            Academic Management
          </h1>
          <span className="font-poppins text-[16px] font-normal leading-[16px] tracking-[0.08em] text-[#474747]">
            Manage courses, Time table.
          </span>
        </div>
        <button
          onClick={() => setOpenModal(true)}
          className="flex h-[48px] w-[186px] items-center justify-center gap-2 rounded-[10px] gradient-btn text-white transition-all "
        >
          <Plus size={18} />
          <span className="text-[14px] font-medium">Add Class</span>
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
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

      {/* TABS FOR ACADEMIC PAGE */}
      <div className="relative mt-10 w-[478px] h-[36px] text-[14px] border border-[#fff] rounded-[14px] flex">
        <div
          className={`absolute top-0 h-full w-1/2 bg-[#474747] rounded-[14px]
      transition-all duration-300 ease-in-out
      ${
        academitabs === "TeacherTimetable"
          ? "translate-x-full"
          : "translate-x-0"
      }`}
        />

        <button
          className={`relative z-10 w-1/2 ${
            academitabs === "SchoolMangement" ? "text-white" : "text-black"
          }`}
          onClick={() => setAcademicTabs("SchoolMangement")}
        >
          School Management
        </button>

        <button
          className={`relative z-10 w-1/2 ${
            academitabs === "TeacherTimetable" ? "text-white" : "text-black"
          }`}
          onClick={() => setAcademicTabs("TeacherTimetable")}
        >
          Teacher Timetable
        </button>
      </div>

      <div className="mt-6">
        {academitabs === "SchoolMangement" ? (
          <SchoolManagement />
        ) : (
          <TeacherTimeTable />
        )}
      </div>

      <AddClassModal isOpen={openModal} onClose={() => setOpenModal(false)} />
    </div>
  )
}

export default AcademicPage
