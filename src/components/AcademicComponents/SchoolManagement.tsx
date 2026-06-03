import React, { useEffect, useMemo, useRef, useState } from "react"
import { Search, ChevronDown, SquarePen } from "lucide-react"

interface TableItem {
  id: string
  name: string
  type: "college" | "school"
  level: string
  section: string
  students: number
  batch: string
}

const tableData: TableItem[] = [
  {
    id: "CLS-001",
    name: "BCA",
    type: "college",
    level: "UG",
    section: "A",
    students: 60,
    batch: "2025",
  },
  {
    id: "CLS-002",
    name: "BCOM",
    type: "college",
    level: "UG",
    section: "A",
    students: 58,
    batch: "2025",
  },
  {
    id: "CLS-003",
    name: "BTTM",
    type: "college",
    level: "UG",
    section: "B",
    students: 64,
    batch: "2024",
  },
  {
    id: "CLS-004",
    name: "BVC",
    type: "college",
    level: "UG",
    section: "A",
    students: 62,
    batch: "2024",
  },
  {
    id: "CLS-005",
    name: "Class 10",
    type: "school",
    level: "High School",
    section: "A",
    students: 45,
    batch: "2025",
  },
  {
    id: "CLS-006",
    name: "Class 11",
    type: "school",
    level: "Higher Secondary",
    section: "B",
    students: 50,
    batch: "2024",
  },
]

const SchoolManagement = () => {
  const [search, setSearch] = useState("")
  const [selectedType, setSelectedType] = useState<"college" | "school">(
    "college",
  )

  const [selectedBatch, setSelectedBatch] = useState("Select Batch")
  const [isBatchOpen, setIsBatchOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

  const batches = [...new Set(tableData.map((item) => item.batch))]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsBatchOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const filteredData = useMemo(() => {
    return tableData.filter((item) => {
      const matchesType = item.type === selectedType

      const matchesSearch =
        item.id.toLowerCase().includes(search.toLowerCase()) ||
        item.name.toLowerCase().includes(search.toLowerCase())

      const matchesBatch =
        selectedBatch === "Select Batch" ? true : item.batch === selectedBatch

      return matchesType && matchesSearch && matchesBatch
    })
  }, [search, selectedBatch, selectedType])

  return (
    <div className="w-full rounded-xl border border-[#E5E7EB] bg-white p-4 md:p-6 xl:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <h2 className="text-2xl xl:text-[28px] font-semibold text-[#2B2B2B]">
          {selectedType === "college"
            ? "College Management"
            : "School Management"}
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          {/* Type Switch */}
          <div className="flex overflow-hidden rounded-lg border border-[#E5E7EB]">
            <button
              onClick={() => setSelectedType("college")}
              className={`px-4 py-2 text-sm transition-all ${
                selectedType === "college"
                  ? "bg-[#474747] text-white"
                  : "bg-white text-[#474747]"
              }`}
            >
              College
            </button>

            <button
              onClick={() => setSelectedType("school")}
              className={`px-4 py-2 text-sm transition-all ${
                selectedType === "school"
                  ? "bg-[#474747] text-white"
                  : "bg-white text-[#474747]"
              }`}
            >
              School
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-[240px]">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search id or name..."
              className="h-10 w-full rounded-lg bg-[#F5F5F5] pl-10 pr-4 text-sm outline-none"
            />
          </div>

          {/* Batch Dropdown */}
          <div ref={dropdownRef} className="relative w-full sm:w-[180px]">
            <button
              onClick={() => setIsBatchOpen((prev) => !prev)}
              className="flex h-10 w-full items-center justify-between rounded-lg bg-[#F5F5F5] px-4 text-sm text-[#666]"
            >
              <span>{selectedBatch}</span>

              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  isBatchOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isBatchOpen && (
              <div className="absolute top-12 z-50 w-full overflow-hidden rounded-lg border border-[#E5E7EB] bg-white shadow-lg">
                <button
                  onClick={() => {
                    setSelectedBatch("Select Batch")
                    setIsBatchOpen(false)
                  }}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-[#F5F5F5]"
                >
                  All Batches
                </button>

                {batches.map((batch) => (
                  <button
                    key={batch}
                    onClick={() => {
                      setSelectedBatch(batch)
                      setIsBatchOpen(false)
                    }}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-[#F5F5F5]"
                  >
                    {batch}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full">
          <thead>
            <tr className="border-b border-[#E5E7EB] text-left">
              <th className="pb-4 text-sm lg:text-base">ID</th>

              <th className="pb-4 text-sm lg:text-base">
                {selectedType === "college" ? "Department" : "Class"}
              </th>

              <th className="pb-4 text-sm lg:text-base">Level</th>
              <th className="pb-4 text-sm lg:text-base">Section</th>
              <th className="pb-4 text-sm lg:text-base">Students</th>
              <th className="pb-4 text-sm lg:text-base">Status</th>
              <th className="pb-4 text-center text-sm lg:text-base">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item) => (
              <tr
                key={item.id}
                className="border-b border-[#ECECEC] hover:bg-[#FAFAFA]"
              >
                <td className="py-5 text-sm lg:text-base">{item.id}</td>

                <td className="py-5 text-sm lg:text-base">{item.name}</td>

                <td className="py-5 text-sm lg:text-base">{item.level}</td>

                <td className="py-5 text-sm lg:text-base">{item.section}</td>

                <td className="py-5 text-sm lg:text-base">{item.students}</td>

                <td className="py-5">
                  <span className="rounded-md border border-[#22C55E] px-3 py-1 text-xs lg:text-sm font-medium text-[#22C55E]">
                    Active
                  </span>
                </td>

                <td className="py-5 text-center">
                  <button>
                    <SquarePen size={18} className="mx-auto text-[#1677FF]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SchoolManagement
