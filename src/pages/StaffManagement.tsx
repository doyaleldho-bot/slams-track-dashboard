import React, { useEffect, useState } from "react";
import StatsCard from "../components/StatsCard";
import AddStaffModal, {
  type AddStaffFormData,
} from "../components/Staffmanagement/AddStaffModal";
import StaffTable from "../components/Staffmanagement/StaffTable";
import type { SubstituteDetails } from "../components/Staffmanagement/SubstituteDetailsModal";
import api from "../api/axios";

// ── KPI types ──────────────────────────────────────────────────────────────
interface StaffKpiData {
  total_staffs: number;
  teaching_staffs: number;
  non_teaching_staffs: number;
  todays_present_teachers: number;
  todays_absent_teachers: number;
}

// ── Teaching Staff list types ───────────────────────────────────────────────
interface TeachingStaff {
  id: number;
  user_id: string;
  staff_name: string;
  photo: string | null;
  gender: string;
  dob: string;
  address: string;
  email: string;
  phone_number: string;
  qualification: string;
  experience_year: number;
  joining_date: string;
  designation: string;
  employment_type: string;
  department: string;
  salary_type: string;
  monthly_salary: string;
  bank_account: string;
  bank_name: string;
  ifsc_code: string;
  payroll_applicable: boolean;
  is_teacher: boolean;
}

import {
  Users,
  UserCheck,
  UserPlus,
  UserCog,
  UserX,
  GraduationCap,
  FileText,
} from "lucide-react";

const StaffManagement = () => {
  const [mainTab, setMainTab] = React.useState("Teaching Staff");
  const [staffTypeTab, setStaffTypeTab] = React.useState("Teacher");
  const [subTab, setSubTab] = React.useState("Assign Substitute");

  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = React.useState(false);

  // KPI cards state
  const [kpiData, setKpiData] = useState<StaffKpiData | null>(null);
  const [kpiLoading, setKpiLoading] = useState(true);
  const [kpiError, setKpiError] = useState<string | null>(null);

  useEffect(() => {
    const loadKpi = async () => {
      try {
        setKpiLoading(true);
        setKpiError(null);
        const res = await api.get<{ status: boolean; message: string; data: StaffKpiData }>(
          "/staff-kpi-cards-data/"
        );
        setKpiData(res.data.data);
      } catch (err: any) {
        setKpiError("Failed to load KPI data");
        console.error("Staff KPI fetch error:", err);
      } finally {
        setKpiLoading(false);
      }
    };

    loadKpi();
  }, []);

  // edit mode
  const [isEditStaffMode, setIsEditStaffMode] = React.useState(false);
  const [editingStaffId, setEditingStaffId] = React.useState<string | null>(null);
  const [editingStaff, setEditingStaff] = React.useState<any | null>(null);

  // Teaching staff list state
  const [teacherList, setTeacherList] = React.useState<TeachingStaff[]>([]);
  const [teacherLoading, setTeacherLoading] = React.useState(false);
  const [teacherError, setTeacherError] = React.useState<string | null>(null);
  const [teacherPage, setTeacherPage] = React.useState(1);
  const [teacherTotalPages, setTeacherTotalPages] = React.useState(1);

  const fetchTeachingStaff = React.useCallback(async (page = 1) => {
    try {
      setTeacherLoading(true);
      setTeacherError(null);
      const res = await api.get("/list-teaching-staff/", { params: { page } });
      if (res.data.status) {
        setTeacherList(res.data.data);
        setTeacherTotalPages(res.data.total_pages ?? 1);
        setTeacherPage(res.data.current_page ?? page);
      }
    } catch (err: any) {
      setTeacherError("Failed to load teaching staff");
      console.error("Teaching staff fetch error:", err);
    } finally {
      setTeacherLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachingStaff(1);
  }, [fetchTeachingStaff]);

  const [substituteAssignments, setSubstituteAssignments] = React.useState<
    SubstituteDetails[]
  >([]);


  // Non-teaching staff list state
  const [nonTeachingList, setNonTeachingList] = React.useState<any[]>([]);
  const [nonTeachingLoading, setNonTeachingLoading] = React.useState(false);
  const [nonTeachingError, setNonTeachingError] = React.useState<string | null>(null);
  const [nonTeachingPage, setNonTeachingPage] = React.useState(1);
  const [nonTeachingTotalPages, setNonTeachingTotalPages] = React.useState(1);

  const fetchNonTeachingStaff = React.useCallback(async (page = 1) => {
    try {
      setNonTeachingLoading(true);
      setNonTeachingError(null);
      const res = await api.get("/list-non-teaching-staff/", { params: { page } });
      if (res.data.status) {
        setNonTeachingList(res.data.data);
        setNonTeachingTotalPages(res.data.total_pages ?? 1);
        setNonTeachingPage(res.data.current_page ?? page);
      }
    } catch (err: any) {
      setNonTeachingError("Failed to load non-teaching staff");
      console.error("Non-teaching staff fetch error:", err);
    } finally {
      setNonTeachingLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNonTeachingStaff(1);
  }, [fetchNonTeachingStaff]);

  const openEditModal = (staff: any) => {
    setIsEditStaffMode(true);
    setEditingStaffId(staff.id);
    setEditingStaff(staff);
    setIsAddStaffModalOpen(true);
  };

  const deleteStaff = (staffId: string) => {
    const ok = window.confirm("Are you sure you want to delete this staff member?");
    if (!ok) return;
    // Local optimistic removal while delete API is pending
    if (mainTab === "Non-Teaching Staff") {
      setNonTeachingList((cur) => cur.filter((s: any) => s.id !== staffId));
    } else {
      setTeacherList((cur) => cur.filter((s: any) => s.id !== staffId));
    }
  };

  const handleSubstituteAssigned = (assignment: SubstituteDetails) => {
    setSubstituteAssignments((current) => [assignment, ...current]);
    setSubTab("Substitute List");
  };

  const teachingStaffStats = [
    {
      title: "Total Teachers",
      value: kpiLoading ? "—" : kpiError ? "N/A" : String(kpiData?.total_staffs ?? 0),
      subtitle: kpiError ? kpiError : "All staff members",
      icon: <Users size={18} />,
    },
    {
      title: "Teaching Staff",
      value: kpiLoading ? "—" : kpiError ? "N/A" : String(kpiData?.teaching_staffs ?? 0),
      subtitle: "Enrolled teaching staff",
      icon: <UserPlus size={18} />,
    },
    {
      title: "Non-Teaching Staff",
      value: kpiLoading ? "—" : kpiError ? "N/A" : String(kpiData?.non_teaching_staffs ?? 0),
      subtitle: "Support & admin staff",
      icon: <UserCog size={18} />,
    },
    {
      title: "Present Today",
      value: kpiLoading ? "—" : kpiError ? "N/A" : String(kpiData?.todays_present_teachers ?? 0),
      subtitle: "Teachers present today",
      icon: <UserCheck size={18} />,
    },
    {
      title: "Absent Today",
      value: kpiLoading ? "—" : kpiError ? "N/A" : String(kpiData?.todays_absent_teachers ?? 0),
      subtitle: "Teachers absent today",
      icon: <UserX size={18} />,
    },
  ];

  const statsData = teachingStaffStats;

  const statsGridClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5";

  const initialForm: Partial<AddStaffFormData> | undefined =
    isEditStaffMode && editingStaff
      ? {
          teacherName: editingStaff.staff_name ?? editingStaff.name ?? "",
          staffId: editingStaff.user_id ?? editingStaff.id ?? "",
          phoneNumber: editingStaff.phone_number ?? editingStaff.phone ?? "",
          email: editingStaff.email ?? "",
          gender: editingStaff.gender ?? "",
          dob: editingStaff.dob ?? "",
          photo: null,
          address: editingStaff.address ?? "",
          qualification: editingStaff.qualification ?? "",
          experienceYear: editingStaff.experience_year ? String(editingStaff.experience_year) : "",
          specialization: editingStaff.specialization ?? "",
          courseExpertise: editingStaff.subject_expertise ?? editingStaff.courseExpertise ?? "",
          joiningDate: editingStaff.joining_date ?? "",
          designation: editingStaff.designation ?? "",
          employmentType: editingStaff.employment_type ?? "",
          department: editingStaff.department ?? "",
          reportingAdmin: editingStaff.reporting_admin ?? "",
          salaryType: editingStaff.salary_type ?? "",
          monthlySalary: editingStaff.monthly_salary ? String(editingStaff.monthly_salary) : "",
          bankAccountNumber: editingStaff.bank_account ?? editingStaff.bankAccountNumber ?? "",
          bankName: editingStaff.bank_name ?? editingStaff.bankName ?? "",
          ifscCode: editingStaff.ifsc_code ?? editingStaff.ifscCode ?? "",
          role: editingStaff.role ?? "",
          temporaryPassword: "",
          permissions: editingStaff.permissions ?? [],
        }
      : undefined;

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between">
        <div>
          <h2 className="font-bold text-[24px] tracking-wider leading-[32px] text-[#2F2F2F]">
            Staff Management
          </h2>
          <p className="text-[14px] text-[#767676] pt-2">
            Manage faculty profiles, payroll, and leave management
          </p>
        </div>

        <button
          onClick={() => {
            setIsEditStaffMode(false);
            setEditingStaff(null);
            setEditingStaffId(null);
            setIsAddStaffModalOpen(true);
          }}
          className="h-9 px-4 rounded-[10px] bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm"
        >
          + Add Staff
        </button>
      </div>

      {isAddStaffModalOpen && (
        <AddStaffModal
          initialForm={initialForm}
          isEdit={isEditStaffMode}
          dbId={editingStaff?.dbId}
          isTeacher={mainTab === "Teaching Staff"}
          onClose={() => {
            setIsAddStaffModalOpen(false);
            setIsEditStaffMode(false);
            setEditingStaff(null);
            setEditingStaffId(null);
          }}
          onSave={(_form) => {
            // Re-fetch both live lists after a successful create/edit
            fetchTeachingStaff(teacherPage);
            fetchNonTeachingStaff(nonTeachingPage);
            setIsAddStaffModalOpen(false);
            setIsEditStaffMode(false);
            setEditingStaff(null);
            setEditingStaffId(null);
          }}
        />
      )}

      {/* STATS */}
      <div className={`grid ${statsGridClass} gap-4 xl:gap-6 pt-10`}>
        {statsData.map((card, i) => (
          <StatsCard key={i} {...card} width="100%" height="120px" />
        ))}
      </div>

      {/* MAIN TAB */}
      <div className="pt-10">
        <div className="bg-[#FFFFFF] p-1 rounded-[18px] inline-flex shadow-sm">
          {["Teaching Staff", "Non-Teaching Staff"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setMainTab(tab);
                if (tab === "Non-Teaching Staff") {
                  setStaffTypeTab("Teacher");
                  setSubTab("Assign Substitute");
                }
              }}
              className={`px-6 py-3 rounded-[16px] text-sm font-medium transition ${
                mainTab === tab
                  ? "bg-black text-white shadow-sm"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* SECOND TAB */}
      {mainTab === "Teaching Staff" && (
        <div className="pt-8 border-b flex gap-10 text-sm">
          {[
            { name: "Teacher", icon: GraduationCap },
            { name: "Substitute", icon: Users },
            { name: "Leave Request", icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.name}
                onClick={() => {
                  setStaffTypeTab(tab.name);
                  setSubTab("Assign Substitute");
                }}
                className={`pb-3 flex items-center gap-2 transition-all ${
                  staffTypeTab === tab.name
                    ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <Icon size={16} />
                {tab.name}
              </button>
            );
          })}
        </div>
      )}

      {/* THIRD TAB (ONLY FOR SUBSTITUTE) */}
      {mainTab === "Teaching Staff" && staffTypeTab === "Substitute" && (
        <div className="pt-6">
          <div className="bg-[#F3F3F3] p-1 rounded-[18px] inline-flex shadow-sm">
            {["Assign Substitute", "Substitute List"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSubTab(tab)}
                className={`px-6 py-3 rounded-[16px] text-sm font-medium transition ${
                  subTab === tab
                    ? "bg-black text-white shadow-sm"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="pt-8">
        <StaffTable
          mainTab={mainTab}
          staffTypeTab={staffTypeTab}
          subTab={subTab}
          substituteAssignments={substituteAssignments}
          onSubstituteAssigned={handleSubstituteAssigned}
          teacherList={teacherList}
          teacherLoading={teacherLoading}
          teacherError={teacherError}
          currentPage={teacherPage}
          totalPages={teacherTotalPages}
          onPageChange={(page) => fetchTeachingStaff(page)}
          nonTeachingList={nonTeachingList}
          nonTeachingLoading={nonTeachingLoading}
          nonTeachingError={nonTeachingError}
          nonTeachingPage={nonTeachingPage}
          nonTeachingTotalPages={nonTeachingTotalPages}
          onNonTeachingPageChange={(page) => fetchNonTeachingStaff(page)}
          onEditStaff={(staff) => openEditModal(staff)}
          onDeleteStaff={(id) => deleteStaff(id)}
        />
      </div>
    </div>
  );
};

export default StaffManagement;

