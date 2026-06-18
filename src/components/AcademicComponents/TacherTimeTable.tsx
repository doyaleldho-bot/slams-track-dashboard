import React, { useEffect, useRef, useState } from "react"
import { ChevronDown, X } from "lucide-react"
import type { Department, Teacher } from "../../pages/AcademicPage"
import api from "../../api/axios"
import CustomDropdown from "../CustomDropdown"

interface TimetableSlot {
  subject: string
  className: string
  id?: string
  classId?: string | number
  classSection?: string
}

interface Class {
  id: number
  name: string
  class_section: string
}

type TimetableData = {
  [key: string]: (TimetableSlot | null)[]
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

const createEmptyTimetable = (): TimetableData => ({
  Monday: Array(7).fill(null),
  Tuesday: Array(7).fill(null),
  Wednesday: Array(7).fill(null),
  Thursday: Array(7).fill(null),
  Friday: Array(7).fill(null),
})

interface TeacherTimetableProps {
  teacherList: Teacher[]
  departmentsList: Department[]
  selectedDepartment: string | null
  setSelectedDepartment: React.Dispatch<React.SetStateAction<string | null>>
}

const TeacherTimetable: React.FC<TeacherTimetableProps> = ({
  teacherList,
  departmentsList,
  selectedDepartment,
  setSelectedDepartment,
}) => {
  //teacher filler stats
  const [isTeacherOpen, setIsTeacherOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)

  const teacherDropdownRef = useRef<HTMLDivElement>(null)

  //department filler stats
  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false)

  const departmentDropdownRef = useRef<HTMLDivElement>(null)

  const [timetable, setTimetable] =
    useState<TimetableData>(createEmptyTimetable)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [selectedSlot, setSelectedSlot] = useState<{
    day: string
    period: number
    id: string
  } | null>(null)

  const [subject, setSubject] = useState("")

  const [selectedClass, setSelectedClass] = useState<{
    id: number | string
    name: string
    classSection: string
  } | null>(null)

  const [classList, setClassList] = useState<Class[]>([])

  //class list
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedTeacher) return

      setSubject(selectedTeacher.subject)

      try {
        const res = await api.get("/list-classes-for-dropdowns/")

        if (res.data.status) {
          const formattedClasses = res.data.data.map((item: any) => ({
            id: item.id,
            name: item.class_name,
            classSection: item.class_section,
          }))

          setClassList(formattedClasses)
        }
      } catch (error) {
        console.error("Failed to fetch classes", error)
      }
    }

    fetchData()
  }, [selectedTeacher])

  const handleSlotClick = (
    day: string,
    period: number,
    slot: TimetableSlot | null,
  ) => {
    console.log(slot)
    setSelectedSlot({ day, period, id: slot?.id || "" })

    setSubject(slot?.subject || subject || "")
    setSelectedClass(
      slot
        ? {
            id: slot.classId!,
            name: slot.className,
            classSection: slot.classSection || "",
          }
        : null,
    )
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    console.log("object")
    if (!selectedSlot || !selectedTeacher || !selectedClass) {
      return
    }

    try {
      const currentSlot = timetable[selectedSlot.day][selectedSlot.period]

      // EDIT EXISTING
      if (currentSlot?.id) {
        console.log("update")
        const payload = {
          class_assigned: selectedClass.id,
        }

        await api.patch(`/edit-teacher-timetable/${currentSlot.id}/`, payload)
      }
      // CREATE NEW
      else {
        console.log("create")
        const payload = {
          teacher: Number(selectedTeacher.id),
          day_of_week: selectedSlot.day,
          period: String(selectedSlot.period + 1),
          subject,
          class_assigned: selectedClass.id,
        }

        const res = await api.post("/add-teacher-timetable/", payload)

        // add returned id
        const newData = res.data.data

        const updated = { ...timetable }

        updated[selectedSlot.day][selectedSlot.period] = {
          id: selectedSlot.id!,
          subject,
          className: selectedClass?.name || "",
          classId: selectedClass?.id || "",
          classSection: selectedClass.classSection,
        }

        setTimetable(updated)

        setIsModalOpen(false)

        return
      }

      // update UI after edit

      const updated = { ...timetable }

      updated[selectedSlot.day][selectedSlot.period] = {
        id: selectedSlot.id!,
        subject,
        className: selectedClass?.name,
        classId: selectedClass?.id,
        classSection: selectedClass.classSection,
      }

      setTimetable(updated)

      setIsModalOpen(false)
    } catch (error: any) {
      console.log(error.response?.data)
    }
  }

  const handleClear = () => {
    if (!selectedSlot) return

    const updated = { ...timetable }

    updated[selectedSlot.day][selectedSlot.period] = null

    setTimetable(updated)
    setIsModalOpen(false)
  }

  // out side of dropdown click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        teacherDropdownRef.current &&
        !teacherDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTeacherOpen(false)
      }
      if (
        departmentDropdownRef.current &&
        !departmentDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDepartmentOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const loadTimeTable = async () => {
    if (!selectedTeacher) return

    try {
      const res = await api.get(
        `/list-teacher-timetable/${selectedTeacher.id}/`,
      )

      const apiTimetable = res.data.timetable

      const formattedTimetable: TimetableData = {
        Monday: Array(7).fill(null),
        Tuesday: Array(7).fill(null),
        Wednesday: Array(7).fill(null),
        Thursday: Array(7).fill(null),
        Friday: Array(7).fill(null),
      }

      Object.keys(apiTimetable).forEach((day) => {
        if (!formattedTimetable[day]) return

        apiTimetable[day].forEach((table: any) => {
          const periodIndex = Number(table.period) - 1

          formattedTimetable[day][periodIndex] = {
            subject: table.subject,
            className: table.class_assigned,
            classId: table.class_id, //get the calss id
            id: table.id,
            classSection: table.class_section,
          }
        })
      })
      console.log(formattedTimetable)
      setTimetable(formattedTimetable)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadTimeTable()
  }, [selectedTeacher])

  console.log(classList)
  return (
    <>
      <div className="rounded-2xl bg-white p-6">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h2 className="text-[28px] font-semibold">
              {selectedTeacher?.name || "Select Teacher"}
            </h2>

            <p className="text-sm text-gray-500">
              {(selectedDepartment && selectedDepartment + " department") ||
                selectedTeacher?.subject ||
                "Select Department"}
            </p>
          </div>

          <div className="flex gap-4 ">
            {/* Teacher Dropdown */}
            <div ref={teacherDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setIsTeacherOpen((prev) => !prev)}
                className="flex h-12 w-[180px] items-center justify-between rounded-xl border bg-white/20 px-4 text-black/50"
              >
                <span>{selectedTeacher?.name || "Select Teacher"}</span>

                <ChevronDown
                  size={18}
                  className={`transition-transform ${
                    isTeacherOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isTeacherOpen && (
                <div className="absolute top-14 z-50 w-[180px] overflow-hidden rounded-xl border bg-white shadow-lg">
                  {teacherList.map((teacher) => (
                    <button
                      key={teacher.id}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()

                        setSelectedTeacher({
                          id: teacher.id,
                          name: teacher.name,
                          subject: teacher.subject,
                        })

                        setIsTeacherOpen(false)

                        console.log("selected", teacher)
                      }}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100"
                    >
                      {teacher.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {!selectedTeacher ? (
          <div className="flex h-[300px] items-center justify-center text-gray-400">
            Please select a teacher to view timetable
          </div>
        ) : (
          <>
            {/* Timetable */}
            <div className="overflow-x-auto">
              <div className="grid min-w-[1200px] grid-cols-8 gap-2">
                <div className="rounded bg-[#EFEFEF] p-3 font-medium">Time</div>

                {[1, 2, 3, 4, 5, 6, 7].map((period) => (
                  <div
                    key={period}
                    className="rounded bg-[#EFEFEF] p-3 font-medium"
                  >
                    Period {period}
                  </div>
                ))}

                {days.map((day) => (
                  <React.Fragment key={day}>
                    <div className="flex items-center rounded bg-[#EFEFEF] p-4 font-medium">
                      {day}
                    </div>

                    {timetable[day].map((slot, index) => (
                      <div
                        key={index}
                        onClick={() => handleSlotClick(day, index, slot)}
                        className={`min-h-[90px] cursor-pointer rounded-lg p-3 transition-all
                    ${
                      slot
                        ? "border border-[#3B82F6] bg-[#F8FBFF]"
                        : "border border-dashed border-[#CFCFCF] bg-[#FAFAFA]"
                    }`}
                      >
                        {slot ? (
                          <>
                            <h4 className="text-sm font-semibold text-[#2563EB]">
                              {slot.subject}
                            </h4>

                            <p className="mt-1 text-sm text-gray-600">
                              {slot.className + "-" + slot.classSection}
                            </p>
                          </>
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-gray-400">
                            Click to add
                          </div>
                        )}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="w-[700px] rounded-2xl bg-white p-8">
            <div className="mb-8 flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-semibold">Edit Timetable Slot</h2>

                <p className="mt-2 text-sm text-gray-500">
                  Edit teacher class schedule for this time slot
                </p>
              </div>

              <button onClick={() => setIsModalOpen(false)}>
                <X />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-lg font-medium">
                  Subject *
                </label>

                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="h-12 w-full rounded-xl border px-4 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-lg font-medium">
                  Class *
                </label>

                <CustomDropdown
                  value={selectedClass?.id?.toString() || ""}
                  placeholder="Select class"
                  searchable
                  options={classList}
                  onChange={(option) => {
                    if (typeof option !== "string") {
                      setSelectedClass({
                        id: Number(option.id),
                        name: option.name,
                        classSection: option.classSection,
                      })
                    }
                  }}
                />
              </div>
            </div>

            <div className="mt-10 flex gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 rounded-xl border py-3 text-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleClear}
                className="flex-1 rounded-xl bg-[#A12A00] py-3 text-lg text-white"
              >
                Clear Slot
              </button>

              <button
                onClick={handleSave}
                className="flex-1 rounded-xl bg-[#2563EB] py-3 text-lg text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TeacherTimetable
