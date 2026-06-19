import { useEffect, useState } from "react";
import {
  X,
  Calendar,
  Download,
  ChevronDown,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../api/axios";

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
  designation: string;        // e.g. "Teacher", "Office Staff"
  employmentType: string;
  department: string;
  reportingAdmin: string;
  // Salary
  salaryType: string;
  monthlySalary: string;
  bankAccountNumber: string;
  bankName: string;
  ifscCode: string;
  // Login
  role: string;               // "Administration staff" | "Non-administration staff"
  staffId: string;            // user_id sent to backend
  temporaryPassword: string;  // actual password string
  permissions?: string[];
};

const initialForm_default: AddStaffFormData = {
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
  designation: "",
  employmentType: "",
  department: "",
  reportingAdmin: "",
  salaryType: "",
  monthlySalary: "",
  bankAccountNumber: "",
  bankName: "",
  ifscCode: "",
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
  Attendance:          { enable: false, disable: true  },
  "Academic Management": { enable: true,  disable: false },
  "Student Management":  { enable: false, disable: true  },
  "Staff Management":    { enable: false, disable: true  },
  Finance:             { enable: false, disable: true  },
};

interface Props {
  onClose?: () => void;
  onSave?: (form: AddStaffFormData) => void;
  initialForm?: Partial<AddStaffFormData>;
  isEdit?: boolean;
  dbId?: number | null;
  /** true when the Teaching Staff tab is active; false for Non-Teaching */
  isTeacher?: boolean;
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
  error,
}: {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
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
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
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
  error,
}: {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
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
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

/* ─── Section heading ─── */
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-sm font-semibold text-gray-800 mb-3 mt-1">{children}</h3>
);

/* ─── Divider ─── */
const Divider = () => <hr className="border-gray-100 my-4" />;

export default function AddStaffModal({
  onClose,
  onSave,
  initialForm,
  isEdit = false,
  dbId = null,
  isTeacher = true,
}: Props) {
  const [form, setForm] = useState<AddStaffFormData>({
    ...initialForm_default,
    ...(initialForm ?? {}),
  });
  const [photoName, setPhotoName] = useState("Choose Files");
  const [permissions, setPermissions] = useState<PermissionsMap>(() => {
    if (isEdit || initialForm?.permissions) {
      const map = {} as PermissionsMap;
      PERMISSIONS.forEach((p) => {
        map[p] = { enable: false, disable: true };
      });
      if (initialForm?.permissions) {
        initialForm.permissions.forEach((permStr: string) => {
          const matched = PERMISSIONS.find(
            (p) => p.toUpperCase().replace(/ /g, "_") === permStr.toUpperCase()
          );
          if (matched) {
            map[matched] = { enable: true, disable: false };
          }
        });
      }
      return map;
    }
    return initialPermissions;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialForm) {
      setForm({
        ...initialForm_default,
        ...initialForm,
      });
      if (isEdit || initialForm.permissions) {
        const map = {} as PermissionsMap;
        PERMISSIONS.forEach((p) => {
          map[p] = { enable: false, disable: true };
        });
        if (initialForm.permissions) {
          initialForm.permissions.forEach((permStr: string) => {
            const matched = PERMISSIONS.find(
              (p) => p.toUpperCase().replace(/ /g, "_") === permStr.toUpperCase()
            );
            if (matched) {
              map[matched] = { enable: true, disable: false };
            }
          });
        }
        setPermissions(map);
      }
    } else {
      setForm(initialForm_default);
      setPermissions(initialPermissions);
    }
  }, [initialForm]);

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
    // clear field-specific error on change
    if (typeof value === "string" && value.trim() !== "") {
      setErrors((p) => ({ ...p, [name]: "" }));
    }
  };

  const validateField = (name: string, value: any) => {
    let err = "";
    if (name === "email") {
      // simple email regex
      const re = /^\S+@\S+\.\S+$/;
      if (!re.test(String(value || ""))) err = "Email not valid";
    }

    if (name === "phoneNumber") {
      const digits = String(value || "").replace(/\D/g, "");
      if (digits.length !== 10) err = "Number not valid";
    }

    setErrors((prev) => ({ ...prev, [name]: err }));
    return err === "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, photo: file }));
    setPhotoName(file ? file.name : "Choose Files");
    // validate photo presence
    if (!file) setErrors((p) => ({ ...p, photo: "Photo is required" }));
    else setErrors((p) => ({ ...p, photo: "" }));
  };


  const handlePermission = (
    perm: Permission,
    col: "enable" | "disable"
  ) => {
    setPermissions((prev) => {
      const newEnable = col === "enable" ? !prev[perm].enable : prev[perm].enable;
      const newDisable = col === "disable" ? !prev[perm].disable : prev[perm].disable;
      return {
        ...prev,
        [perm]: {
          enable: col === "enable" ? newEnable : !newDisable,
          disable: col === "disable" ? newDisable : !newEnable,
        },
      };
    });
  };

  const resetForm = () => {
    setForm({
      ...initialForm_default,
    });
    setPhotoName("Choose Files");
    setPermissions(initialPermissions);
    setErrors({});
  };

  const isFormComplete = () => {
    // Require all string fields to be non-empty; photo is optional
    for (const key of Object.keys(form) as (keyof AddStaffFormData)[]) {
      const val = form[key];
      if (key === "photo") continue; // photo is optional
      if (isEdit && key === "temporaryPassword") continue; // password is optional on edit
      if (typeof val === "string" && val.trim() === "") return false;
    }
    // Ensure no active validation errors
    for (const k of Object.keys(errors)) {
      if (errors[k]) return false;
    }
    return true;
  };

  const handleSave = async (closeAfterSave: boolean) => {
  if (isEdit) {
    if (form.email !== (initialForm?.email ?? "")) {
      const emailOk = validateField("email", form.email);
      if (!emailOk) {
        toast.error("Please enter a valid email.");
        return;
      }
    }
    if (form.phoneNumber !== (initialForm?.phoneNumber ?? "")) {
      const phoneOk = validateField("phoneNumber", form.phoneNumber);
      if (!phoneOk) {
        toast.error("Please enter a valid phone number.");
        return;
      }
    }
  } else {
    const emailOk = validateField("email", form.email);
    const phoneOk = validateField("phoneNumber", form.phoneNumber);

    if (!emailOk || !phoneOk || !isFormComplete()) {
      toast.error("Please fill all the fields.");
      return;
    }
  }

  try {
    setIsSubmitting(true);

    // ✅ Build permissions array from the enable toggles
    const enabledPermissions = (Object.keys(permissions) as Permission[])
      .filter((p) => permissions[p].enable)
      .map((p) => p.toUpperCase().replace(/ /g, "_"));

    // ✅ Build JSON payload matching the backend spec exactly
    const payload = {
      // Login / identity
      role:               form.role,
      user_id:            form.staffId,
      temporary_password: form.temporaryPassword,
      permissions:        enabledPermissions,

      // Personal
      staff_name:   form.teacherName,
      email:        form.email,
      phone_number: form.phoneNumber,
      gender:       form.gender,
      dob:          form.dob,
      address:      form.address,

      // Professional
      qualification:     form.qualification,
      experience_year:   Number(form.experienceYear),
      specialization:    form.specialization,
      subject_expertise: form.courseExpertise,
      joining_date:      form.joiningDate,
      designation:       form.designation,
      employment_type:   form.employmentType,
      department:        form.department,
      reporting_admin:   form.reportingAdmin,

      // Salary
      salary_type:    form.salaryType,
      monthly_salary: Number(form.monthlySalary),
      bank_account:   form.bankAccountNumber,
      bank_name:      form.bankName,
      ifsc_code:      form.ifscCode,

      // is_teacher is driven by the active tab in the parent page
      is_teacher: isTeacher,
    };

    // 🔍 Log the exact payload so you can verify field values in console
    console.log("📤 staff-create payload:", JSON.stringify(payload, null, 2));

    // ✅ If photo is attached use multipart FormData, else send JSON
    let response;
    if (isEdit) {
      // PATCH request
      const patchPayload: any = {};

      if (form.teacherName !== (initialForm?.teacherName ?? "")) {
        patchPayload.staff_name = form.teacherName;
      }
      if (form.email !== (initialForm?.email ?? "")) {
        patchPayload.email = form.email;
      }
      if (form.phoneNumber !== (initialForm?.phoneNumber ?? "")) {
        patchPayload.phone_number = form.phoneNumber;
      }
      if (form.gender !== (initialForm?.gender ?? "")) {
        patchPayload.gender = form.gender;
      }
      if (form.dob !== (initialForm?.dob ?? "")) {
        patchPayload.dob = form.dob;
      }
      if (form.address !== (initialForm?.address ?? "")) {
        patchPayload.address = form.address;
      }
      if (form.qualification !== (initialForm?.qualification ?? "")) {
        patchPayload.qualification = form.qualification;
      }
      if (form.experienceYear !== (initialForm?.experienceYear ?? "")) {
        patchPayload.experience_year = Number(form.experienceYear);
      }
      if (form.specialization !== (initialForm?.specialization ?? "")) {
        patchPayload.specialization = form.specialization;
      }
      if (form.courseExpertise !== (initialForm?.courseExpertise ?? "")) {
        patchPayload.subject_expertise = form.courseExpertise;
      }
      if (form.joiningDate !== (initialForm?.joiningDate ?? "")) {
        patchPayload.joining_date = form.joiningDate;
      }
      if (form.designation !== (initialForm?.designation ?? "")) {
        patchPayload.designation = form.designation;
      }
      if (form.employmentType !== (initialForm?.employmentType ?? "")) {
        patchPayload.employment_type = form.employmentType;
      }
      if (form.department !== (initialForm?.department ?? "")) {
        patchPayload.department = form.department;
      }
      if (form.reportingAdmin !== (initialForm?.reportingAdmin ?? "")) {
        patchPayload.reporting_admin = form.reportingAdmin;
      }
      if (form.salaryType !== (initialForm?.salaryType ?? "")) {
        patchPayload.salary_type = form.salaryType;
      }
      if (form.monthlySalary !== (initialForm?.monthlySalary ?? "")) {
        patchPayload.monthly_salary = Number(form.monthlySalary);
      }
      if (form.bankAccountNumber !== (initialForm?.bankAccountNumber ?? "")) {
        patchPayload.bank_account = form.bankAccountNumber;
      }
      if (form.bankName !== (initialForm?.bankName ?? "")) {
        patchPayload.bank_name = form.bankName;
      }
      if (form.ifscCode !== (initialForm?.ifscCode ?? "")) {
        patchPayload.ifsc_code = form.ifscCode;
      }
      if (form.role !== (initialForm?.role ?? "")) {
        patchPayload.role = form.role;
      }
      if (form.staffId !== (initialForm?.staffId ?? "")) {
        patchPayload.user_id = form.staffId;
      }
      if (form.temporaryPassword && form.temporaryPassword.trim() !== "") {
        patchPayload.temporary_password = form.temporaryPassword;
      }

      // Check if permissions have changed
      const initialPerms = initialForm?.permissions ?? [];
      const permissionsChanged =
        enabledPermissions.length !== initialPerms.length ||
        !enabledPermissions.every((p) => initialPerms.includes(p));

      if (permissionsChanged) {
        patchPayload.permissions = enabledPermissions;
      }

      // If nothing was modified and no new photo was uploaded, no need to send request
      if (Object.keys(patchPayload).length === 0 && !form.photo) {
        toast.info("No changes were made.");
        onClose?.();
        return;
      }

      console.log(`📤 edit-staff PATCH payload to /edit-staff/${dbId}/:`, JSON.stringify(patchPayload, null, 2));

      if (form.photo) {
        const formData = new FormData();
        Object.entries(patchPayload).forEach(([k, v]) => {
          if (Array.isArray(v)) {
            v.forEach((item) => formData.append(k, item));
          } else {
            formData.append(k, String(v));
          }
        });
        formData.append("photo", form.photo);
        response = await api.patch(`/edit-staff/${dbId}/`, formData);
      } else {
        response = await api.patch(`/edit-staff/${dbId}/`, patchPayload, {
          headers: { "Content-Type": "application/json" },
        });
      }
    } else {
      // POST request to /staff-create/
      if (form.photo) {
        const formData = new FormData();
        Object.entries(payload).forEach(([k, v]) => {
          if (Array.isArray(v)) {
            v.forEach((item) => formData.append(k, item));
          } else {
            formData.append(k, String(v));
          }
        });
        formData.append("photo", form.photo);
        response = await api.post("/staff-create/", formData);
      } else {
        response = await api.post("/staff-create/", payload, {
          headers: { "Content-Type": "application/json" },
        });
      }
    }


    if (response.data.status) {
      toast.success(isEdit ? "Staff updated successfully!" : "Staff created successfully!");

      onSave?.(form);

      if (closeAfterSave) {
        onClose?.();
      } else {
        resetForm();
      }
    } else {
      toast.error(response.data.message || "Failed to create staff.");
    }

  } catch (err: any) {
    const rawData = err?.response?.data;

    // ── If Django returned an HTML error page, extract and decode the error ──
    if (typeof rawData === "string" && rawData.includes("<!DOCTYPE")) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawData, "text/html");

      const exceptionEl =
        doc.querySelector(".exception_value") ||
        doc.querySelector("pre") ||
        doc.querySelector("h1");

      const djangoError = exceptionEl?.textContent?.trim() ?? "";
      console.error("❌ Django 500 exception:", djangoError);

      // ── Map known DB constraint errors to friendly field-level messages ──
      if (djangoError.toLowerCase().includes("duplicate key") ||
          djangoError.toLowerCase().includes("unique constraint")) {

        if (djangoError.toLowerCase().includes("email")) {
          setErrors((prev) => ({ ...prev, email: "This email is already registered." }));
          toast.error("Email already exists. Please use a different email address.");
        } else if (djangoError.toLowerCase().includes("user_id") ||
                   djangoError.toLowerCase().includes("staff_id")) {
          setErrors((prev) => ({ ...prev, staffId: "This Staff ID is already taken." }));
          toast.error("Staff ID already exists. Please use a different ID.");
        } else if (djangoError.toLowerCase().includes("phone")) {
          setErrors((prev) => ({ ...prev, phoneNumber: "This phone number is already registered." }));
          toast.error("Phone number already registered.");
        } else {
          // Generic duplicate — still friendlier than raw DB error
          toast.error("A staff member with these details already exists. Check email, Staff ID, or phone number.");
        }
        return;
      }

      // Unknown Django 500 — show trimmed error text
      toast.error(`Server error: ${djangoError.slice(0, 120)}`);
      return;
    }

    // ── Standard axios / JSON error ──────────────────────────────────────
    console.error("❌ Staff create failed:", {
      message:     err?.message,
      code:        err?.code,
      status:      err?.response?.status,
      data:        rawData,
    });

    let msg: string;
    if (!err?.response) {
      msg = "Cannot reach the server. Check your network connection.";
    } else {
      msg =
        rawData?.message ||
        rawData?.detail ||
        (typeof rawData === "object" && rawData !== null
          ? Object.entries(rawData)
              .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
              .join(" | ")
          : null) ||
        `Server error (${err.response.status}). Check console for details.`;
    }

    toast.error(msg);
  } finally {
    setIsSubmitting(false);
  }


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
                {isEdit ? "Edit Staff Member" : "Add New Staff Member"}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {isEdit
                  ? "Update the details of the staff member."
                  : "Enter the details of the new staff member. All fields marked with * are required."}
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
        <ToastContainer />
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
              onChange={(e) => {
                handleChange(e);
              }}
              error={errors.teacherName}
            />

            {/* Phone Number */}
            <InputField
              label="Phone Number"
              name="phoneNumber"
              value={form.phoneNumber}
              placeholder="+91234567895555"
              type="tel"
              onChange={(e) => {
                handleChange(e);
                validateField("phoneNumber", e.currentTarget.value);
              }}
              error={errors.phoneNumber}
            />

            {/* Email */}
            <InputField
              label="Email"
              name="email"
              value={form.email}
              placeholder="Enter email"
              type="email"
              onChange={(e) => {
                handleChange(e);
                validateField("email", e.currentTarget.value);
              }}
              error={errors.email}
            />

            {/* Gender */}
            <SelectField
              label="Gender"
              name="gender"
              value={form.gender}
              placeholder="Select gender"
              options={["Male", "Female", "Other"]}
              onChange={handleChange}
              error={errors.gender}
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
              {errors.photo && <p className="text-red-500 text-xs mt-1">{errors.photo}</p>}
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
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
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
              error={errors.qualification}
            />

            {/* Experience Year */}
            <InputField
              label="Experience year"
              name="experienceYear"
              value={form.experienceYear}
              placeholder="6 years"
              onChange={handleChange}
              error={errors.experienceYear}
            />

            {/* Specialization */}
            <SelectField
              label="Specialization"
              name="specialization"
              value={form.specialization}
              placeholder="Select type"
              options={["Science", "Mathematics", "Arts", "Commerce", "Languages"]}
              onChange={handleChange}
              error={errors.specialization}
            />

            {/* Course/Subject Expertise */}
            <SelectField
              label="Course/Subject Expertise"
              name="courseExpertise"
              value={form.courseExpertise}
              placeholder="Select subject"
              options={["Physics", "Chemistry", "Biology", "History", "English"]}
              onChange={handleChange}
              error={errors.courseExpertise}
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

            {/* Designation */}
            <InputField
              label="Designation"
              name="designation"
              value={form.designation}
              placeholder="e.g. Teacher, Office Staff"
              onChange={handleChange}
              error={errors.designation}
            />

            {/* Employment Type */}
            <SelectField
              label="Employment type"
              name="employmentType"
              value={form.employmentType}
              placeholder="Select type"
              options={["Full-time", "Part-time", "Contract", "Intern"]}
              onChange={handleChange}
              error={errors.employmentType}
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
              {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
            </div>

            {/* Reporting Admin — full width */}
            <div className="sm:col-span-2">
              <InputField
                label="Reporting Admin"
                name="reportingAdmin"
                value={form.reportingAdmin}
                placeholder="e.g. Principal"
                onChange={handleChange}
                error={errors.reportingAdmin}
              />
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
              error={errors.salaryType}
            />

            {/* Monthly Salary */}
            <InputField
              label="Monthly salary/Hourly rate"
              name="monthlySalary"
              value={form.monthlySalary}
              placeholder="Enter amount"
              onChange={handleChange}
              error={errors.monthlySalary}
            />

            {/* Bank Account Number */}
            <InputField
              label="Bank account number"
              name="bankAccountNumber"
              value={form.bankAccountNumber}
              placeholder="Enter number"
              onChange={handleChange}
              error={errors.bankAccountNumber}
            />

            {/* Bank Name */}
            <InputField
              label="Bank name"
              name="bankName"
              value={form.bankName}
              placeholder="Enter bank name"
              onChange={handleChange}
              error={errors.bankName}
            />

            {/* IFSC Code */}
            <InputField
              label="IFSC code"
              name="ifscCode"
              value={form.ifscCode}
              placeholder="e.g. SBIN0001234"
              onChange={handleChange}
              error={errors.ifscCode}
            />

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
                {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
              </div>

              {/* Temporary Password */}
              <InputField
                label="Temporary password"
                name="temporaryPassword"
                value={form.temporaryPassword}
                placeholder="e.g. Staff@12345"
                type="password"
                onChange={handleChange}
                error={errors.temporaryPassword}
              />
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
                {errors.staffId && <p className="text-red-500 text-xs mt-1">{errors.staffId}</p>}
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
          {!isEdit && (
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save & Add Another"}
            </button>
          )}
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : isEdit ? "Save Changes" : "Save Staff"}
          </button>
        </div>
      </div>
    </div>
  );
}
