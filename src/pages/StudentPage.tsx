import React, { useState } from "react";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import StudentKPICards from "../components/StudentComponents/StudentKPICards";
import StudentSearchBar from "../components/StudentComponents/StudentSearchBar";
import FilterButtons from "../components/StudentComponents/FilterButtons";
import StudentTable from "../components/StudentComponents/StudentTable";

export interface Student {
    id: string;
    name: string;
    class: string;
    section: string;
    rollNo: string;
    admitted: string;
    feeStatus: "Paid" | "Pending";
    attend: number;
    status: "Present" | "Absent";
}

export interface StudentTableProps {
    students?: Student[];
}


const StudentPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<"All" | "Present" | "Absent">("All");

    const studnetList: Student[] = [
        {
            id: "School-1234",
            name: "Aarav Sharma",
            class: "Class 10",
            section: "Section A",
            rollNo: "Roll: 10A01",
            admitted: "12 Jun 2025",
            feeStatus: "Paid",
            attend: 92,
            status: "Present",
        },
        {
            id: "School-1234",
            name: "Sharma VD",
            class: "Class 10",
            section: "Section A",
            rollNo: "Roll: 10A01",
            admitted: "12 Jun 2025",
            feeStatus: "Pending",
            attend: 85,
            status: "Present",
        },
        {
            id: "School-1234",
            name: "Aarav Sharma",
            class: "Class 10",
            section: "Section A",
            rollNo: "Roll: 10A01",
            admitted: "12 Jun 2025",
            feeStatus: "Paid",
            attend: 60,
            status: "Absent",
        },
        {
            id: "School-1234",
            name: "Aarav Sharma",
            class: "Class 10",
            section: "Section A",
            rollNo: "Roll: 10A01",
            admitted: "12 Jun 2025",
            feeStatus: "Pending",
            attend: 85,
            status: "Present",
        },
        {
            id: "School-1234",
            name: "Aarav Sharma",
            class: "Class 10",
            section: "Section A",
            rollNo: "Roll: 10A01",
            admitted: "12 Jun 2025",
            feeStatus: "Pending",
            attend: 85,
            status: "Present",
        },
        {
            id: "School-1234",
            name: "Aarav Sharma",
            class: "Class 10",
            section: "Section A",
            rollNo: "Roll: 10A01",
            admitted: "12 Jun 2025",
            feeStatus: "Paid",
            attend: 60,
            status: "Absent",
        },
        {
            id: "School-1234",
            name: "Aarav Sharma",
            class: "Class 10",
            section: "Section A",
            rollNo: "Roll: 10A01",
            admitted: "12 Jun 2025",
            feeStatus: "Paid",
            attend: 60,
            status: "Absent",
        },
        {
            id: "School-1234",
            name: "Aarav Sharma",
            class: "Class 10",
            section: "Section A",
            rollNo: "Roll: 10A01",
            admitted: "12 Jun 2025",
            feeStatus: "Paid",
            attend: 60,
            status: "Absent",
        },
    ];

  //for filter and search put in main page and pass the filtered list to table component
    const filteredStudents = studnetList.filter((student) => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter =
            activeFilter === "All" ||
            student.status === activeFilter;

        return matchesSearch && matchesFilter;
    });

    return (
        <div className=" min-h-screen">
            {/* Header Section with Title, Dropdown, and Add Button */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="font-poppins text-[24px] leading-[32px] font-semibold text-gray-900">
                        Student Management
                    </h1>
                    <p className="text-gray-600 text-sm mt-1">
                        Manage student profiles, enrollments, and payments
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                        <span className="text-sm font-medium">Classes</span>
                        <ChevronDown className="w-4 h-4" />
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md transition-colors">
                        + Add Students
                    </button>
                </div>
            </div>

            {/* KPI Cards Section */}
            <StudentKPICards />

            {/* Search and Filter Section */}
            <div className="flex items-center justify-between gap-4 mb-4 bg-white p-4 rounded-lg">
                <StudentSearchBar onSearch={setSearchQuery} />
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    <ArrowUpDown size={16} />
                    Rearrange Roll No.
                </button>
                <FilterButtons onFilterChange={setActiveFilter} />
            </div>

            {/* Student Table Section */}
            <div className="overflow-x-auto">
                <StudentTable students={filteredStudents} />
            </div>
        </div>
    );
};

export default StudentPage;
