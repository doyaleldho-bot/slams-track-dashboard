import React, { useState, type ChangeEvent } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
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
    fatherName: "",
    motherName: "",
    fatherPhone: "",
    motherPhone: "",
    fatherOccupation: "",
    motherOccupation: "",
  },
  academic: {
    className: "",
    batch: "",
    section: "",
    admissionDate: "",
    studentType: "",
    previousQualification: "",
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

const AddStudentModal: React.FC<Props> = ({ open, onClose, onSaved }) => {
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

  if (!open) return null;

  function updatePersonal<K extends string & keyof typeof initialData.personal>(
    key: K,
    value: typeof initialData.personal[K]
  ) {
    setData((prev: any) => ({
      ...prev,
      personal: {
        ...prev.personal,
        [key]: value,
      },
    }));
  }

  function updateAcademic(key: string, value: any) {
    setData((prev: any) => ({
      ...prev,
      academic: {
        ...prev.academic,
        [key]: value,
      },
    }));
  }

  function updatePayment(key: string, value: any) {
    setData((prev: any) => ({
      ...prev,
      payment: {
        ...prev.payment,
        [key]: value,
      },
    }));
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

  async function handleSave() {
    setLoading(true);
    try {
      const form = new FormData();

      // Append JSON data as a single field
      form.append("payload", JSON.stringify(data));

      // Append files
      Object.entries(files).forEach(([k, v]) => {
        if (v) form.append(k, v);
      });

      // Placeholder endpoint - adjust to your backend
      //   const res = await fetch("/api/students", {
      //     method: "POST",
      //     body: form,
      //   });

      //   if (!res.ok) {
      //     const text = await res.text();
      //     throw new Error(text || "Failed to save student");
      //   }

      for (const [key, value] of form.entries()) {
        console.log(key, value);
      }


      // success
      setLoading(false);
      onSaved && onSaved();
      onClose();
      alert("Student saved successfully");
    } catch (err: any) {
      setLoading(false);
      console.error(err);
      alert("Error saving student: " + (err.message || err));
    }
  }
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
          <button onClick={onClose} className="text-gray-500 hover:opacity-80">✕</button>
        </div>

        <StepIndicator />

        <div className="p-6">
          {step === 1 && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600">Student Name *</label>
                <input
                  value={data.personal.name}
                  onChange={(e) => updatePersonal("name", e.target.value)}
                  className="w-full mt-2 p-2.5 bg-gray-100 rounded"
                />
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
                <input
                  value={data.personal.gender}
                  onChange={(e) => updatePersonal("gender", e.target.value)}
                  className="w-full mt-2 p-2.5 bg-gray-100 rounded"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Phone</label>
                <input
                  value={data.personal.phone}
                  onChange={(e) => updatePersonal("phone", e.target.value)}
                  className="w-full mt-2 p-2.5 bg-gray-100 rounded"
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm text-gray-600">Email</label>
                <input
                  value={data.personal.email}
                  onChange={(e) => updatePersonal("email", e.target.value)}
                  className="w-full mt-2 p-2.5 bg-gray-100 rounded"
                />
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
                <input
                  value={data.personal.bloodGroup}
                  onChange={(e) => updatePersonal("bloodGroup", e.target.value)}
                  className="w-full mt-2 p-2.5 bg-gray-100 rounded"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Father's Name</label>
                <input
                  value={data.personal.fatherName}
                  onChange={(e) => updatePersonal("fatherName", e.target.value)}
                  className="w-full mt-2 p-2.5 bg-gray-100 rounded"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Father Phone</label>
                <input
                  value={data.personal.fatherPhone}
                  onChange={(e) => updatePersonal("fatherPhone", e.target.value)}
                  className="w-full mt-2 p-2.5 bg-gray-100 rounded"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Mother's Name</label>
                <input
                  value={data.personal.motherName}
                  onChange={(e) => updatePersonal("motherName", e.target.value)}
                  className="w-full mt-2 p-2.5 bg-gray-100 rounded"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Mother Phone</label>
                <input
                  value={data.personal.motherPhone}
                  onChange={(e) => updatePersonal("motherPhone", e.target.value)}
                  className="w-full mt-2 p-2.5 bg-gray-100 rounded"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Class</label>
                <input value={data.academic.className} onChange={(e) => updateAcademic("className", e.target.value)} className="w-full mt-2 p-3 bg-gray-100 rounded" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Batch</label>
                <input value={data.academic.batch} onChange={(e) => updateAcademic("batch", e.target.value)} className="w-full mt-2 p-3 bg-gray-100 rounded" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Section</label>
                <input value={data.academic.section} onChange={(e) => updateAcademic("section", e.target.value)} className="w-full mt-2 p-3 bg-gray-100 rounded" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Admission Date</label>
                <input type="date" value={data.academic.admissionDate} onChange={(e) => updateAcademic("admissionDate", e.target.value)} className="w-full mt-2 p-3 bg-gray-100 rounded" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Student Type</label>
                <input value={data.academic.studentType} onChange={(e) => updateAcademic("studentType", e.target.value)} className="w-full mt-2 p-3 bg-gray-100 rounded" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Previous Qualification</label>
                <input value={data.academic.previousQualification} onChange={(e) => updateAcademic("previousQualification", e.target.value)} className="w-full mt-2 p-3 bg-gray-100 rounded" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Status</label>
                <input value={data.academic.status} onChange={(e) => updateAcademic("status", e.target.value)} className="w-full mt-2 p-3 bg-gray-100 rounded" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Admission Id</label>
                <input value={data.academic.admissionId} onChange={(e) => updateAcademic("admissionId", e.target.value)} className="w-full mt-2 p-3 bg-gray-100 rounded" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Admission Amount (₹)</label>
                <input type="number" value={data.payment.admissionAmount} onChange={(e) => updatePayment("admissionAmount", Number(e.target.value))} className="w-full mt-2 p-3 bg-gray-100 rounded" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Course Fee (₹)</label>
                <input type="number" value={data.payment.courseFee} onChange={(e) => updatePayment("courseFee", Number(e.target.value))} className="w-full mt-2 p-3 bg-gray-100 rounded" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Discount (₹)</label>
                <input type="number" value={data.payment.discount} onChange={(e) => updatePayment("discount", Number(e.target.value))} className="w-full mt-2 p-3 bg-gray-100 rounded" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Paid Amount (₹)</label>
                <input type="number" value={data.payment.paidAmount} onChange={(e) => updatePayment("paidAmount", Number(e.target.value))} className="w-full mt-2 p-3 bg-gray-100 rounded" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Payment Mode</label>
                <input value={data.payment.paymentMode} onChange={(e) => updatePayment("paymentMode", e.target.value)} className="w-full mt-2 p-3 bg-gray-100 rounded" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Installment Plan</label>
                <input value={data.payment.installmentPlan} onChange={(e) => updatePayment("installmentPlan", e.target.value)} className="w-full mt-2 p-3 bg-gray-100 rounded" />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="grid gap-3">
              {[
                { key: "studentPhoto", label: "Student Photo", desc: "Upload a clear photo" },
                { key: "birthCertificate", label: "Birth Certificate", desc: "PDF or Image" },
                { key: "previousTc", label: "Previous School TC", desc: "PDF or Image" },
                { key: "aadhar", label: "Aadhar Card (Student)", desc: "PDF or Image" },
                { key: "parentProof", label: "Parent ID Proof", desc: "PDF or Image" },
                { key: "casteCertificate", label: "Caste / Category Certificate", desc: "PDF or Image" },
              ].map((doc) => {
                const prog = uploadProgress[doc.key] || 0;
                const isUploading = prog > 0 && prog < 100;
                const isComplete = prog === 100;
                const uploadedFile = data?.documents?.[doc.key];

                return (
                  <div key={doc.key} className="bg-gray-100 p-3 rounded">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="text-sm font-medium text-gray-700">{doc.label}</div>
                        <div className="text-xs text-gray-500">{doc.desc}</div>

                        {uploadedFile && (
                          <div className="text-xs text-green-600 mt-1">
                            {uploadedFile.name}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <label
                          className={`px-3 py-2 rounded font-medium cursor-pointer text-sm transition-all ${isComplete
                              ? "bg-green-500 text-white"
                              : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                        >
                          {isComplete ? "✓ Uploaded" : isUploading ? "Uploading..." : "Upload"}

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

                    {(isUploading || isComplete) && (
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-300 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${prog}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-600 w-10 text-right">{Math.round(prog)}%</div>
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
              <button onClick={() => setStep(step - 1)} className="px-4 py-2 bg-gray-200 rounded">◀ Back</button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>

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
                {loading ? "Saving..." : "Save"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;
