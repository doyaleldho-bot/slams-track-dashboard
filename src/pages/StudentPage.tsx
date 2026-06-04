import React, { useState } from "react";
import { ArrowUpDown, } from "lucide-react";
import StudentKPICards from "../components/StudentComponents/StudentKPICards";
import StudentSearchBar from "../components/StudentComponents/StudentSearchBar";
import FilterButtons from "../components/StudentComponents/FilterButtons";
import StudentTable from "../components/StudentComponents/StudentTable";
import AddStudentModal from "../components/StudentComponents/AddStudentModal";

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
    onEdit?: (id: string) => void;
}




const StudentPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<"All" | "Present" | "Absent">("All");
    const [selectedClass, setSelectedClass] = useState("1");
    const [showAddModal, setShowAddModal] = useState(false);
    const [kpiData, setKpiData] = useState({
        totalStudents: 0,
        totalStudentsChange: "+12% from last year",

        absentStudents: 0,
        absentStudentsChange: "-10% from last month",

        presentStudents: 0,
        presentStudentsChange: "-90% from last month",

        newAdmissions: 0,

        feePending: 0,
        feePendingChange: "require attention",
    });
    // const [studentList, setStudentList] = useState([]);

    const [studentList, setStudentList] = useState<Student[]>([
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
            class: "10",
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
            class: "8",
            section: "Section A",
            rollNo: "Roll: 10A01",
            admitted: "12 Jun 2025",
            feeStatus: "Paid",
            attend: 60,
            status: "Present",
        },
        {
            id: "School-1234",
            name: "Aarav Sharma",
            class: "9",
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
            class: "10",
            section: "Section A",
            rollNo: "Roll: 10A01",
            admitted: "12 Jun 2025",
            feeStatus: "Paid",
            attend: 60,
            status: "Absent",
        },
    ]);

    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    //dummy api
    //     const fetchStudents = async (className: string) => {
    //   try {
    //     const res = await api.get(
    //       `/students?class=${encodeURIComponent(className)}&page=1&limit=10`
    //     );

    //     setStudents(res.data.students);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };


    //     const fetchStudents = async (className: string) => {
    //   try {
    //     const res = await api.get(
    //       `/students?class=${encodeURIComponent(className)}`
    //     );

    //     const students = res.data.students;

    //     setStudentList(students);

    //     setKpiData({
    //       totalStudents: students.length,
    //       absentStudents: students.filter(
    //         (s: Student) => s.status === "Absent"
    //       ).length,
    //       presentStudents: students.filter(
    //         (s: Student) => s.status === "Present"
    //       ).length,
    //       newAdmissions: students.filter(
    //         (s: Student) => new Date(s.admitted).getFullYear() === 2026
    //       ).length,
    //       feePending: students.filter(
    //         (s: Student) => s.feeStatus === "Pending"
    //       ).length,
    //     });
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };

    //for filter and search put in main page and pass the filtered list to table component
    const filteredStudents = studentList.filter((student) => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter =
            activeFilter === "All" ||
            student.status === activeFilter;

        return matchesSearch && matchesFilter;
    });

    function handleViewStudent(studentId: string): void {
        throw new Error("Function not implemented.");
    }

    function handleEditStudent(id: string) {
        const s = studentList.find((st) => st.id === id);
        if (s) {
            setSelectedStudent(s);
            setShowAddModal(true);
        }
    }

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
                    <select
                        value={selectedClass}
                        onChange={(e) => {
                            const value = e.target.value;

                            setSelectedClass(value);
                            // fetchStudents(value);
                        }}

                        className="px-4 py-2 bg-white border border-gray-300 rounded-md"
                    >
                        <option value="LKG">LKG</option>
                        <option value="UKG">UKG</option>
                        <option value="1">Class 1</option>
                        <option value="2">Class 2</option>
                        <option value="3">Class 3</option>
                        <option value="4">Class 4</option>
                        <option value="5">Class 5</option>
                        <option value="6">Class 6</option>
                        <option value="7">Class 7</option>
                        <option value="8">Class 8</option>
                        <option value="9">Class 9</option>
                        <option value="10">Class 10</option>
                        <option value="11">Class 11</option>
                        <option value="12">Class 12</option>
                    </select>
                    <button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md transition-colors">
                        + Add Students
                    </button>
                    <AddStudentModal
                        open={showAddModal}
                        onClose={() => { setShowAddModal(false); setSelectedStudent(null); }}
                        student={selectedStudent}
                        onSaved={(saved) => {
                            if (!saved) return;
                            if (selectedStudent) {
                                // update existing
                                setStudentList((prev) => prev.map((s) => s.id === selectedStudent.id ? {
                                    ...s,
                                    name: saved.personal?.name || s.name,
                                    class: saved.academic?.className || s.class,
                                    section: saved.academic?.section || s.section,
                                    admitted: saved.academic?.admissionDate || s.admitted,
                                } : s));
                            } else {
                                // add new
                                const newId = saved.id || `School-${Date.now()}`;
                                const newStudent: Student = {
                                    id: newId,
                                    name: saved.personal?.name || "",
                                    class: saved.academic?.className || "",
                                    section: saved.academic?.section || "",
                                    rollNo: "",
                                    admitted: saved.academic?.admissionDate || new Date().toLocaleDateString(),
                                    feeStatus: "Pending",
                                    attend: 0,
                                    status: "Present",
                                };
                                setStudentList((prev) => [newStudent, ...prev]);
                            }
                            setSelectedStudent(null);
                            setShowAddModal(false);
                        }}
                    />
                </div>
            </div>

            {/* KPI Cards Section */}
            <StudentKPICards
                totalStudents={kpiData.totalStudents}
                totalStudentsChange={kpiData.totalStudentsChange}
                absentStudents={kpiData.absentStudents}
                absentStudentsChange={kpiData.absentStudentsChange}
                presentStudents={kpiData.presentStudents}
                presentStudentsChange={kpiData.presentStudentsChange}
                newAdmissions={kpiData.newAdmissions}
                feePending={kpiData.feePending}
                feePendingChange={kpiData.feePendingChange}
            />
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
                <StudentTable students={filteredStudents} onEdit={handleEditStudent} />
            </div>
        </div>
    );
};

export default StudentPage;
