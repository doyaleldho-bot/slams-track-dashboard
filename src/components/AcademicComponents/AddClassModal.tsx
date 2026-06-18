import React, { useEffect, useState } from "react"
import { ChevronDown, X } from "lucide-react"
import CustomDropdown from "../CustomDropdown"
import api from "../../api/axios"
import type { ClassData, Teacher } from "../../pages/AcademicPage"
import { toast } from "react-toastify"

interface AddClassModalProps {
  isOpen: boolean
  onClose: () => void
  editData: ClassData | null
  teacherList: Teacher[]
}

const subjectsList = ["English", "Malayalam", "Maths", "Hindi", "Science", "IT"]

const AddClassModal: React.FC<AddClassModalProps> = ({
  isOpen,
  onClose,
  editData,
  teacherList,
}) => {
  const [formData, setFormData] = useState({
    classId: "",
    className: "",
    level: "",
    section: "",
    teacher: "",
    status: "Active",
    batch: "",
    department: "",
    branch: "",
  })

  const [initialFormData, setInitialFormData] = useState<
    typeof formData | null
  >(null)

  const [errors, setErrors] = useState({
    classId: "",
    className: "",
    level: "",
    section: "",
    teacher: "",
    status: "",
    subjects: "",
    batch: "",
    department: "",
    branch: "",
  })

  const [subjectInput, setSubjectInput] = useState("")
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])

  const [initialSubjects, setInitialSubjects] = useState<string[]>([])

  useEffect(() => {
    if (editData) {
      const data = {
        classId: editData.class_id,
        className: editData.class_name,
        level: editData.level,
        section: editData.section,
        teacher: editData.class_teacher?.toString() || "",
        status: editData.status,
        batch: editData.branch || "",
        department: editData.department || "",
        branch: editData.branch || "",
      }

      setFormData(data)
      setInitialFormData(data)

      setSelectedSubjects(editData.subject_names || [])
      setInitialSubjects(editData.subject_names || [])
    }
  }, [editData, isOpen])

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
      department: "",
      branch: "",
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

    if (!formData.department.trim() && selectedType === "college") {
      newErrors.department = "Department is required"
      isValid = false
    }
    if (!formData.branch.trim() && selectedType === "college") {
      newErrors.branch = "Branch is required"
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

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      if (editData) {
        const updatePayload: any = {}

        if (formData.level !== initialFormData?.level) {
          updatePayload.level = formData.level
        }

        if (formData.teacher !== initialFormData?.teacher) {
          updatePayload.class_teacher = formData.teacher
        }

        if (formData.section !== initialFormData?.section) {
          updatePayload.section = formData.section
        }

        if (formData.status !== initialFormData?.status) {
          updatePayload.status = formData.status
        }

        if (formData.batch !== initialFormData?.batch) {
          updatePayload.batch = formData.batch
        }

        if (
          JSON.stringify(selectedSubjects) !== JSON.stringify(initialSubjects)
        ) {
          updatePayload.subjects = selectedSubjects
        }

        if (
          selectedType === "college" &&
          formData.department !== initialFormData?.department
        ) {
          updatePayload.department = formData.department
        }

        if (
          selectedType === "college" &&
          formData.branch !== initialFormData?.branch
        ) {
          updatePayload.branch = formData.branch
        }

        // if no changes
        if (Object.keys(updatePayload).length === 0) {
          toast.info("No changes detected")
          return
        }

        const res = await api.patch(
          `/edit-class/${editData.id}/`,
          updatePayload,
        )

        if (res.data.status) {
          toast.success("Class updated successfully")
        }
      } else {
        const createPayload = {
          class_id: formData.classId,
          class_name: formData.className,
          level: formData.level,
          section: formData.section,
          class_teacher: formData.teacher,
          status: formData.status,
          batch: formData.batch,
          subjects: selectedSubjects,
          department: selectedType === "college" ? formData.department : "",
          branch: selectedType === "college" ? formData.branch : "",
        }

        const res = await api.post("/add-class/", createPayload)

        if (res.data.status) {
          toast.success("Class added successfully")
        }
      }

      handleClose()
    } catch (error: any) {
      console.error(error?.response?.data)

      toast.error(error?.response?.data?.message || "Something went wrong")
    }
  }

  const institutionName =
    localStorage.getItem("institution_name")?.toLowerCase() || ""

  const selectedType: "school" | "college" = institutionName.includes("school")
    ? "school"
    : "college"

  const levelOptionsInLevel =
    selectedType === "school"
      ? ["Primary", "Secondary", "Higher Secondary"]
      : ["UG", "PG", "Diploma", "PhD"]
  const levelOptionsInName =
    selectedType === "school"
      ? [
          "LKG",
          "UKG",
          "Class1",
          "Class2",
          "Class3",
          "Class4",
          "Class5",
          "Class7",
          "Class8",
          "Class9",
          "Class10",
          "PLus1",
          "Plus2",
        ]
      : ["BCA", "B.com", "BBA", "MCA", "M.com", , "BA.english"]

  const generateClassId = () => {
    const randomNumber = Math.floor(1000 + Math.random() * 9000)

    return `CL-${randomNumber}`
  }
  const handleAutoClassId = () => {
    if (!editData) {
      setFormData((prev) => ({
        ...prev,
        classId: generateClassId(),
      }))
    }
  }
  const handleClose = () => {
    onClose()

    setFormData({
      classId: "",
      className: "",
      level: "",
      section: "",
      teacher: "",
      status: "Active",
      batch: "",
      department: "",
      branch: "",
    })

    setErrors({
      classId: "",
      className: "",
      level: "",
      section: "",
      teacher: "",
      status: "",
      subjects: "",
      batch: "",
      department: "",
      branch: "",
    })

    setSelectedSubjects([])
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm p-4">
      <div className="flex h-full items-center justify-center">
        <div className="flex h-[90vh] w-full max-w-[900px] flex-col rounded-[24px] bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-[#E5E5E5] px-6 py-5 lg:px-8">
            <div>
              <h2>{editData ? "Edit Class" : "Add New Class"}</h2>

              <p className="mt-1 text-sm text-[#8A8A8A]">
                Edit the details of the new class, click save when you're done.
              </p>
            </div>

            <button
              onClick={handleClose}
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
                <div className="flex justify-between">
                  <label className="mb-2 block font-medium"> Class ID * </label>
                  <button
                    type="button"
                    onClick={handleAutoClassId}
                    disabled={!!editData}
                    className={`text-sm ${
                      editData
                        ? "cursor-not-allowed text-gray-400"
                        : "cursor-pointer text-blue-500"
                    }`}
                  >
                    Generate ID
                  </button>
                </div>

                <input
                  name="classId"
                  value={formData.classId}
                  disabled={!!editData}
                  onChange={handleChange}
                  placeholder="e.g. Class-10"
                  className={`h-12 w-full rounded-xl border px-4 outline-none md:h-14${
                    editData
                      ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-500"
                      : "border-[#E5E5E5] bg-white text-black focus:border-blue-500"
                  }`}
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
                  options={levelOptionsInLevel}
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

                <div>
                  <CustomDropdown
                    value={formData.className}
                    placeholder="Select Level"
                    options={levelOptionsInName}
                    onChange={(value) => {
                      setFormData((prev) => ({
                        ...prev,
                        className: value,
                      }))
                      setErrors((prev) => ({
                        ...prev,
                        className: "",
                      }))
                    }}
                  />
                  {errors.className && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.className}
                    </p>
                  )}
                </div>
              </div>

              {selectedType === "college" && (
                <>
                  <div>
                    {/* department */}
                    <label className="mb-2 block font-medium">
                      Department *
                    </label>
                    <input
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="e.g. Class-10"
                      className={`h-12 w-full rounded-xl border px-4 outline-none md:h-14
                       border-[#E5E5E5] bg-white text-black focus:border-blue-500 `}
                    />
                    {errors.classId && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.department}
                      </p>
                    )}
                  </div>
                  {/* branch */}
                  <div>
                    <label className="mb-2 block font-medium">Branch *</label>

                    <input
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                      placeholder="e.g. Class-10"
                      className={`h-12 w-full rounded-xl border px-4 outline-none md:h-14 
                      
                           border-[#E5E5E5] bg-white text-black focus:border-blue-500
                      `}
                    />
                    {errors.branch && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.branch}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Section */}
              <div>
                <label className="mb-2 block font-medium">Section </label>

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
                  searchable
                  placeholder="Select Teacher"
                  options={teacherList}
                  onChange={(value: any) => {
                    setFormData((prev) => ({
                      ...prev,
                      teacher: value?.id.toString(),
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

              <input
                type="text"
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && subjectInput.trim()) {
                    e.preventDefault()

                    if (!selectedSubjects.includes(subjectInput.trim())) {
                      setSelectedSubjects((prev) => [
                        ...prev,
                        subjectInput.trim(),
                      ])
                    }

                    setSubjectInput("")

                    setErrors((prev) => ({
                      ...prev,
                      subjects: "",
                    }))
                  }
                }}
                placeholder="Type subject and press Enter"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
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
                className={`h-12 w-full rounded-xl border px-4 outline-none md:h-14
                    border-[#E5E5E5] bg-white text-black focus:border-blue-500`}
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
                onClick={handleClose}
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
