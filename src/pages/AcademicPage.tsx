import React, { useCallback, useEffect, useState } from "react"
import { Users, UserX, GraduationCap, Plus } from "lucide-react"
import { PiUserList } from "react-icons/pi"
import StatsCard from "../components/StatsCard"

import SchoolManagement from "../components/AcademicComponents/SchoolManagement"
import TeacherTimeTable from "../components/AcademicComponents/TacherTimeTable"
import AddClassModal from "../components/AcademicComponents/AddClassModal"
import api from "../api/axios"

interface StatsData {
  title: string
  value: number
  icon: React.ReactNode
  change?: string
  subtitle?: string
  highlight?: boolean
}

export interface ClassData {
  id: number
  class_id: string
  class_name: string
  class_batch: string
  level: string
  section: string
  total_students: number
  status: "Active" | "Inactive"
}

interface AcademicStats {
  total_students: number
  total_teachers: number
  total_administration_staff: number
  total_non_administration_staff: number
}

const AcademicPage: React.FC = () => {
  const [academitabs, setAcademicTabs] = useState("SchoolMangement")
  const [openModal, setOpenModal] = useState(false)
  const [academicStatsData, setAcademicStatsData] =
    useState<AcademicStats | null>(null)

  //mangement section states
  const [managementData, setManagementData] = useState<ClassData[]>([])

  //page nation states
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)

  const loadAcademicStatus = async () => {
    try {
      const res = await api("/academic-kpi-cards/")
      setAcademicStatsData(res?.data.data)
    } catch (error) {
      console.error("Error fetching academic status:", error)
    }
  }

  useEffect(() => {
    loadAcademicStatus()
  }, [])

  const statsData: StatsData[] = [
    {
      title: "Total Students",
      value: academicStatsData?.total_students,
      icon: <Users size={18} />,
    },
    {
      title: "Total Teachers",
      value: academicStatsData?.total_teachers,
      icon: <PiUserList size={18} />,
    },
    {
      title: "Administration Staffs",
      value: academicStatsData?.total_administration_staff,
      icon: <UserX size={18} />,
    },
    {
      title: "Other Staffs",
      value: academicStatsData?.total_non_administration_staff,
      icon: <GraduationCap size={18} />,
    },
  ]

  const prev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const next = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const loadManagement = async () => {
    try {
      const res = await api.get(`/list-class/?page=${currentPage}`)
      setManagementData(res.data.data)
      setTotalPages(res.data.total_pages)
    } catch (error) {
      console.log(error.response.data.message)
    }
  }

  useEffect(() => {
    loadManagement()
  }, [currentPage])

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
            width="318px"
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
          School / Collage Management
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
          <SchoolManagement
            managementData={managementData}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            next={next}
            prev={prev}
          />
        ) : (
          <TeacherTimeTable />
        )}
      </div>

      <AddClassModal isOpen={openModal} onClose={() => setOpenModal(false)} />
    </div>
  )
}

export default AcademicPage
