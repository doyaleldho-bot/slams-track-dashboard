import { useEffect, useState, type ReactNode } from "react";
import { ArrowUpDown } from "lucide-react";
import StudentKPICards from "../components/StudentComponents/StudentKPICards";
import StudentSearchBar from "../components/StudentComponents/StudentSearchBar";
import FilterButtons from "../components/StudentComponents/FilterButtons";
import StudentTable from "../components/StudentComponents/StudentTable";
import AddStudentModal from "../components/StudentComponents/AddStudentModal";
import api from "../api/axios";
import { getClasses } from "../services/classApi";
import { toast } from "react-toastify";

export interface Student {
  id?: string;
  studentId?: string;
  name: string;
  class: string;
  section: string;
  rollNo: string;
  admitted: string;
  feeStatus: "Paid" | "Pending";
  attend: number;
  status: "Present" | "Absent" | "Late";
}

export interface StudentTableProps {
  students?: Student[];
  onEdit?: (id: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
interface ClassItem {
  class_batch: ReactNode;
  class_section: string;
  id: number;
  class_name: string;
}

interface StudentApiResponse {
  status: boolean;
  message: string;
  total_students: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  data: {
    id: number;
    student_id: string;
    fullname: string;
    phone_number: string;
    class_name: string;
    section_roll: {
      section: string;
      roll_no: string;
    };
    admission_date: string;
    fee_status: string;
    attendance_date: string;
    attendance_status: string;
    status: string;
  }[];
}

const StudentPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "All" | "Present" | "Absent"
  >("All");
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
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");

  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [sections, setSections] = useState<string[]>([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  useEffect(() => {
    const loadClasses = async () => {
      try {
        const classList = await getClasses();
        setClasses(classList);
      } catch (error) {
        console.error(error);
      }
    };

    loadClasses();
  }, []);

  useEffect(() => {
    if (selectedClass && selectedSection) {
      fetchKpiData(
        selectedClass,
        selectedSection
      );

      fetchStudentList(
        selectedClass,
        selectedSection
      );
    }
  }, [selectedClass, selectedSection]);

  //student data api
  const [studentList, setStudentList] = useState<Student[]>([]);

  const fetchStudentList = async (classId: string, section: string, page = 1) => {
    try {
      const res = await api.get<StudentApiResponse>(
        `/student-list/?status=all&class_id=${classId}&page=${page}&section=${section}`
      );
      setCurrentPage(res.data.current_page);
      setTotalPages(res.data.total_pages);

      const students: Student[] = res.data.data.map((student) => ({
        id: String(student.id),
        studentId: student.student_id,
        name: student.fullname,
        class: student.class_name,
        section: student.section_roll.section,
        rollNo: student.section_roll.roll_no,
        admitted: student.admission_date,
        feeStatus:
          student.fee_status === "Paid" ? "Paid" : "Pending",
        attend: 0, // API doesn't provide attendance percentage
        status:
          student.attendance_status === "Present"
            ? "Present"
            : student.attendance_status === "Late"
              ? "Late"
              : "Absent",
      }));
      setStudentList(students);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchKpiData = async (
    classId: string,
    section: string
  ) => {
    try {
      const today = new Date().toISOString().split("T")[0];

      const res = await api.get(
        `/dashboard/kpi/?date=${today}&class_id=${classId}&section=${section}`
      );

      const data = res.data.data;

      setKpiData((prev) => ({
        ...prev,
        totalStudents: data.total_students,
        absentStudents: data.absent_students,
        presentStudents: data.present_students,
        newAdmissions: data.applications_received,
        feePending: data.fee_pending,
      }));
    } catch (error) {
      console.error("KPI API Error:", error);
    }
  };


  //for filter and search put in main page and pass the filtered list to table component
  const filteredStudents = studentList.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === "All" || student.status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  const handleEditStudent = async (id: string) => {
    try {
      const res = await api.get(`/student-overview/${id}/`);

      const student = res.data.data;

      setSelectedStudent(student);
      setShowAddModal(true);
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  //rearrange roll no. button click handler
  const handleRearrangeRollNumbers = async () => {
    try {
      const res = await api.post("/arrange-roll-numbers/", {
        class_id: selectedClass,
        section: selectedSection,
      });

      if (res.data.status) {
        toast.success(
          `${res.data.message}. Total Students: ${res.data.total_students}`
        );

        // Refresh student list if needed
        fetchStudentList(selectedClass, selectedSection);
      }
    } catch (error: any) {
      console.error("Error rearranging roll numbers:", error);
      toast.error(
        error?.response?.data?.message ||
        "Failed to rearrange roll numbers"
      );
    }
  };

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
              const selectedCls = classes.find(
                (cls) => String(cls.id) === e.target.value
              );

              if (selectedCls) {
                setSelectedClass(String(selectedCls.id)); // 17
                setSelectedSection(selectedCls.class_section); // A
              }
            }}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md"
          >
            <option value="">Select Class</option>

            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.class_name} - {cls.class_section} - {cls.class_batch}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md transition-colors"
          >
            + Add Students
          </button>
          <AddStudentModal
            open={showAddModal}
            onClose={() => {
              setShowAddModal(false);
              setSelectedStudent(null);
            }}
            student={selectedStudent}
            onSaved={(saved) => {
              if (!saved) return;
              if (selectedStudent) {
                // update existing row locally
                setStudentList((prev) =>
                  prev.map((s) => {
                    const matchesStudentId =
                      s.studentId === selectedStudent.student_id ||
                      s.studentId === selectedStudent.studentId ||
                      s.id === String(selectedStudent.profile_id) ||
                      s.id === String(selectedStudent.id);

                    return matchesStudentId
                      ? {
                        ...s,
                        name: saved.personal?.name || s.name,
                        class: saved.academic?.className || s.class,
                        section: saved.academic?.section || s.section,
                        admitted: saved.academic?.admissionDate || s.admitted,
                      }
                      : s;
                  }),
                );
              } else {
                // add new
                const newId = saved.id || `School-${Date.now()}`;
                const newStudent: Student = {
                  id: newId,
                  name: saved.personal?.name || "",
                  class: saved.academic?.className || "",
                  section: saved.academic?.section || "",
                  rollNo: "",
                  admitted:
                    saved.academic?.admissionDate ||
                    new Date().toLocaleDateString(),
                  feeStatus: "Pending",
                  attend: 0,
                  status: "Present",
                };
                setStudentList((prev) => [newStudent, ...prev]);
              }

              // Refresh data from server to ensure class/section updates are reflected
              if (selectedClass && selectedSection) {
                fetchStudentList(selectedClass, selectedSection);
              }

              setSelectedStudent(null);
              setShowAddModal(false);
            }}
          />
        </div>
      </div>

      {!selectedClass ? (
        <div className="bg-white rounded-lg border border-gray-200 py-16 text-center">
          <h3 className="text-lg font-medium text-gray-800">
            Select a Class
          </h3>

          <p className="text-sm text-gray-500 mt-2">
            Choose a class from the dropdown above to view student records.
          </p>
        </div>

      ) : (
        <>
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
            <button onClick={handleRearrangeRollNumbers} disabled={!selectedClass || !selectedSection} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              <ArrowUpDown size={16} />
              Rearrange Roll No.
            </button>
            <FilterButtons onFilterChange={setActiveFilter} />
          </div>

          {/* Student Table Section */}
          <div className="overflow-x-auto">
            <StudentTable students={filteredStudents} onEdit={handleEditStudent} currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => fetchStudentList(selectedClass, selectedSection, page)
            } />
          </div>
        </>
      )}
    </div>
  );
};

export default StudentPage;
