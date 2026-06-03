import React, { useState } from "react"
import { ChevronDown, X } from "lucide-react"

interface TimetableSlot {
  subject: string
  className: string
}

type TimetableData = {
  [key: string]: (TimetableSlot | null)[]
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

const initialData: TimetableData = {
  Monday: [
    { subject: "English", className: "Class 5A" },
    null,
    { subject: "English", className: "Class 6B" },
    { subject: "English", className: "Class 7B" },
    { subject: "English", className: "Class 4A" },
    null,
    { subject: "English", className: "Class 4B" },
  ],

  Tuesday: [
    { subject: "English", className: "Class 5A" },
    { subject: "English", className: "Class 5A" },
    { subject: "English", className: "Class 6B" },
    null,
    null,
    { subject: "English", className: "Class 4B" },
    { subject: "English", className: "Class 4B" },
  ],

  Wednesday: [
    { subject: "English", className: "Class 5A" },
    null,
    null,
    { subject: "English", className: "Class 7B" },
    { subject: "English", className: "Class 4A" },
    { subject: "English", className: "Class 4B" },
    { subject: "English", className: "Class 4B" },
  ],

  Thursday: [
    null,
    { subject: "English", className: "Class 5A" },
    null,
    { subject: "English", className: "Class 7B" },
    { subject: "English", className: "Class 4A" },
    { subject: "English", className: "Class 4B" },
    { subject: "English", className: "Class 4B" },
  ],

  Friday: [
    { subject: "English", className: "Class 7B" },
    { subject: "English", className: "Class 4A" },
    { subject: "English", className: "Class 4B" },
    null,
    null,
    { subject: "English", className: "Class 4B" },
    { subject: "English", className: "Class 4B" },
  ],
}

const TeacherTimetable = () => {
  const [timetable, setTimetable] = useState<TimetableData>(initialData)

  const [selectedTeacher, setSelectedTeacher] = useState("Teacher")

  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments")

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [selectedSlot, setSelectedSlot] = useState<{
    day: string
    period: number
  } | null>(null)

  const [subject, setSubject] = useState("")
  const [className, setClassName] = useState("")

  const handleSlotClick = (
    day: string,
    period: number,
    slot: TimetableSlot | null,
  ) => {
    setSelectedSlot({ day, period })

    setSubject(slot?.subject || "")
    setClassName(slot?.className || "")

    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!selectedSlot) return

    const updated = { ...timetable }

    updated[selectedSlot.day][selectedSlot.period] = {
      subject,
      className,
    }

    setTimetable(updated)
    setIsModalOpen(false)
  }

  const handleClear = () => {
    if (!selectedSlot) return

    const updated = { ...timetable }

    updated[selectedSlot.day][selectedSlot.period] = null

    setTimetable(updated)
    setIsModalOpen(false)
  }

  return (
    <>
      <div className="rounded-2xl bg-white p-6">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h2 className="text-[28px] font-semibold">Devika</h2>

            <p className="text-sm text-gray-500">English Department</p>
          </div>

          <div className="flex gap-4">
            <div>
              <p className="mb-2 text-sm font-medium">Select Teacher</p>

              <button className="flex h-12 w-[180px] items-center justify-between rounded-xl border px-4">
                {selectedTeacher}
                <ChevronDown size={18} />
              </button>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Select Department</p>

              <button className="flex h-12 w-[220px] items-center justify-between rounded-xl border px-4">
                {selectedDepartment}
                <ChevronDown size={18} />
              </button>
            </div>
          </div>
        </div>

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
                          {slot.className}
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

                <input
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="h-12 w-full rounded-xl border px-4 outline-none"
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
