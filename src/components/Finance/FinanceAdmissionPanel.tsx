import React, { useMemo, useState } from "react";
import { Search, CalendarDays, Eye, Edit3 } from "lucide-react";
import FinanceAdmissionDetail from "./FinanceAdmissionDetail";
import StatusBadge from "./StatusBadge";
import EditAdmissionModal from "./EditAdmissionModal";

interface AdmissionRow {
  id: string;
  studentName: string;
  gender: string;
  birthDate: string;
  course: string;
  admissionDate: string;
  admissionAmount: string;
  receiptId: string;
  paidAmount: string;
  balanceAmount: string;
  paymentMode: string;
  paymentStatus: "Paid" | "Pending" | "Failed";
  fatherName: string;
  motherName: string;
  address: string;
  mobileNumber: string;
  email: string;
  documents: { label: string }[];
}

const admissionData: AdmissionRow[] = [
  {
    id: "in123",
    studentName: "Deva",
    gender: "Male",
    birthDate: "21-05-2001",
    course: "10th Standard",
    admissionDate: "21-05-2026",
    admissionAmount: "$25000",
    receiptId: "RCPT-123",
    paidAmount: "$25000",
    balanceAmount: "$0",
    paymentMode: "Bank Transfer",
    paymentStatus: "Paid",
    fatherName: "Radhakrishnan",
    motherName: "Radha",
    address:
      "House No. 12/245, Green Valley Residency, M.G. Road, Kadavanthra, Kochi, Ernakulam, Kerala - 682020",
    mobileNumber: "6350125686",
    email: "Deva222001@gmail.com",
    documents: [
      { label: "Student Photo" },
      { label: "Birth Certificate" },
      { label: "Previous School TC" },
      { label: "Aadhar Card (Student)" },
      { label: "Parent ID Proof" },
      { label: "Caste / Category Certificate" },
    ],
  },
  {
    id: "in124",
    studentName: "Devanand",
    gender: "Male",
    birthDate: "14-02-2002",
    course: "B.com 1st Year",
    admissionDate: "21-05-2026",
    admissionAmount: "$25000",
    receiptId: "RCPT-124",
    paidAmount: "$15000",
    balanceAmount: "$10000",
    paymentMode: "Bank Transfer",
    paymentStatus: "Pending",
    fatherName: "Kannan",
    motherName: "Suma",
    address:
      "Flat 7B, Silver Oaks Apartments, Palarivattom, Kochi, Ernakulam, Kerala - 682025",
    mobileNumber: "9876543210",
    email: "devanand23@gmail.com",
    documents: [
      { label: "Student Photo" },
      { label: "Birth Certificate" },
      { label: "Previous School TC" },
      { label: "Aadhar Card (Student)" },
      { label: "Parent ID Proof" },
      { label: "Caste / Category Certificate" },
    ],
  },
  {
    id: "in125",
    studentName: "Aarav",
    gender: "Male",
    birthDate: "03-03-2003",
    course: "10th Standard",
    admissionDate: "21-05-2026",
    admissionAmount: "$25000",
    receiptId: "RCPT-125",
    paidAmount: "$25000",
    balanceAmount: "$0",
    paymentMode: "Bank Transfer",
    paymentStatus: "Pending",
    fatherName: "Suresh",
    motherName: "Latha",
    address: "19A, Maple Residency, Chittoor Road, Kochi, Kerala - 682018",
    mobileNumber: "9123456780",
    email: "aarav10@gmail.com",
    documents: [
      { label: "Student Photo" },
      { label: "Birth Certificate" },
      { label: "Previous School TC" },
      { label: "Aadhar Card (Student)" },
      { label: "Parent ID Proof" },
      { label: "Caste / Category Certificate" },
    ],
  },
  {
    id: "in126",
    studentName: "Meera",
    gender: "Female",
    birthDate: "12-12-2002",
    course: "B.com 1st Year",
    admissionDate: "21-05-2026",
    admissionAmount: "$25000",
    receiptId: "RCPT-126",
    paidAmount: "$25000",
    balanceAmount: "$0",
    paymentMode: "Bank Transfer",
    paymentStatus: "Pending",
    fatherName: "Rajesh",
    motherName: "Anitha",
    address: "23, Lotus Towers, Vyttila, Kochi, Kerala - 682019",
    mobileNumber: "9345678901",
    email: "meera.bcom@gmail.com",
    documents: [
      { label: "Student Photo" },
      { label: "Birth Certificate" },
      { label: "Previous School TC" },
      { label: "Aadhar Card (Student)" },
      { label: "Parent ID Proof" },
      { label: "Caste / Category Certificate" },
    ],
  },
  {
    id: "in127",
    studentName: "Anjali",
    gender: "Female",
    birthDate: "05-08-2003",
    course: "B.com 1st Year",
    admissionDate: "21-05-2026",
    admissionAmount: "$25000",
    receiptId: "RCPT-127",
    paidAmount: "$25000",
    balanceAmount: "$0",
    paymentMode: "Bank Transfer",
    paymentStatus: "Failed",
    fatherName: "Vinod",
    motherName: "Geetha",
    address: "14C, Pearl Residency, Fort Kochi, Kochi, Kerala - 682001",
    mobileNumber: "9445678902",
    email: "anjali2003@gmail.com",
    documents: [
      { label: "Student Photo" },
      { label: "Birth Certificate" },
      { label: "Previous School TC" },
      { label: "Aadhar Card (Student)" },
      { label: "Parent ID Proof" },
      { label: "Caste / Category Certificate" },
    ],
  },
];

const courses = ["All Course", "10th Standard", "B.com 1st Year"];
const admissionIds = [
  "All Admission ID",
  "in123",
  "in124",
  "in125",
  "in126",
  "in127",
];

const FinanceAdmissionPanel: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [selectedCourse, setSelectedCourse] = useState("All Course");
  const [selectedAdmissionId, setSelectedAdmissionId] =
    useState("All Admission ID");
  const [selectedAdmission, setSelectedAdmission] =
    useState<AdmissionRow | null>(null);
  const [editingAdmission, setEditingAdmission] = useState<AdmissionRow | null>(
    null,
  );

  const filteredData = useMemo(() => {
    return admissionData.filter((row) => {
      const matchesSearch =
        row.id.toLowerCase().includes(search.toLowerCase()) ||
        row.studentName.toLowerCase().includes(search.toLowerCase());
      const matchesCourse =
        selectedCourse === "All Course" || row.course === selectedCourse;
      const matchesAdmissionId =
        selectedAdmissionId === "All Admission ID" ||
        row.id === selectedAdmissionId;
      return matchesSearch && matchesCourse && matchesAdmissionId;
    });
  }, [search, selectedCourse, selectedAdmissionId]);

  if (selectedAdmission) {
    return (
      <FinanceAdmissionDetail
        admission={selectedAdmission}
        onBack={() => setSelectedAdmission(null)}
      />
    );
  }

  const handleSaveEdit = (updatedAdmission: AdmissionRow) => {
    // In a real app, this would update the backend
    console.log("Saving admission:", updatedAdmission);
    setEditingAdmission(null);
  };

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#1F2937]">
            Students Admission
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3 justify-end">
          <div className="relative w-full sm:w-[260px]">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search id or name..."
              className="h-11 w-full rounded-[10px] border border-[#E5E7EB] bg-white pl-11 pr-4 text-sm text-[#444] outline-none focus:border-[#083b9a]"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6 max-w-[680px]">
        <div className="flex flex-col gap-2 max-w-[320px]">
          <p className="text-sm font-medium text-[#111827]">Admission Date</p>
          <label className="relative flex items-center justify-between rounded-[10px] border border-[#E5E7EB] bg-white px-3 py-3 text-sm text-[#111827] cursor-pointer">
            <span>
              {new Date(selectedDate).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
            <div className="flex items-center gap-2 text-[#6B7280]">
              <CalendarDays size={18} />
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
            />
          </label>
        </div>

        <div className="flex flex-col gap-2 max-w-[320px]">
          <p className="text-sm font-medium text-[#111827]">Select Course</p>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="h-11 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-4 text-sm text-[#111827] outline-none"
          >
            {courses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 max-w-[320px]">
          <p className="text-sm font-medium text-[#111827]">Admission ID</p>
          <select
            value={selectedAdmissionId}
            onChange={(e) => setSelectedAdmissionId(e.target.value)}
            className="h-11 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-4 text-sm text-[#111827] outline-none"
          >
            {admissionIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-0 overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="text-sm uppercase tracking-[0.15em] text-[#6B7280]">
              <th className="px-5 py-4">Adm ID</th>
              <th className="px-5 py-4">Stud Name</th>
              <th className="px-5 py-4">Course & Std</th>
              <th className="px-5 py-4">Adm Date</th>
              <th className="px-5 py-4">Adm Amount</th>
              <th className="px-5 py-4">Paid Amount</th>
              <th className="px-5 py-4">Payment Mode</th>
              <th className="px-5 py-4">Payment Status</th>
              <th className="px-5 py-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((row) => (
              <tr
                key={row.id}
                className="border-t border-[#F1F5F9] hover:bg-[#F9FAFB]"
              >
                <td className="px-5 py-4 text-sm font-medium text-[#111827]">
                  {row.id}
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">
                  {row.studentName}
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">
                  {row.course}
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">
                  {row.admissionDate}
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">
                  {row.admissionAmount}
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">
                  {row.paidAmount}
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">
                  {row.paymentMode}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge
                    label={row.paymentStatus}
                    variant={
                      row.paymentStatus === "Paid"
                        ? "paid"
                        : row.paymentStatus === "Pending"
                          ? "pending"
                          : "failed"
                    }
                  />
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedAdmission(row)}
                      className="rounded-[10px] p-2 text-[#0F6FFF] hover:bg-[#ECF4FF]"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => setEditingAdmission(row)}
                      className="rounded-[10px] p-2 text-[#0F6FFF] hover:bg-[#ECF4FF]"
                    >
                      <Edit3 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-[#6B7280]">
        <span>
          Showing {filteredData.length} of {admissionData.length} Students
        </span>
        <div className="flex items-center gap-2 rounded-[10px] border border-[#E5E7EB] bg-white px-3 py-2">
          <button className="rounded-[10px] px-3 py-1 text-sm text-[#6B7280] hover:bg-[#F8F8F8]">
            Previous
          </button>
          <button className="rounded-[10px] bg-[#083b9a] px-3 py-1 text-sm font-semibold text-white">
            1
          </button>
          <button className="rounded-[10px] px-3 py-1 text-sm text-[#6B7280] hover:bg-[#F8F8F8]">
            2
          </button>
          <button className="rounded-[10px] px-3 py-1 text-sm text-[#6B7280] hover:bg-[#F8F8F8]">
            3
          </button>
          <button className="rounded-[10px] px-3 py-1 text-sm text-[#6B7280] hover:bg-[#F8F8F8]">
            Next
          </button>
        </div>
      </div>
      {editingAdmission && (
        <EditAdmissionModal
          admission={editingAdmission}
          onClose={() => setEditingAdmission(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export { FinanceAdmissionPanel };
export default FinanceAdmissionPanel;
