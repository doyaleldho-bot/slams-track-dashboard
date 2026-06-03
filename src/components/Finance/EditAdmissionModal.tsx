import React, { useState } from "react";
import { X } from "lucide-react";

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

interface EditAdmissionModalProps {
  admission: AdmissionRow;
  onClose: () => void;
  onSave: (updatedAdmission: AdmissionRow) => void;
}

const EditAdmissionModal: React.FC<EditAdmissionModalProps> = ({
  admission,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<AdmissionRow>(admission);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[32px] bg-white p-8 shadow-xl">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#1F2937]">
            Edit Admission
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#6B7280] hover:bg-[#F3F4F6]"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#374151]">
                Admission ID
              </label>
              <input
                type="text"
                name="id"
                value={formData.id}
                disabled
                className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFB] px-4 py-3 text-sm text-[#374151] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#374151]">
                Student Name
              </label>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm text-[#374151] outline-none focus:border-[#083b9a]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#374151]">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm text-[#374151] outline-none focus:border-[#083b9a]"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#374151]">
                Date of Birth
              </label>
              <input
                type="text"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm text-[#374151] outline-none focus:border-[#083b9a]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#374151]">
                Course
              </label>
              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm text-[#374151] outline-none focus:border-[#083b9a]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#374151]">
                Admission Date
              </label>
              <input
                type="text"
                name="admissionDate"
                value={formData.admissionDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm text-[#374151] outline-none focus:border-[#083b9a]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#374151]">
                Admission Amount
              </label>
              <input
                type="text"
                name="admissionAmount"
                value={formData.admissionAmount}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm text-[#374151] outline-none focus:border-[#083b9a]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#374151]">
                Receipt ID
              </label>
              <input
                type="text"
                name="receiptId"
                value={formData.receiptId}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm text-[#374151] outline-none focus:border-[#083b9a]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#374151]">
                Paid Amount
              </label>
              <input
                type="text"
                name="paidAmount"
                value={formData.paidAmount}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm text-[#374151] outline-none focus:border-[#083b9a]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#374151]">
                Balance Amount
              </label>
              <input
                type="text"
                name="balanceAmount"
                value={formData.balanceAmount}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm text-[#374151] outline-none focus:border-[#083b9a]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#374151]">
                Payment Mode
              </label>
              <select
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm text-[#374151] outline-none focus:border-[#083b9a]"
              >
                <option>Bank Transfer</option>
                <option>Cash</option>
                <option>Cheque</option>
                <option>Card</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#374151]">
                Payment Status
              </label>
              <select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm text-[#374151] outline-none focus:border-[#083b9a]"
              >
                <option>Paid</option>
                <option>Pending</option>
                <option>Failed</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#374151]">
              Father's Name
            </label>
            <input
              type="text"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm text-[#374151] outline-none focus:border-[#083b9a]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#374151]">
              Mother's Name
            </label>
            <input
              type="text"
              name="motherName"
              value={formData.motherName}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm text-[#374151] outline-none focus:border-[#083b9a]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#374151]">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm text-[#374151] outline-none focus:border-[#083b9a]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#374151]">
                Mobile Number
              </label>
              <input
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm text-[#374151] outline-none focus:border-[#083b9a]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#374151]">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm text-[#374151] outline-none focus:border-[#083b9a]"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-[#E5E7EB] bg-white px-6 py-3 text-sm font-semibold text-[#374151] hover:bg-[#F8FAFB]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-[#083b9a] px-6 py-3 text-sm font-semibold text-white hover:bg-[#062d75]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAdmissionModal;
