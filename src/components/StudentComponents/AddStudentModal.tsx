import React, { useState, useEffect, type ChangeEvent } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { getClasses, getSections } from "../../services/classApi";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved?: (saved?: any) => void;
  student?: any; // optional student for edit
}

const initialData = {
  personal: {
    name: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    bloodGroup: "",
    parentGuardianName: "",
    fatherName: "",
    motherName: "",
    fatherPhone: "",
    motherPhone: "",
    fatherOccupation: "",
    motherOccupation: "",
  },
  academic: {
    classId: "",
    batch: "",
    section: "",
    rollNumber: "",
    admissionDate: "",
    studentType: "",
    previousQualification: "",
    previousInstitute: "",
    status: "",
    admissionId: "",
  },
  payment: {
    admissionAmount: 0,
    courseFee: 0,
    discount: 0,
    paidAmount: 0,
    paymentMode: "",
    installmentPlan: "",
    balanceAmount: 0,
  },
  documents: {
    studentPhoto: null,
    birthCertificate: null,
    previousTc: null,
    aadhar: null,
    parentProof: null,
    casteCertificate: null,
  },
};

const AddStudentModal: React.FC<Props> = ({
  open,
  onClose,
  onSaved,
  student,
}) => {
  const [step, setStep] = useState<number>(1);
  const [data, setData] = useState<any>(initialData);
  const [files, setFiles] = useState<Record<string, File | null>>({
    studentPhoto: null,
    birthCertificate: null,
    previousTc: null,
    aadhar: null,
    parentProof: null,
    casteCertificate: null,
  });
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [classes, setClasses] = useState<{
    id: number;
    class_name: string;
    class_section: string;
  }[]>([]);
  const [sections, setSections] = useState<string[]>([]);

  useEffect(() => {
    if (student) {
      const personalDetails = student.personal_details || {};
      const academicDetails = student.academic_details || {};
      const financialDetails = student.financial_details || {};
      const documentDetails = student.document_details || {};

      // Get class ID from student data
      const studentClassName = student.class_name || academicDetails.student_class;

      setData({
        personal: {
          name: student.fullname || "",
          dob: personalDetails.dob || student.dob || "",
          gender: personalDetails.gender || student.gender || "",
          phone: student.phone_number || "",
          email: student.email || "",
          address: personalDetails.address || student.address || "",
          bloodGroup: personalDetails.blood_group || student.blood_group || "",
          parentGuardianName: personalDetails.parent_guardian_name || student.parent_guardian_name || "",
          fatherName: personalDetails.father_name || student.father_name || "",
          motherName: personalDetails.mother_name || student.mother_name || "",
          fatherPhone: personalDetails.father_phone_number || student.father_phone_number || "",
          motherPhone: personalDetails.mother_phone_number || student.mother_phone_number || "",
          fatherOccupation: personalDetails.father_occupation || student.father_occupation || "",
          motherOccupation: personalDetails.mother_occupation || student.mother_occupation || "",
        },

        academic: {
          classId: "",
          batch: academicDetails.batch || student.batch || "",
          section: academicDetails.section || student.section || "",
          rollNumber: academicDetails.roll_number || student.roll_number || "",
          admissionDate: academicDetails.admission_date || student.admission_date || "",
          studentType: academicDetails.student_type || student.student_type || "",
          previousQualification:
            academicDetails.previous_qualifications || student.previous_qualifications || "",
          previousInstitute: academicDetails.previous_institute || student.previous_institute || "",
          status: academicDetails.status || student.academic_status || "",
          admissionId: academicDetails.admission_id || student.admission_id || "",
        },

        payment: {
          admissionAmount: financialDetails.admission_amount || student.admission_amount || "",
          courseFee: financialDetails.course_fee || student.course_fee || "",
          discount: financialDetails.discount || student.discount || "",
          paidAmount: financialDetails.paid_amount || student.paid_amount || "",
          paymentMode: financialDetails.payment_mode || student.payment_mode || "",
          installmentPlan: financialDetails.installment_plan || student.installment_plan || "",
          balanceAmount: financialDetails.balance_amount || student.balance_amount || "",
        },

        documents: {
          studentPhoto: documentDetails.student_photo || student.student_photo || null,
          birthCertificate: documentDetails.birth_certificate || student.birth_certificate || null,
          previousTc:
            documentDetails.previous_school_tc || student.previous_school_tc || null,
          aadhar: documentDetails.aadhar_card || student.aadhar_card || null,
          parentProof:
            documentDetails.parent_id_proof || student.parent_id_proof || null,
          casteCertificate:
            documentDetails.caste_certificate || student.caste_certificate || null,
        },
      });

      // Set classId after classes are loaded
      // Set classId after classes are loaded
      if (studentClassName && classes.length > 0) {
        const studentSection =
          academicDetails.section || student.section || "";

        const foundClass = classes.find(
          (c) =>
            c.class_name?.trim() === studentClassName?.trim() &&
            c.class_section?.trim() === studentSection?.trim()
        );

        if (foundClass) {
          setData((prev: any) => ({
            ...prev,
            academic: {
              ...prev.academic,
              classId: foundClass.id.toString(),
              section: foundClass.class_section,
            },
          }));
        }
      }

      setStep(1);
      setErrors({});
    } else {
      setData(initialData);
      setErrors({});
    }
  }, [student, classes]);

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
    const loadSections = async () => {
      if (!data.academic.classId) {
        setSections([]);
        return;
      }

      try {
        const sectionList = await getSections(data.academic.classId);
        setSections(sectionList);
      } catch (error) {
        console.error(error);
      }
    };

    loadSections();
  }, [data.academic.classId]);

  if (!open) return null;

  function updatePersonal<K extends string & keyof typeof initialData.personal>(
    key: K,
    value: (typeof initialData.personal)[K],
  ) {
    setData((prev: any) => ({
      ...prev,
      personal: {
        ...prev.personal,
        [key]: value,
      },
    }));

    const fieldMap: Record<string, string> = {
      fatherName: "father_name",
      motherName: "mother_name",
      parentGuardianName: "parent_guardian_name",
      fatherPhone: "father_phone_number",
      motherPhone: "mother_phone_number",
      fatherOccupation: "father_occupation",
      motherOccupation: "mother_occupation",
      bloodGroup: "blood_group",
      name: "fullname",
      phone: "phone_number",
      email: "email",
      address: "address",
      dob: "dob",
      gender: "gender",
    };

    const apiKey = fieldMap[key as string];
    if (apiKey) {
      clearError(apiKey);
    }
  }

  function updateAcademic(key: string, value: any) {
    setData((prev: any) => ({
      ...prev,
      academic: {
        ...prev.academic,
        [key]: value,
      },
    }));

    const fieldMap: Record<string, string> = {
      classId: "class_name",
      batch: "batch",
      section: "section",
      rollNumber: "roll_number",
      admissionDate: "admission_date",
      studentType: "student_type",
      previousQualification: "previous_qualifications",
      previousInstitute: "previous_institute",
      status: "academic_status",
      admissionId: "admission_id",
    };

    const apiKey = fieldMap[key];
    if (apiKey) {
      clearError(apiKey);
    }
  }

  function updatePayment(key: string, value: any) {
    setData((prev: any) => ({
      ...prev,
      payment: {
        ...prev.payment,
        [key]: value,
      },
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function clearError(key: string) {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>, key: string) {
    const f = e.target.files && e.target.files[0];
    if (f) {
      setUploadProgress((prev) => ({ ...prev, [key]: 0 }));
      setData((prev: any) => ({
        ...prev,
        documents: {
          ...prev.documents,
          [key]: f,
        },
      }));
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress > 90) progress = 90;
        setUploadProgress((prev) => ({ ...prev, [key]: progress }));

        if (progress >= 90) {
          clearInterval(interval);
          setUploadProgress((prev) => ({ ...prev, [key]: 100 }));
        }
      }, 300);
    }
    setFiles((prev) => ({ ...prev, [key]: f || null }));
  }

  function validateForm() {
    const nextErrors: Record<string, string[]> = {};
    const name = data.personal.name?.trim();
    const email = data.personal.email?.trim();
    const phone = data.personal.phone?.trim();

    if (!name) {
      nextErrors.fullname = ["Student name may not be blank."];
    }

    if (!phone) {
      nextErrors.phone_number = ["Phone number may not be blank."];
    } else if (!/^\d{10}$/.test(phone)) {
      nextErrors.phone_number = ["Enter a valid 10-digit phone number."];
    }

    if (!email) {
      nextErrors.email = ["Email may not be blank."];
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = ["Enter a valid email address."];
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStep(1);
      return false;
    }

    return true;
  }

  function removeFile(key: string) {
    setData((prev: any) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [key]: null,
      },
    }));

    setFiles((prev) => ({
      ...prev,
      [key]: null,
    }));

    setUploadProgress((prev) => ({
      ...prev,
      [key]: 0,
    }));
  }

  const handleSave = async () => {
    try {
      setLoading(true);

      if (!validateForm()) {
        setLoading(false);
        return;
      }

      const formData = new FormData();

      // Main Fields
      formData.append("fullname", data.personal.name || "");
      formData.append("email", data.personal.email || "");
      formData.append("phone_number", data.personal.phone || "");

      // Personal Details
      formData.append("personal_details.father_name", data.personal.fatherName || "");
      formData.append("personal_details.mother_name", data.personal.motherName || "");
      formData.append("personal_details.dob", data.personal.dob || "");
      formData.append("personal_details.gender", data.personal.gender || "");
      formData.append("personal_details.address", data.personal.address || "");
      formData.append("personal_details.blood_group", data.personal.bloodGroup || "");
      formData.append(
        "personal_details.parent_guardian_name",
        data.personal.parentGuardianName || ""
      );
      // parent guardian phone removed
      formData.append(
        "personal_details.father_phone_number",
        data.personal.fatherPhone || ""
      );
      formData.append(
        "personal_details.mother_phone_number",
        data.personal.motherPhone || ""
      );
      formData.append(
        "personal_details.father_occupation",
        data.personal.fatherOccupation || ""
      );
      formData.append(
        "personal_details.mother_occupation",
        data.personal.motherOccupation || ""
      );

      // Academic Details
      formData.append(
        "academic_details.student_class",
        data.academic.classId || ""
      );
      formData.append(
        "academic_details.batch",
        data.academic.batch || ""
      );
      formData.append(
        "academic_details.section",
        data.academic.section || ""
      );
      formData.append(
        "academic_details.admission_date",
        data.academic.admissionDate || ""
      );
      formData.append(
        "academic_details.student_type",
        data.academic.studentType || ""
      );
      formData.append(
        "academic_details.previous_qualifications",
        data.academic.previousQualification || ""
      );
      formData.append(
        "academic_details.previous_institute",
        data.academic.previousInstitute || ""
      );
      formData.append(
        "academic_details.status",
        data.academic.status || ""
      );
      formData.append(
        "academic_details.admission_id",
        data.academic.admissionId || ""
      );

      // Financial Details
      const balanceAmount =
        Number(data.payment.courseFee || 0) -
        Number(data.payment.discount || 0) -
        Number(data.payment.paidAmount || 0);

      formData.append(
        "financial_details.admission_amount",
        String(data.payment.admissionAmount || 0)
      );
      formData.append(
        "financial_details.course_fee",
        String(data.payment.courseFee || 0)
      );
      formData.append(
        "financial_details.discount",
        String(data.payment.discount || 0)
      );
      formData.append(
        "financial_details.paid_amount",
        String(data.payment.paidAmount || 0)
      );
      formData.append(
        "financial_details.payment_mode",
        data.payment.paymentMode || ""
      );
      formData.append(
        "financial_details.installment_plan",
        data.payment.installmentPlan || ""
      );
      formData.append(
        "financial_details.balance_amount",
        String(balanceAmount)
      );

      // Documents
      if (files.studentPhoto) {
        formData.append(
          "document_details.student_photo",
          files.studentPhoto
        );
      }

      if (files.birthCertificate) {
        formData.append(
          "document_details.birth_certificate",
          files.birthCertificate
        );
      }

      if (files.previousTc) {
        formData.append(
          "document_details.transfer_certificate",
          files.previousTc
        );
      }

      if (files.aadhar) {
        formData.append(
          "document_details.aadhar_card",
          files.aadhar
        );
      }

      if (files.parentProof) {
        formData.append(
          "document_details.parent_id_proof",
          files.parentProof
        );
      }

      if (files.casteCertificate) {
        formData.append(
          "document_details.caste_certificate",
          files.casteCertificate
        );
      }

      // Debug
      // console.log("=== FormData being sent ===");
      // for (const [key, value] of formData.entries()) {
      //   console.log(
      //     `${key}:`,
      //     value instanceof File ? `File - ${value.name}` : value
      //   );
      // }
      // console.log("=== End FormData ===");

      let response;

      if (student?.profile_id) {
        response = await api.put(
          `/student/edit/${student.profile_id}/`,
          formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
        );
      } else {
        // Add new student
        response = await api.post(
          "/add-student/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }


      if (response?.data) {
        if (response.data.status === false && response.data.errors) {
          setErrors(response.data.errors);

          const stepMap: Record<string, number> = {
            fullname: 1,
            dob: 1,
            gender: 1,
            phone_number: 1,
            email: 1,
            address: 1,
            blood_group: 1,
            parent_guardian_name: 1,
            father_name: 1,
            mother_name: 1,
            father_phone_number: 1,
            mother_phone_number: 1,
            father_occupation: 1,
            mother_occupation: 1,
            class_name: 2,
            batch: 2,
            section: 2,
            roll_number: 2,
            admission_date: 2,
            student_type: 2,
            previous_qualifications: 2,
            previous_institute: 2,
            academic_status: 2,
            admission_id: 2,
            admission_amount: 3,
            course_fee: 3,
            discount: 3,
            paid_amount: 3,
            payment_mode: 3,
            installment_plan: 3,
          };

          const errorField = Object.keys(response.data.errors)[0];
          if (errorField && stepMap[errorField]) {
            setStep(stepMap[errorField]);
          }

          return;
        }

        toast.success(
          student?.profile_id
            ? "Student updated successfully"
            : "Student added successfully"
        );

        const savedData = response?.data?.data
          ? {
            personal: {
              name: response.data.data.fullname || data.personal.name,
              dob: response.data.data.dob || data.personal.dob,
              gender: response.data.data.gender || data.personal.gender,
              phone: response.data.data.phone_number || data.personal.phone,
              email: response.data.data.email || data.personal.email,
              address: response.data.data.address || data.personal.address,
              bloodGroup: response.data.data.blood_group || data.personal.bloodGroup,
              parentGuardianName:
                response.data.data.parent_guardian_name ||
                data.personal.parentGuardianName,
              fatherName: response.data.data.father_name || data.personal.fatherName,
              motherName: response.data.data.mother_name || data.personal.motherName,
              fatherPhone:
                response.data.data.father_phone_number || data.personal.fatherPhone,
              motherPhone:
                response.data.data.mother_phone_number || data.personal.motherPhone,
              fatherOccupation:
                response.data.data.father_occupation || data.personal.fatherOccupation,
              motherOccupation:
                response.data.data.mother_occupation || data.personal.motherOccupation,
            },
            academic: {
              className:
                response.data.data.class_name ||
                classes.find((c) => String(c.id) === data.academic.classId)
                  ?.class_name ||
                "",
              batch: response.data.data.batch || data.academic.batch,
              section: response.data.data.section || data.academic.section,
              rollNumber:
                response.data.data.roll_number || data.academic.rollNumber,
              admissionDate:
                response.data.data.admission_date || data.academic.admissionDate,
              studentType:
                response.data.data.student_type || data.academic.studentType,
              previousQualification:
                response.data.data.previous_qualifications ||
                data.academic.previousQualification,
              previousInstitute:
                response.data.data.previous_institute ||
                data.academic.previousInstitute,
              status:
                response.data.data.academic_status || data.academic.status,
              admissionId:
                response.data.data.admission_id || data.academic.admissionId,
            },
          }
          : {
            personal: {
              name: data.personal.name,
              dob: data.personal.dob,
              gender: data.personal.gender,
              phone: data.personal.phone,
              email: data.personal.email,
              address: data.personal.address,
              bloodGroup: data.personal.bloodGroup,
              parentGuardianName: data.personal.parentGuardianName,
              fatherName: data.personal.fatherName,
              motherName: data.personal.motherName,
              fatherPhone: data.personal.fatherPhone,
              motherPhone: data.personal.motherPhone,
              fatherOccupation: data.personal.fatherOccupation,
              motherOccupation: data.personal.motherOccupation,
            },
            academic: {
              className:
                classes.find((c) => String(c.id) === data.academic.classId)
                  ?.class_name || "",
              batch: data.academic.batch,
              section: data.academic.section,
              rollNumber: data.academic.rollNumber,
              admissionDate: data.academic.admissionDate,
              studentType: data.academic.studentType,
              previousQualification: data.academic.previousQualification,
              previousInstitute: data.academic.previousInstitute,
              status: data.academic.status,
              admissionId: data.academic.admissionId,
            },
          };

        onSaved?.(savedData);
        onClose();
      }
    } catch (error: any) {
      if (error?.response?.data?.errors) {
        setErrors(error.response.data.errors);
        const errorField = Object.keys(error.response.data.errors)[0];
        const stepMap: Record<string, number> = {
          fullname: 1,
          dob: 1,
          gender: 1,
          phone_number: 1,
          email: 1,
          address: 1,
          blood_group: 1,
          parent_guardian_name: 1,
          father_name: 1,
          mother_name: 1,
          father_phone_number: 1,
          mother_phone_number: 1,
          father_occupation: 1,
          mother_occupation: 1,
          class_name: 2,
          batch: 2,
          section: 2,
          roll_number: 2,
          admission_date: 2,
          student_type: 2,
          previous_qualifications: 2,
          previous_institute: 2,
          academic_status: 2,
          admission_id: 2,
          admission_amount: 3,
          course_fee: 3,
          discount: 3,
          paid_amount: 3,
          payment_mode: 3,
          installment_plan: 3,
        };
        if (errorField && stepMap[errorField]) {
          setStep(stepMap[errorField]);
        }
      } else {
        toast.error("Error saving student. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  function StepIndicator() {
    const steps = ["Personal", "Academic", "Payment", "Document"];

    return (
      <div className="flex items-center justify-between px-6 py-6">
        {steps.map((stepName, idx) => (
          <div key={idx} className="flex items-center flex-1">
            {/* Step Name */}
            <div
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${step > idx + 1
                ? "bg-green-100 text-green-600"
                : step === idx + 1
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-500"
                }`}
            >
              {stepName}
            </div>

            {/* Line */}
            {idx < steps.length - 1 && (
              <div
                className={`h-1 flex-1 mx-2 ${step > idx + 1
                  ? "bg-green-500"
                  : "bg-gray-300"
                  }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-6 overflow-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <div>
            <h2 className="text-xl font-semibold">Add New Student</h2>
            <p className="text-sm text-gray-500">Step {step} of 4 — Personal</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:opacity-80">
            ✕
          </button>
        </div>

        <StepIndicator />

        <div className="p-6">
          {step === 1 && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600">Student Name *</label>
                <input
                  value={data.personal.name}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                    updatePersonal("name", value);
                  }}
                  className="w-full mt-2 p-2.5 bg-gray-100 rounded"
                />
                {errors.fullname?.[0] && (
                  <p className="text-xs text-red-600 mt-1">{errors.fullname[0]}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600">DOB</label>
                <input
                  type="date"
                  value={data.personal.dob}
                  onChange={(e) => updatePersonal("dob", e.target.value)}
                  className="w-full mt-2 p-2.5 bg-gray-100 rounded"
                />
              </div>

              {/* Gender & Phone in same row */}
              <div>
                <label className="text-sm text-gray-600">Gender</label>

                <select
                  value={data.personal.gender}
                  onChange={(e) => updatePersonal("gender", e.target.value)}
                  className="w-full mt-2 p-2.5 bg-gray-100 rounded border border-gray-300"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Phone</label>
                <input
                  value={data.personal.phone} maxLength={10}
                  onChange={(e) => updatePersonal("phone", e.target.value)}
                  className="w-full mt-2 p-2.5 bg-gray-100 rounded"
                />
                {errors.phone_number?.[0] && (
                  <p className="text-xs text-red-600 mt-1">{errors.phone_number[0]}</p>
                )}
              </div>

              <div className="col-span-2">
                <label className="text-sm text-gray-600">Email</label>
                <input
                  value={data.personal.email}
                  onChange={(e) => updatePersonal("email", e.target.value)}
                  className="w-full mt-2 p-2.5 bg-gray-100 rounded"
                />
                {errors.email?.[0] && (
                  <p className="text-xs text-red-600 mt-1">{errors.email[0]}</p>
                )}
              </div>

              <div className="col-span-2">
                <label className="text-sm text-gray-600">Address</label>
                <textarea
                  value={data.personal.address}
                  onChange={(e) => updatePersonal("address", e.target.value)}
                  rows={3}
                  className="w-full mt-2 p-2.5 bg-gray-100 rounded resize-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Blood Group</label>

                <select
                  value={data.personal.bloodGroup}
                  onChange={(e) => updatePersonal("bloodGroup", e.target.value)}
                  className="w-full mt-2 p-2.5 bg-gray-100 rounded"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Parent/Guardian Name</label>
                <input
                  value={data.personal.parentGuardianName}
                  onChange={(e) => updatePersonal("parentGuardianName", e.target.value.replace(/[^a-zA-Z.\s]/g, ""))}
                  className="w-full mt-2 p-2.5 bg-gray-100 rounded"
                />
              </div>

              {/* Parent/Guardian phone removed */}

              <div>
                <label className="text-sm text-gray-600">Father's Name</label>
                <input
                  value={data.personal.fatherName}
                  onChange={(e) => updatePersonal("fatherName", e.target.value.replace(/[^a-zA-Z.\s]/g, ""))}
                  className="w-full mt-2 p-2.5 bg-gray-100 rounded"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Father Phone</label>
                <input
                  value={data.personal.fatherPhone} maxLength={10}
                  onChange={(e) => updatePersonal("fatherPhone", e.target.value)}
                  className="w-full mt-2 p-2.5 bg-gray-100 rounded"
                />
                {errors.father_phone_number?.[0] && (
                  <p className="text-xs text-red-600 mt-1">{errors.father_phone_number[0]}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600">Father Occupation</label>
                <input
                  value={data.personal.fatherOccupation}
                  onChange={(e) => updatePersonal("fatherOccupation", e.target.value)}
                  className="w-full mt-2 p-2.5 bg-gray-100 rounded"
                />
                {errors.father_occupation?.[0] && (
                  <p className="text-xs text-red-600 mt-1">{errors.father_occupation[0]}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600">Mother's Name</label>
                <input
                  value={data.personal.motherName}
                  onChange={(e) => updatePersonal("motherName", e.target.value.replace(/[^a-zA-Z.\s]/g, ""))}
                  className="w-full mt-2 p-2.5 bg-gray-100 rounded"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Mother Phone</label>
                <input
                  value={data.personal.motherPhone} maxLength={10}
                  onChange={(e) => updatePersonal("motherPhone", e.target.value)}
                  className="w-full mt-2 p-2.5 bg-gray-100 rounded"
                />
                {errors.mother_phone_number?.[0] && (
                  <p className="text-xs text-red-600 mt-1">{errors.mother_phone_number[0]}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600">Mother Occupation</label>
                <input
                  value={data.personal.motherOccupation}
                  onChange={(e) => updatePersonal("motherOccupation", e.target.value)}
                  className="w-full mt-2 p-2.5 bg-gray-100 rounded"
                />
                {errors.mother_occupation?.[0] && (
                  <p className="text-xs text-red-600 mt-1">{errors.mother_occupation[0]}</p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Class</label>

                <select
                  value={data.academic.classId}
                  onChange={(e) => {
                    const selectedCls = classes.find(
                      (cls) => String(cls.id) === e.target.value
                    );

                    updateAcademic("classId", e.target.value);

                    if (selectedCls) {
                      updateAcademic("section", selectedCls.class_section);
                    }
                  }}
                  className="w-full mt-2 p-3 bg-gray-100 rounded"
                >
                  <option value="">Select Class</option>

                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.class_name} - {cls.class_section}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Batch</label>
                <input
                  value={data.academic.batch}
                  onChange={(e) => updateAcademic("batch", e.target.value)}
                  className="w-full mt-2 p-3 bg-gray-100 rounded"
                />
              </div>
              {/* <div>
                <label className="text-sm text-gray-600">Section</label>

                <select
                  value={data.academic.section}
                  onChange={(e) =>  
                    updateAcademic("section", e.target.value)
                  }
                  className="w-full mt-2 p-3 bg-gray-100 rounded"
                  disabled={!data.academic.classId}
                >
                  <option value="">Select Section</option>

                  {sections.map((section) => (
                    <option key={section} value={section}>
                      {section}
                    </option>
                  ))}
                </select>
              </div> */}
              <div>
                <label className="text-sm text-gray-600">Admission Date</label>
                <input
                  type="date"
                  value={data.academic.admissionDate}
                  onChange={(e) =>
                    updateAcademic("admissionDate", e.target.value)
                  }
                  className="w-full mt-2 p-3 bg-gray-100 rounded"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Student Type</label>
                <input
                  value={data.academic.studentType}
                  onChange={(e) =>
                    updateAcademic("studentType", e.target.value)
                  }
                  className="w-full mt-2 p-3 bg-gray-100 rounded"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Previous Qualification
                </label>
                <input
                  value={data.academic.previousQualification}
                  onChange={(e) =>
                    updateAcademic("previousQualification", e.target.value)
                  }
                  className="w-full mt-2 p-3 bg-gray-100 rounded"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Previous Institute</label>
                <input value={data.academic.previousInstitute} onChange={(e) => updateAcademic("previousInstitute", e.target.value)} className="w-full mt-2 p-3 bg-gray-100 rounded" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Status</label>
                <input
                  value={data.academic.status}
                  onChange={(e) => updateAcademic("status", e.target.value)}
                  className="w-full mt-2 p-3 bg-gray-100 rounded"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Admission Id</label>
                <input value={data.academic.admissionId} onChange={(e) => updateAcademic("admissionId", e.target.value)} className="w-full mt-2 p-3 bg-gray-100 rounded" />
                {errors.admission_id?.[0] && (
                  <p className="text-xs text-red-600 mt-1">{errors.admission_id[0]}</p>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Admission Amount (₹)</label>
                <input type="text" value={data.payment.admissionAmount} onChange={(e) => updatePayment("admissionAmount", Number(e.target.value))} className="w-full mt-2 p-3 bg-gray-100 rounded" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Course Fee (₹)</label>
                <input type="text" value={data.payment.courseFee || 0} onChange={(e) => updatePayment("courseFee", Number(e.target.value))} className="w-full mt-2 p-3 bg-gray-100 rounded" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Discount (₹)</label>
                <input type="text" value={data.payment.discount} onChange={(e) => updatePayment("discount", Number(e.target.value))} className="w-full mt-2 p-3 bg-gray-100 rounded" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Paid Amount (₹)</label>
                <input type="text" value={data.payment.paidAmount} onChange={(e) => updatePayment("paidAmount", Number(e.target.value))} className="w-full mt-2 p-3 bg-gray-100 rounded" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Payment Mode</label>
                <input
                  value={data.payment.paymentMode}
                  onChange={(e) => updatePayment("paymentMode", e.target.value)}
                  className="w-full mt-2 p-3 bg-gray-100 rounded"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Installment Plan
                </label>
                <input
                  value={data.payment.installmentPlan}
                  onChange={(e) =>
                    updatePayment("installmentPlan", e.target.value)
                  }
                  className="w-full mt-2 p-3 bg-gray-100 rounded"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="grid gap-3">
              {[
                {
                  key: "studentPhoto",
                  label: "Student Photo",
                  desc: "Upload a clear photo",
                },
                {
                  key: "birthCertificate",
                  label: "Birth Certificate",
                  desc: "PDF or Image",
                },
                {
                  key: "previousTc",
                  label: "Previous School TC",
                  desc: "PDF or Image",
                },
                {
                  key: "aadhar",
                  label: "Aadhar Card (Student)",
                  desc: "PDF or Image",
                },
                {
                  key: "parentProof",
                  label: "Parent ID Proof",
                  desc: "PDF or Image",
                },
                {
                  key: "casteCertificate",
                  label: "Caste / Category Certificate",
                  desc: "PDF or Image",
                },
              ].map((doc) => {
                const prog = uploadProgress[doc.key] || 0;
                const isUploading = prog > 0 && prog < 100;
                const uploadedFile = data?.documents?.[doc.key];

                const hasExistingFile =
                  typeof uploadedFile === "string" && uploadedFile.length > 0;

                const isComplete = prog === 100 || hasExistingFile;

                return (
                  <div key={doc.key} className="bg-gray-100 p-3 rounded">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="text-sm font-medium text-gray-700">
                          {doc.label}
                        </div>
                        <div className="text-xs text-gray-500">{doc.desc}</div>

                        {uploadedFile ? (
                          typeof uploadedFile === "string" ? (
                            <a
                              href={uploadedFile}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 mt-1 underline block"
                            >
                              {uploadedFile.split("/").pop()}
                            </a>
                          ) : uploadedFile instanceof File ? (
                            <div className="text-xs text-green-600 mt-1">
                              {uploadedFile.name}
                            </div>
                          ) : null
                        ) : null}
                      </div>
                      <div className="flex gap-2">
                        <label
                          className={`px-3 py-2 rounded font-medium cursor-pointer text-sm transition-all ${isComplete
                            ? "bg-green-500 text-white"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                        >
                          {isComplete
                            ? "✓ Uploaded"
                            : isUploading
                              ? "Uploading..."
                              : "Upload"}

                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => onFileChange(e, doc.key)}
                            className="hidden"
                          />
                        </label>

                        {isComplete && (
                          <button
                            type="button"
                            onClick={() => removeFile(doc.key)}
                            className="w-9 h-9 flex items-center justify-center bg-red-300 text-white rounded hover:bg-red-500"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>

                    {(isUploading || isComplete || hasExistingFile) && (
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-300 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{
                              width: `${hasExistingFile ? 100 : prog}%`,
                            }}
                          />
                        </div>

                        <div className="text-xs text-gray-600 w-10 text-right">
                          {hasExistingFile ? "100%" : `${Math.round(prog)}%`}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t">
          <div>
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                ◀ Back
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
              Cancel
            </button>

            {step < 4 && (
              <button
                onClick={() => setStep(step + 1)}
                className="px-6 py-2 bg-blue-600 text-white rounded"
              >
                Next ▶
              </button>
            )}

            {step === 4 && (
              <button onClick={handleSave} disabled={loading} className="px-6 py-2 bg-blue-700 text-white rounded">
                {loading ? student ? "Updating..." : "Saving..." : student ? "Update" : "Save"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;
