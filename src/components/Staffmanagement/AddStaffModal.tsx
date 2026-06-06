import { useEffect, useState } from "react";
import {
  X,
  Calendar,
  Download,
  ChevronDown,
} from "lucide-react";

export type AddStaffFormData = {
  // Personal
  teacherName: string;
  phoneNumber: string;
  email: string;
  gender: string;
  dob: string;
  photo: File | null;
  address: string;
  // Professional
  qualification: string;
  experienceYear: string;
  specialization: string;
  courseExpertise: string;
  joiningDate: string;
  employmentType: string;
  department: string;
  // Salary
  salaryType: string;
  monthlySalary: string;
  bankAccountNumber: string;
  bankName: string;
  ifscCode: string;
  payrollApplicable: boolean;
  // Login
  role: string;
  staffId: string;
  temporaryPassword: string;
};

const initialForm: AddStaffFormData = {
  teacherName: "",
  phoneNumber: "",
  email: "",
  gender: "",
  dob: "",
  photo: null,
  address: "",
  qualification: "",
  experienceYear: "",
  specialization: "",
  courseExpertise: "",
  joiningDate: "",
  employmentType: "",
  department: "",
  salaryType: "",
  monthlySalary: "",
  bankAccountNumber: "",
  bankName: "",
  ifscCode: "",
  payrollApplicable: false,
  role: "",
  staffId: "",
  temporaryPassword: "",
};

/* ─── Permissions config ─── */
const PERMISSIONS = [
  "Dashboard",
  "Attendance",
  "Academic Management",
  "Student Management",
  "Staff Management",
  "Finance",
] as const;

type Permission = (typeof PERMISSIONS)[number];
type PermState = { enable: boolean; disable: boolean };
type PermissionsMap = Record<Permission, PermState>;

const initialPermissions: PermissionsMap = {
  Dashboard:           { enable: true,  disable: false },
  Attendance:          { enable: false, disable: false },
  "Academic Management": { enable: true,  disable: false },
  "Student Management":  { enable: false, disable: false },
  "Staff Management":    { enable: false, disable: true  },
  Finance:             { enable: false, disable: false },
};

interface Props {
  onClose?: () => void;
  onSave?: (form: AddStaffFormData) => void;
}

/* ─── Shared field styles ─── */
const inputCls =
  "w-full h-11 px-3 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg outline-none placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition";

const selectCls =
  "w-full h-11 px-3 pr-8 text-sm text-gray-400 bg-white border border-gray-200 rounded-lg outline-none appearance-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition cursor-pointer";

const labelCls = "block text-xs font-medium text-gray-600 mb-1";

/* ─── Reusable wrappers ─── */
const SelectField = ({
  label,
  name,
  value,
  placeholder,
  options,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <div>
    <label className={labelCls}>
      {label}
      <span className="text-red-500">*</span>
    </label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={selectCls + (value ? " text-gray-800" : "")}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  </div>
);

const InputField = ({
  label,
  name,
  value,
  placeholder,
  type = "text",
  required = true,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div>
    <label className={labelCls}>
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className={inputCls}
    />
  </div>
);

/* ─── Section heading ─── */
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-sm font-semibold text-gray-800 mb-3 mt-1">{children}</h3>
);

/* ─── Divider ─── */
const Divider = () => <hr className="border-gray-100 my-4" />;

export default function AddStaffModal({ onClose, onSave }: Props) {
  const [form, setForm] = useState<AddStaffFormData>(initialForm);
  const [photoName, setPhotoName] = useState("Choose Files");
  const [permissions, setPermissions] = useState<PermissionsMap>(initialPermissions);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, photo: file }));
    setPhotoName(file ? file.name : "Choose Files");
  };

  const handleToggle = () =>
    setForm((prev) => ({ ...prev, payrollApplicable: !prev.payrollApplicable }));

  const handlePermission = (
    perm: Permission,
    col: "enable" | "disable"
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [perm]: {
        enable:  col === "enable"  ? !prev[perm].enable  : prev[perm].enable,
        disable: col === "disable" ? !prev[perm].disable : prev[perm].disable,
      },
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setPhotoName("Choose Files");
    setPermissions(initialPermissions);
  };

  const handleSave = (closeAfterSave: boolean) => {
    onSave?.(form);

    if (closeAfterSave) {
      onClose?.();
      return;
    }

    resetForm();
  };

  return (
    /* ── Backdrop ── */
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 backdrop-blur-[2px] overflow-hidden py-6 px-3">
      {/* ── Modal card ── */}
      <div
        className="relative flex max-h-[calc(100vh-48px)] w-full flex-col bg-white rounded-[10px] shadow-2xl
          max-w-[819px]
          2xl:max-w-[900px]
          lg:max-w-[780px]
          sm:max-w-[95vw]
        "
        style={{ minHeight: "min(600px, calc(100vh - 48px))" }}
      >
        {/* ── Header ── */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Add New Staff Member
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Enter the details of the new staff member. All fields marked
                with * are required.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition mt-0.5"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">

          {/* ────────────────────────────────
              PERSONAL INFORMATION
          ──────────────────────────────── */}
          <SectionTitle>Personal Information</SectionTitle>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">

            {/* Teacher Name */}
            <InputField
              label="Teacher Name"
              name="teacherName"
              value={form.teacherName}
              placeholder="Name"
              onChange={handleChange}
            />

            {/* Phone Number */}
            <InputField
              label="Phone Number"
              name="phoneNumber"
              value={form.phoneNumber}
              placeholder="+91234567895555"
              type="tel"
              onChange={handleChange}
            />

            {/* Email */}
            <InputField
              label="Email"
              name="email"
              value={form.email}
              placeholder="Enter email"
              type="email"
              onChange={handleChange}
            />

            {/* Gender */}
            <SelectField
              label="Gender"
              name="gender"
              value={form.gender}
              placeholder="Select gender"
              options={["Male", "Female", "Other"]}
              onChange={handleChange}
            />

            {/* DOB */}
            <div>
              <label className={labelCls}>
                DOB<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  className={inputCls + " pr-10 text-gray-400 [&:not([value=''])]:text-gray-800"}
                  placeholder="23 May, 2026"
                />
                <Calendar
                  size={15}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Photo */}
            <div>
              <label className={labelCls}>
                Photo<span className="text-red-500">*</span>
              </label>
              <label className="flex items-center justify-between w-full h-11 px-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition">
                <span className="text-sm text-gray-400 truncate max-w-[80%]">
                  {photoName}
                </span>
                <Download size={15} className="text-gray-400 shrink-0" />
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Address — full width */}
            <div className="sm:col-span-2">
              <label className={labelCls}>
                Address<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                placeholder="Address"
                onChange={handleChange}
                className={inputCls}
              />
            </div>
          </div>

          <Divider />

          {/* ────────────────────────────────
              PROFESSIONAL INFORMATION
          ──────────────────────────────── */}
          <SectionTitle>Professional Information</SectionTitle>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">

            {/* Qualification */}
            <InputField
              label="Qualification"
              name="qualification"
              value={form.qualification}
              placeholder="eg: Ph-D"
              onChange={handleChange}
            />

            {/* Experience Year */}
            <InputField
              label="Experience year"
              name="experienceYear"
              value={form.experienceYear}
              placeholder="6 years"
              onChange={handleChange}
            />

            {/* Specialization */}
            <SelectField
              label="Specialization"
              name="specialization"
              value={form.specialization}
              placeholder="Select type"
              options={["Science", "Mathematics", "Arts", "Commerce", "Languages"]}
              onChange={handleChange}
            />

            {/* Course/Subject Expertise */}
            <SelectField
              label="Course/Subject Expertise"
              name="courseExpertise"
              value={form.courseExpertise}
              placeholder="Select subject"
              options={["Physics", "Chemistry", "Biology", "History", "English"]}
              onChange={handleChange}
            />

            {/* Joining Date */}
            <div>
              <label className={labelCls}>
                Joining date<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="joiningDate"
                  value={form.joiningDate}
                  onChange={handleChange}
                  className={inputCls + " pr-10"}
                />
                <Calendar
                  size={15}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Employment Type */}
            <SelectField
              label="Employment type"
              name="employmentType"
              value={form.employmentType}
              placeholder="Select type"
              options={["Full-time", "Part-time", "Contract", "Intern"]}
              onChange={handleChange}
            />

            {/* Department — full width */}
            <div className="sm:col-span-2">
              <label className={labelCls}>
                Department<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className={selectCls + (form.department ? " text-gray-800" : "")}
                >
                  <option value="" disabled hidden>
                    select department
                  </option>
                  {["Primary", "Secondary", "Higher Secondary", "Admin", "Sports"].map(
                    (d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    )
                  )}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          <Divider />

          {/* ────────────────────────────────
              SALARY DETAILS
          ──────────────────────────────── */}
          <SectionTitle>Salary Details</SectionTitle>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">

            {/* Salary Type */}
            <SelectField
              label="Salary type"
              name="salaryType"
              value={form.salaryType}
              placeholder="salary type"
              options={["Monthly", "Hourly", "Daily"]}
              onChange={handleChange}
            />

            {/* Monthly Salary */}
            <InputField
              label="Monthly salary/Hourly rate"
              name="monthlySalary"
              value={form.monthlySalary}
              placeholder="Enter amount"
              onChange={handleChange}
            />

            {/* Bank Account Number */}
            <InputField
              label="Bank account number"
              name="bankAccountNumber"
              value={form.bankAccountNumber}
              placeholder="Enter number"
              onChange={handleChange}
            />

            {/* Bank Name */}
            <InputField
              label="Bank name"
              name="bankName"
              value={form.bankName}
              placeholder="Enter bank name"
              onChange={handleChange}
            />

            {/* IFSC Code */}
            <div>
              <label className={labelCls}>
                IFSC code<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="ifscCode"
                  value={form.ifscCode}
                  onChange={handleChange}
                  className={selectCls + (form.ifscCode ? " text-gray-800" : "")}
                >
                  <option value="" disabled hidden>
                    Enter Code
                  </option>
                  {["SBIN0001234", "HDFC0002345", "ICIC0003456", "AXIS0004567"].map(
                    (c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    )
                  )}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Payroll Applicable toggle */}
            <div className="flex items-center gap-3 pt-5">
              <button
                type="button"
                onClick={handleToggle}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                  form.payrollApplicable ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                    form.payrollApplicable ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
              <span className="text-sm text-gray-700">Payroll Applicable</span>
            </div>
          </div>

          <Divider />

          {/* ────────────────────────────────
              LOGIN ACCESS
          ──────────────────────────────── */}
          <SectionTitle>Login Access</SectionTitle>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 items-start">

            {/* ── LEFT COLUMN: Role + Temporary Password ── */}
            <div className="flex flex-col gap-4">

              {/* Role — custom dropdown to match screenshot */}
              <div>
                <label className={labelCls}>
                  Role<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className={selectCls + (form.role ? " text-gray-800" : "")}
                    size={1}
                  >
                    <option value="" disabled hidden>Select Role</option>
                    <option value="Administration staff">Administration staff</option>
                    <option value="Non-administration staff">Non-administration staff</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* Temporary Password */}
              <div>
                <label className={labelCls}>
                  Temporary password<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="temporaryPassword"
                    value={form.temporaryPassword}
                    onChange={handleChange}
                    className={selectCls + (form.temporaryPassword ? " text-gray-800" : "")}
                  >
                    <option value="" disabled hidden>Enter Code</option>
                    {["Auto Generate", "Custom"].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN: Staff id + All Permissions table ── */}
            <div className="flex flex-col gap-4">

              {/* Staff ID */}
              <div>
                <label className={labelCls}>
                  Staff id<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="staffId"
                  value={form.staffId}
                  placeholder="Enter name"
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>

              {/* All Permissions table */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-[1fr_64px_64px] bg-white">
                  <div className="px-4 py-2.5 text-xs font-semibold text-gray-700 border-b border-gray-200">
                    All Permissions
                  </div>
                  <div className="py-2.5 text-xs font-semibold text-gray-700 text-center border-b border-gray-200">
                    Enable
                  </div>
                  <div className="py-2.5 text-xs font-semibold text-gray-700 text-center border-b border-gray-200">
                    Disable
                  </div>
                </div>

                {/* Permission rows */}
                {PERMISSIONS.map((perm, idx) => (
                  <div
                    key={perm}
                    className={`grid grid-cols-[1fr_64px_64px] items-center ${
                      idx !== PERMISSIONS.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    <span className="px-4 py-3 text-sm text-gray-700">{perm}</span>

                    {/* Enable checkbox */}
                    <div className="flex items-center justify-center py-3">
                      <button
                        type="button"
                        onClick={() => handlePermission(perm, "enable")}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                          permissions[perm].enable
                            ? "border-blue-500 bg-white"
                            : "border-gray-300 bg-white hover:border-gray-400"
                        }`}
                      >
                        {permissions[perm].enable && (
                          <svg
                            viewBox="0 0 12 12"
                            className="w-3 h-3 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="1.5,6 4.5,9.5 10.5,2.5" />
                          </svg>
                        )}
                      </button>
                    </div>

                    {/* Disable checkbox */}
                    <div className="flex items-center justify-center py-3">
                      <button
                        type="button"
                        onClick={() => handlePermission(perm, "disable")}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                          permissions[perm].disable
                            ? "border-blue-500 bg-white"
                            : "border-gray-300 bg-white hover:border-gray-400"
                        }`}
                      >
                        {permissions[perm].disable && (
                          <svg
                            viewBox="0 0 12 12"
                            className="w-3 h-3 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="1.5,6 4.5,9.5 10.5,2.5" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSave(false)}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Save &amp; Add Another
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Save Teacher
          </button>
        </div>
      </div>
    </div>
  );
}
