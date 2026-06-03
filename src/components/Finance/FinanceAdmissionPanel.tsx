import React, { useMemo, useState } from "react";
import { Search, CalendarDays, Eye, Edit3, Trash2 } from "lucide-react";
import FinanceAdmissionDetail from "./FinanceAdmissionDetail";
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
  const selectedDate = "23 May, 2026";
  const [selectedCourse, setSelectedCourse] = useState("All Course");
  const [selectedAdmissionId, setSelectedAdmissionId] =
    useState("All Admission ID");
  const [selectAll, setSelectAll] = useState(false);
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
    <div className="mt-10 rounded-[32px] bg-white p-6 shadow-sm">
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#1F2937]">
            Students Admission
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
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
              className="h-11 w-full rounded-full border border-[#E5E7EB] bg-[#F8F8F8] pl-11 pr-4 text-sm text-[#444] outline-none focus:border-[#083b9a]"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-2 text-sm font-medium text-[#444]">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={() => setSelectAll((prev) => !prev)}
                className="h-4 w-4 rounded border-gray-300 text-[#083b9a]"
              />
              Select all
            </label>
            <button className="inline-flex items-center gap-2 rounded-full border border-[#F74D57] bg-[#FFF5F7] px-4 py-2 text-sm font-semibold text-[#F74D57] hover:bg-[#FFE6EB]">
              <Trash2 size={16} />
              Delete all
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8F8F8] p-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#6B7280]">
            Admission Date
          </p>
          <div className="mt-3 flex items-center justify-between rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#111827]">
            <span>{selectedDate}</span>
            <CalendarDays size={18} className="text-[#6B7280]" />
          </div>
        </div>

        <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8F8F8] p-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#6B7280]">
            Select Course
          </p>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="mt-3 h-12 w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 text-sm text-[#111827] outline-none"
          >
            {courses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8F8F8] p-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#6B7280]">
            Admission ID
          </p>
          <select
            value={selectedAdmissionId}
            onChange={(e) => setSelectedAdmissionId(e.target.value)}
            className="mt-3 h-12 w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 text-sm text-[#111827] outline-none"
          >
            {admissionIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[28px] border border-[#E5E7EB] bg-white p-1">
        <table className="min-w-[1024px] w-full border-collapse text-left">
          <thead>
            <tr className="text-sm uppercase tracking-[0.15em] text-[#6B7280]">
              <th className="px-5 py-4">Admission ID</th>
              <th className="px-5 py-4">Student Name</th>
              <th className="px-5 py-4">Course & Standard</th>
              <th className="px-5 py-4">Admission Date</th>
              <th className="px-5 py-4">Admission Amount</th>
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
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      row.paymentStatus === "Paid"
                        ? "bg-emerald-100 text-emerald-700"
                        : row.paymentStatus === "Pending"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {row.paymentStatus}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedAdmission(row)}
                      className="rounded-full p-2 text-[#0F6FFF] hover:bg-[#ECF4FF]"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => setEditingAdmission(row)}
                      className="rounded-full p-2 text-[#0F6FFF] hover:bg-[#ECF4FF]"
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

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-[#6B7280]">
        <span>
          Showing {filteredData.length} of {admissionData.length} Students
        </span>
        <div className="flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-3 py-2">
          <button className="rounded-full px-3 py-1 text-sm text-[#6B7280] hover:bg-[#F8F8F8]">
            Previous
          </button>
          <button className="rounded-full bg-[#083b9a] px-3 py-1 text-sm font-semibold text-white">
            1
          </button>
          <button className="rounded-full px-3 py-1 text-sm text-[#6B7280] hover:bg-[#F8F8F8]">
            2
          </button>
          <button className="rounded-full px-3 py-1 text-sm text-[#6B7280] hover:bg-[#F8F8F8]">
            3
          </button>
          <button className="rounded-full px-3 py-1 text-sm text-[#6B7280] hover:bg-[#F8F8F8]">
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
