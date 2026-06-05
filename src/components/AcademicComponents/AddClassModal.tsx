import React, { useEffect, useState } from "react"
import { ChevronDown, X } from "lucide-react"
import CustomDropdown from "../CustomDropdown"

interface AddClassModalProps {
  isOpen: boolean
  onClose: () => void
}

const subjectsList = ["English", "Malayalam", "Maths", "Hindi", "Science", "IT"]

const AddClassModal: React.FC<AddClassModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    classId: "",
    className: "",
    level: "",
    section: "",
    teacher: "",
    status: "Active",
    batch: "",
  })

  const [errors, setErrors] = useState({
    classId: "",
    className: "",
    level: "",
    section: "",
    teacher: "",
    status: "",
    subjects: "",
    batch: "",
  })

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  //validation function
  const validateForm = () => {
    const newErrors = {
      classId: "",
      className: "",
      level: "",
      section: "",
      teacher: "",
      status: "",
      subjects: "",
      batch: "",
    }

    let isValid = true

    if (!formData.classId.trim()) {
      newErrors.classId = "Class ID is required"
      isValid = false
    }

    if (!formData.className.trim()) {
      newErrors.className = "Class Name is required"
      isValid = false
    }

    if (!formData.level) {
      newErrors.level = "Please select a level"
      isValid = false
    }

    if (!formData.section) {
      newErrors.section = "Please select a section"
      isValid = false
    }

    if (!formData.teacher) {
      newErrors.teacher = "Please select a teacher"
      isValid = false
    }

    if (!formData.status) {
      newErrors.status = "Please select a status"
      isValid = false
    }

    if (selectedSubjects.length === 0) {
      newErrors.subjects = "Please select at least one subject"
      isValid = false
    }

    if (!formData.batch.trim()) {
      newErrors.batch = "Batch is required"
      isValid = false
    }

    setErrors(newErrors)

    return isValid
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }))
  }

  const handleSubjectSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value

    if (value && !selectedSubjects.includes(value)) {
      setSelectedSubjects((prev) => [...prev, value])
    }
  }

  const removeSubject = (subject: string) => {
    setSelectedSubjects((prev) => prev.filter((item) => item !== subject))
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    console.log({
      ...formData,
      subjects: selectedSubjects,
    })

    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm p-4">
      <div className="flex h-full items-center justify-center">
        <div className="flex h-[90vh] w-full max-w-[900px] flex-col rounded-[24px] bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-[#E5E5E5] px-6 py-5 lg:px-8">
            <div>
              <h2 className="text-2xl font-semibold text-[#2D2D2D] md:text-3xl lg:text-[36px]">
                Add New Class
              </h2>

              <p className="mt-1 text-sm text-[#8A8A8A]">
                Edit the details of the new class, click save when you're done.
              </p>
            </div>

            <button
              onClick={onClose}
              className="text-gray-500 transition hover:text-black"
            >
              <X size={24} />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="hide-scrollbar flex-1 overflow-y-auto px-6 py-6 lg:px-8">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* Class ID */}
              <div>
                <label className="mb-2 block font-medium">Class ID *</label>

                <input
                  name="classId"
                  value={formData.classId}
                  onChange={handleChange}
                  placeholder="e.g. Class-10"
                  className="h-12 w-full rounded-xl border border-[#E5E5E5] px-4 outline-none md:h-14"
                />
                {errors.classId && (
                  <p className="mt-1 text-sm text-red-500">{errors.classId}</p>
                )}        
              </div>

              {/* Level */}
              <div>
                <label className="mb-2 block font-medium">Level *</label>

                <CustomDropdown
                  value={formData.level}
                  placeholder="Select Level"
                  options={["Primary", "Secondary", "Higher Secondary"]}
                  onChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      level: value,
                    }))
                    setErrors((prev) => ({
                      ...prev,
                      level: "",
                    }))
                  }}
                />
                {errors.level && (
                  <p className="mt-1 text-sm text-red-500">{errors.level}</p>
                )}
              </div>

              {/* Class Name */}
              <div>
                <label className="mb-2 block font-medium">Class Name *</label>

                <input
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  placeholder="e.g. Class-10"
                  className="h-12 w-full rounded-xl border border-[#E5E5E5] px-4 outline-none md:h-14"
                />
                {errors.className && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.className}
                  </p>
                )}
              </div>

              {/* Section */}
              <div>
                <label className="mb-2 block font-medium">Section *</label>

                <CustomDropdown
                  value={formData.section}
                  placeholder="Select Section"
                  options={["A", "B", "C", "D"]}
                  onChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      section: value,
                    }))
                    setErrors((prev) => ({
                      ...prev,
                      section: "",
                    }))
                  }}
                />
                {errors.section && (
                  <p className="mt-1 text-sm text-red-500">{errors.section}</p>
                )}
              </div>

              {/* Teacher */}
              <div>
                <label className="mb-2 block font-medium">
                  Class Teacher *
                </label>

                <CustomDropdown
                  value={formData.teacher}
                  placeholder="Select Teacher"
                  options={["Devika", "Anu", "Arun", "Rahul", "Athira"]}
                  onChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      teacher: value,
                    }))
                    setErrors((prev) => ({
                      ...prev,
                      teacher: "",
                    }))
                  }}
                />
                {errors.teacher && (
                  <p className="mt-1 text-sm text-red-500">{errors.teacher}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="mb-2 block font-medium">Status *</label>

                <CustomDropdown
                  value={formData.status}
                  placeholder="Select Status"
                  options={["Active", "Inactive"]}
                  onChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      status: value,
                    }))
                    setErrors((prev) => ({
                      ...prev,
                      status: "",
                    }))
                  }}
                />
                {errors.status && (
                  <p className="mt-1 text-sm text-red-500">{errors.status}</p>
                )}
              </div>
            </div>

            {/* Subject */}
            <div className="mt-6">
              <label className="mb-2 block font-medium">Subject *</label>

              <CustomDropdown
                value=""
                placeholder="Select Subjects"
                options={subjectsList}
                onChange={(value) => {
                  if (!selectedSubjects.includes(value)) {
                    setSelectedSubjects((prev) => [...prev, value])
                  }

                  setErrors((prev) => ({
                    ...prev,
                    subjects: "",
                  }))
                }}
              />

              <div className="mt-4 flex flex-wrap gap-2">
                {selectedSubjects.map((subject) => (
                  <div
                    key={subject}
                    className="flex items-center gap-2 rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-sm"
                  >
                    {subject}

                    <button
                      type="button"
                      onClick={() => removeSubject(subject)}
                      className="font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              {errors.subjects && (
                <p className="mt-2 text-sm text-red-500">{errors.subjects}</p>
              )}
            </div>

            {/* Batch */}
            <div className="mt-6">
              <label className="mb-2 block font-medium">Batch</label>

              <input
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                placeholder="e.g. 2025 - 26"
                className="h-12 w-full rounded-xl border border-[#E5E5E5] px-4 outline-none md:h-14"
              />
              {errors.batch && (
                <p className="mt-1 text-sm text-red-500">{errors.batch}</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-[#E5E5E5] px-6 py-4 lg:px-8">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={onClose}
                className="h-12 w-full rounded-xl border border-[#BDBDBD] sm:w-[140px]"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="h-12 w-full rounded-xl bg-[#1565D8] text-white sm:w-[140px]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddClassModal
