import React, { useMemo, useState, useEffect } from "react";
import { Search, CalendarDays, Eye, Edit3 } from "lucide-react";
import FinanceAdmissionDetail from "./FinanceAdmissionDetail";
import StatusBadge from "./StatusBadge";
import EditAdmissionModal from "./EditAdmissionModal";
import { getClasses } from "../../services/classApi";
import { getAdmissionById } from "../../api/finance";

interface AdmissionRow {
  id: string;
  studentName: string;
  gender: string;
  birthDate: string;
  course: string;
  class_id?: string;
  section?: string;
  internalId?: string;
  admissionDate: string;
  admissionAmount: string;
  courseFee: string;
  discountAmount: string;
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
    courseFee: "$25000",
    discountAmount: "$0",
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
    courseFee: "$25000",
    discountAmount: "$0",
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
    courseFee: "$25000",
    discountAmount: "$0",
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
    courseFee: "$25000",
    discountAmount: "$0",
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
    courseFee: "$25000",
    discountAmount: "$0",
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

interface FinanceAdmissionPanelProps {
  admissions?: AdmissionRow[];
  admissionCount?: number;
  currentPage?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  onPageChange?: (page: number) => void;
  loading?: boolean;
}

const FinanceAdmissionPanel: React.FC<FinanceAdmissionPanelProps> = ({
  admissions = [],
  admissionCount = 0,
  currentPage = 1,
  hasNextPage = false,
  hasPreviousPage = false,
  onPageChange,
  loading = false,
}) => {
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState("All Course");
  const [selectedAdmissionId, setSelectedAdmissionId] =
    useState("All Admission ID");
  const [selectedAdmission, setSelectedAdmission] =
    useState<AdmissionRow | null>(null);
  const [editingAdmission, setEditingAdmission] = useState<AdmissionRow | null>(
    null,
  );
  const [viewLoading, setViewLoading] = useState(false);
  const [classOptions, setClassOptions] = useState<
    {
      id: number;
      class_id: string;
      class_name: string;
      class_section: string;
      class_batch: string;
    }[]
  >([]);

  const admissionIds = useMemo(() => {
    const ids = Array.from(
      new Set(admissions?.map((a) => a.id).filter(Boolean)),
    );
    return ["All Admission ID", ...ids];
  }, [admissions]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const classes = await getClasses();
        if (!mounted) return;
        setClassOptions([
          {
            id: 0,
            class_id: "",
            class_name: "All Course",
            class_section: "",
            class_batch: "",
          },
          ...classes,
        ]);
      } catch (error) {
        console.error("Failed to load class options", error);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredData = useMemo(() => {
    const normalizeCourse = (value: string) =>
      value.trim().toLowerCase().replace(/\s+/g, " ");

    const selectedNormalized = normalizeCourse(selectedCourse);

    const normalizeToISODate = (value: string | undefined) => {
      if (!value) return "";
      // Try native Date parsing
      const d = new Date(value);
      if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
      // Try DD-MM-YYYY
      const m = value.match(/^(\d{2})-(\d{2})-(\d{4})$/);
      if (m) return `${m[3]}-${m[2]}-${m[1]}`;
      return "";
    };

    return admissions.filter((row) => {
      const matchesSearch =
        row.id.toLowerCase().includes(search.toLowerCase()) ||
        row.studentName.toLowerCase().includes(search.toLowerCase());

      const rowCourse = row.course ?? "";
      const rowNormalized = normalizeCourse(rowCourse);

      let matchesCourse = false;
      if (selectedCourse === "All Course") {
        matchesCourse = true;
      } else if (rowNormalized === selectedNormalized) {
        matchesCourse = true;
      } else if (
        selectedNormalized.includes(" - ") &&
        !rowNormalized.includes(" - ")
      ) {
        matchesCourse = rowNormalized === selectedNormalized.split(" - ")[0];
      } else if (
        selectedNormalized.includes(" - ") &&
        rowNormalized.includes(" - ")
      ) {
        matchesCourse = rowNormalized === selectedNormalized;
      }

      const rowISODate = normalizeToISODate(row.admissionDate);
      const matchesDate =
        !selectedDate || selectedDate === "" || rowISODate === selectedDate;

      const matchesAdmissionId =
        selectedAdmissionId === "All Admission ID" ||
        String(row.id) === String(selectedAdmissionId);

      return (
        matchesSearch && matchesCourse && matchesAdmissionId && matchesDate
      );
    });
  }, [admissions, search, selectedCourse, selectedAdmissionId, selectedDate]);

  if (loading) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-sm">
        <p className="text-gray-600">Loading admissions...</p>
      </div>
    );
  }

  if (selectedAdmission) {
    return (
      <FinanceAdmissionDetail
        admission={selectedAdmission}
        onBack={() => setSelectedAdmission(null)}
      />
    );
  }

  const handleSaveEdit = (updatedAdmission: {
    id: string;
    student_name: string;
    gender: string;
    birth_date: string;
    course: string;
    admission_date: string;
    admission_amount: string;
    course_fee: string;
    discount_amount: string;
    admission_id: string;
    paid_amount: string;
    balance_amount: string;
    payment_mode: string;
    payment_status: string;
    father_name: string;
    mother_name: string;
    address: string;
    mobile_number: string;
    email: string;
    documents: { label: string }[];
  }) => {
    const mappedAdmission: AdmissionRow = {
      id: updatedAdmission.id,
      studentName: updatedAdmission.student_name,
      gender: updatedAdmission.gender,
      birthDate: updatedAdmission.birth_date,
      course: updatedAdmission.course,
      admissionDate: updatedAdmission.admission_date,
      admissionAmount: updatedAdmission.admission_amount,
      courseFee: updatedAdmission.course_fee,
      discountAmount: updatedAdmission.discount_amount,
      receiptId: updatedAdmission.admission_id,
      paidAmount: updatedAdmission.paid_amount,
      balanceAmount: updatedAdmission.balance_amount,
      paymentMode: updatedAdmission.payment_mode,
      paymentStatus: updatedAdmission.payment_status as
        | "Paid"
        | "Pending"
        | "Failed",
      fatherName: updatedAdmission.father_name,
      motherName: updatedAdmission.mother_name,
      address: updatedAdmission.address,
      mobileNumber: updatedAdmission.mobile_number,
      email: updatedAdmission.email,
      documents: updatedAdmission.documents,
    };

    console.log("Saving admission:", mappedAdmission);
    setEditingAdmission(null);
  };

  const handleView = async (admissionId: string) => {
    setViewLoading(true);
    try {
      console.log(
        "[FinanceAdmissionPanel] requesting admission detail for id:",
        admissionId,
      );
      const data = await getAdmissionById(admissionId);
      console.log("[FinanceAdmissionPanel] getAdmissionById response:", data);

      const courseName = data.class_name ?? data.course ?? "";
      const section = data.class_section ?? data.section ?? "";
      const courseLabel = section ? `${courseName} - ${section}` : courseName;

      const mapped: AdmissionRow = {
        id: data.admission_id ? String(data.admission_id) : String(data.id),
        studentName: data.student_name ?? "",
        gender: data.gender ?? "",
        birthDate: data.admission_date ?? "",
        course: courseLabel,
        class_id: data.class_id ?? data.course_id ?? undefined,
        section: section || undefined,
        admissionDate: data.admission_date ?? "",
        admissionAmount: data.admission_amount ?? "",
        courseFee: data.course_fee ?? "",
        discountAmount: data.discount_amount ?? "",
        receiptId: data.admission_id ?? String(data.id),
        paidAmount: data.paid_amount ?? "",
        balanceAmount: data.balance_amount ?? "",
        paymentMode: data.payment_mode ?? "",
        paymentStatus: data.payment_status ?? "Pending",
        fatherName: data.father_name ?? "",
        motherName: data.mother_name ?? "",
        address: data.address ?? "",
        mobileNumber: data.mobile_number ?? "",
        email: data.email ?? "",
        documents: data.documents ?? [],
      };

      setSelectedAdmission(mapped);
    } catch (err) {
      console.error("Failed to fetch admission detail", err);
    } finally {
      setViewLoading(false);
    }
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
              {selectedDate
                ? new Date(selectedDate).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "Select date"}
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
            {classOptions.map((course) => {
              const courseLabel = course.class_section
                ? `${course.class_name} - ${course.class_section}`
                : course.class_name;

              return (
                <option
                  key={`${course.id}-${course.class_section}`}
                  value={courseLabel}
                >
                  {courseLabel}
                </option>
              );
            })}
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
              <th className="px-5 py-4">Course Fee</th>
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
                  {row.courseFee}
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
                      onClick={() => handleView(row.internalId ?? row.id)}
                      className="rounded-[10px] p-2 text-[#0F6FFF] hover:bg-[#ECF4FF]"
                      disabled={viewLoading}
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
          Showing {filteredData.length} of {admissionCount} Students
        </span>
        <div className="flex items-center gap-2 rounded-[10px] border border-[#E5E7EB] bg-white px-3 py-2">
          <button
            disabled={!hasPreviousPage || !onPageChange}
            onClick={() => onPageChange?.(Math.max(currentPage - 1, 1))}
            className={`rounded-[10px] px-3 py-1 text-sm ${
              !hasPreviousPage
                ? "text-[#9CA3AF]"
                : "text-[#6B7280] hover:bg-[#F8F8F8]"
            }`}
          >
            Previous
          </button>
          <button className="rounded-[10px] bg-[#083b9a] px-3 py-1 text-sm font-semibold text-white">
            {currentPage}
          </button>
          <button
            disabled={!hasNextPage || !onPageChange}
            onClick={() => onPageChange?.(currentPage + 1)}
            className={`rounded-[10px] px-3 py-1 text-sm ${
              !hasNextPage
                ? "text-[#9CA3AF]"
                : "text-[#6B7280] hover:bg-[#F8F8F8]"
            }`}
          >
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
