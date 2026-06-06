import React from "react";
import StatsCard from "../components/StatsCard";
import AddStaffModal from "../components/Staffmanagement/AddStaffModal";
import StaffTable from "../components/Staffmanagement/StaffTable";
import type { SubstituteDetails } from "../components/Staffmanagement/SubstituteDetailsModal";

import {
  CircleCheck,
  CircleHelp,
  CircleX,
  ClipboardList,
  Users,
  UserCheck,
  UserX,
  UserPlus,
  UserCog,
} from "lucide-react";

const StaffManagement = () => {
  const [mainTab, setMainTab] = React.useState("Teaching Staff");
  const [staffTypeTab, setStaffTypeTab] = React.useState("Teacher");
  const [subTab, setSubTab] = React.useState("Assign Substitute");
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = React.useState(false);
  const [substituteAssignments, setSubstituteAssignments] = React.useState<
    SubstituteDetails[]
  >([]);
  const [teacherList, setTeacherList] = React.useState<any[]>([
    {
      id: "TCH001",
      name: "Sarah Johnson",
      phone: "+1 234-567-8901",
      email: "sarah.j@school.com",
      department: "Mathematics",
      attendance: "92%",
      status: "Active",
    },
    {
      id: "TCH002",
      name: "Michael Chen",
      phone: "+1 234-567-8901",
      email: "sarah.j@school.com",
      department: "Physics",
      attendance: "82%",
      status: "Active",
    },
    {
      id: "TCH003",
      name: "David Thompson",
      phone: "+1 234-567-8901",
      email: "sarah.j@school.com",
      department: "Chemistry",
      attendance: "65%",
      status: "Inactive",
    },
  ]);

  const [nonTeachingList, setNonTeachingList] = React.useState<any[]>([
    {
      id: "NTS001",
      name: "Ayesha Khan",
      phone: "+1 234-567-8901",
      email: "ayesha.k@school.com",
      department: "Administration",
      attendance: "95%",
      status: "Active",
    },
    {
      id: "NTS002",
      name: "Ravi Patel",
      phone: "+1 234-567-8902",
      email: "ravi.p@school.com",
      department: "Library",
      attendance: "92%",
      status: "Active",
    },
    {
      id: "NTS003",
      name: "Meera Singh",
      phone: "+1 234-567-8903",
      email: "meera.s@school.com",
      department: "Transport",
      attendance: "88%",
      status: "Inactive",
    },
    {
      id: "NTS004",
      name: "John Doe",
      phone: "+1 234-567-8904",
      email: "john.d@school.com",
      department: "Front Office",
      attendance: "90%",
      status: "Active",
    },
    {
      id: "NTS005",
      name: "Sara Nair",
      phone: "+1 234-567-8905",
      email: "sara.n@school.com",
      department: "Cafeteria",
      attendance: "93%",
      status: "Active",
    },
  ]);

  const handleSubstituteAssigned = (assignment: SubstituteDetails) => {
    setSubstituteAssignments((current) => [assignment, ...current]);
    setSubTab("Substitute List");
  };

  const teachingStaffStats = [
    {
      title: "Total Teachers",
      value: "1,138",
      subtitle: "+12% this month",
      icon: <Users size={18} />,
    },
    {
      title: "Teaching Staff",
      value: "120",
      subtitle: "-3% from this month",
      icon:<UserPlus size={18} /> ,
    },
    {
      title: "Non-Teaching Staff",
      value: "45",
      subtitle: "+8% from this month",
      icon: <UserCog size={18} /> ,
    },
    {
      title: "Present",
      value: "60",
      subtitle: "+5 this month",
      icon:<UserCheck size={18} />,
    },
    {
      title: "Absent",
      value: "60",
      subtitle: "Requires attention",
      icon:<UserX size={18} />,
    },
  ];

  const substituteStats = [
    {
      title: "Completed Substitutions",
      value: "60",
      subtitle: "+16 this month",
      icon: <UserCheck size={18} />,
    },
    {
      title: "Teachers Free Now",
      value: "60",
      subtitle: "+3 this month",
      icon: <UserPlus size={18} />,
    },
    {
      title: "Classes Without Teacher",
      value: "60",
      subtitle: "+3 this month",
      icon: <Users size={18} />,
    },
  ];

  const nonTeachingStaffStats = [
    {
      title: "Total Staff",
      value: "1,138",
      subtitle: "+12% from last year",
      icon: <Users size={18} />,
    },
    {
      title: "Active Staff",
      value: "120",
      subtitle: "-10% from last month",
      icon: <CircleX size={18} />,
    },
    {
      title: "On Leave",
      value: "45",
      subtitle: "+90% from last month",
      icon: <CircleCheck size={18} />,
    },
    {
      title: "Late",
      value: "60",
      subtitle: "This academic year",
      icon: <ClipboardList size={18} />,
    },
    {
      title: "New Joiners",
      value: "60",
      subtitle: "This academic year",
      icon: <CircleHelp size={18} />,
    },
  ];

  let statsData = teachingStaffStats;
  if (mainTab === "Teaching Staff" && staffTypeTab === "Substitute") {
    statsData = substituteStats;
  } else if (mainTab === "Non-Teaching Staff") {
    statsData = nonTeachingStaffStats;
  }

  const statsGridClass =
    statsData.length === 5
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";

  return (
    <div className="px-6 xl:px-10 2xl:px-14 max-w-[1445px] mx-auto">
      {/* HEADER */}
      <div className="flex justify-between">
        <div>
          <h2 className="font-bold text-[24px] tracking-wide leading-[32px] text-[#2F2F2F]">
            Staff Management
          </h2>
          <p className="text-[14px] text-[#767676] pt-2">
            Manage faculty profiles, payroll, and leave management
          </p>
        </div>

        <button
          onClick={() => setIsAddStaffModalOpen(true)}
          className="h-9 px-4 rounded-[10px] bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm"
        >
          + Add Staff
        </button>
      </div>

      {isAddStaffModalOpen && (
        <AddStaffModal
          onClose={() => setIsAddStaffModalOpen(false)}
          onSave={(form) => {
            // build a minimal staff record from the form
            const record = {
              id: form.staffId || `STF${Date.now().toString().slice(-5)}`,
              name: form.teacherName || "-",
              phone: form.phoneNumber || "-",
              email: form.email || "-",
              department: form.department || "-",
              attendance: "0%",
              status: "Active",
            };

            if (mainTab === "Non-Teaching Staff") {
              setNonTeachingList((cur) => [record, ...cur]);
            } else {
              // default goes to teacher list
              setTeacherList((cur) => [record, ...cur]);
            }
            setIsAddStaffModalOpen(false);
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
          {["Teacher", "Substitute"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setStaffTypeTab(tab);
                setSubTab("Assign Substitute"); // reset
              }}
              className={`pb-3 flex items-center gap-2 ${
                staffTypeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
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
          nonTeachingList={nonTeachingList}
        />
      </div>
    </div>
  );
};

export default StaffManagement;
