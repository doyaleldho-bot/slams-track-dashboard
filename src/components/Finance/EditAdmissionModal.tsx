import React, { useState } from "react";
import { X } from "lucide-react";
import api from "../../api/axios";
import { updateAdmission } from "../../api/finance";

interface AdmissionRow {
  id: string;
  internalId?: string;
  studentName: string;
  gender: string;
  birthDate: string;
  course: string;
  admissionDate: string;
  admissionAmount: string;
  courseFee: string;
  discountAmount: string;
  receiptId: string;
  paidAmount: string;
  balanceAmount: string;
  paymentMode: string;
  paymentStatus: string;
  fatherName: string;
  motherName: string;
  address: string;
  mobileNumber: string;
  email: string;
  documents: { label: string }[];
}

type AdmissionFormData = {
  id: string;
  internal_id?: string;
  student_name: string;
  gender: string;
  birth_date: string;
  course: string;
  admission_date: string;
  admission_amount: string;
  course_fee: string;
  total_amount: string;
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
};

interface EditAdmissionModalProps {
  admission: AdmissionRow;
  onClose: () => void;
  onSave: (updatedAdmission: AdmissionFormData) => void;
}

const EditAdmissionModal: React.FC<EditAdmissionModalProps> = ({
  admission,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<AdmissionFormData>({
    id: admission.id,
    internal_id: (admission as any).internalId ?? undefined,
    student_name: admission.studentName,
    gender: admission.gender,
    birth_date: admission.birthDate,
    course: admission.course,
    admission_date: admission.admissionDate,
    admission_amount: admission.admissionAmount,
    course_fee: admission.courseFee,
    total_amount: String(
      (parseFloat(admission.admissionAmount) || 0) -
        (parseFloat(admission.discountAmount) || 0) +
        (parseFloat(admission.courseFee) || 0),
    ),
    discount_amount: admission.discountAmount,
    admission_id: admission.receiptId,
    paid_amount: admission.paidAmount,
    balance_amount: admission.balanceAmount,
    payment_mode: admission.paymentMode,
    payment_status: admission.paymentStatus,
    father_name: admission.fatherName,
    mother_name: admission.motherName,
    address: admission.address,
    mobile_number: admission.mobileNumber,
    email: admission.email,
    documents: admission.documents,
  });
  console.log(admission);
  const calculateTotal = (
    admissionAmount: string,
    courseFee: string,
    discountAmount: string = "0",
  ) => {
    const amount = parseFloat(admissionAmount) || 0;
    const fee = parseFloat(courseFee) || 0;
    const discount = parseFloat(discountAmount) || 0;
    return (amount - discount + fee).toString();
  };

  const calculateBalance = (totalAmount: string, paidAmount: string) => {
    const total = parseFloat(totalAmount) || 0;
    const paid = parseFloat(paidAmount) || 0;
    return (total - paid).toString();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const nextForm = {
        ...prev,
        [name]: value,
      };

      if (
        name === "admission_amount" ||
        name === "course_fee" ||
        name === "discount_amount"
      ) {
        nextForm.total_amount = calculateTotal(
          name === "admission_amount" ? value : prev.admission_amount,
          name === "course_fee" ? value : prev.course_fee,
          name === "discount_amount" ? value : prev.discount_amount,
        );
      }

      if (
        name === "admission_amount" ||
        name === "course_fee" ||
        name === "discount_amount" ||
        name === "paid_amount"
      ) {
        const total =
          name === "admission_amount"
            ? calculateTotal(value, prev.course_fee, prev.discount_amount)
            : name === "course_fee"
              ? calculateTotal(
                  prev.admission_amount,
                  value,
                  prev.discount_amount,
                )
              : name === "discount_amount"
                ? calculateTotal(prev.admission_amount, prev.course_fee, value)
                : prev.total_amount;

        nextForm.balance_amount = calculateBalance(
          total,
          name === "paid_amount" ? value : prev.paid_amount,
        );
      }

      return nextForm;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) {
      handleSaveEdit(formData);
    }
    onSave(formData);
  };
  const handleSaveEdit = async (updatedAdmission: any) => {
    try {
      console.log("Sending:", updatedAdmission);

      const response = await updateAdmission(
        updatedAdmission.internal_id ?? updatedAdmission.id,
        updatedAdmission,
      );

      console.log("Success:", response);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[10px] bg-white p-8 shadow-xl">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#1F2937]">
            Edit Admission
          </h2>
          <button
            onClick={onClose}
            className="rounded-[10px] p-2 text-[#6B7280] hover:bg-[#F3F4F6]"
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
                name="student_name"
                value={formData.student_name}
                readOnly
                className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFB] px-4 py-3 text-sm text-[#374151] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#374151]">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                disabled
                className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFB] px-4 py-3 text-sm text-[#374151] outline-none"
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
                name="birth_date"
                value={formData.birth_date}
                readOnly
                className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFB] px-4 py-3 text-sm text-[#374151] outline-none"
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
                readOnly
                className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFB] px-4 py-3 text-sm text-[#374151] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#374151]">
                Admission Date
              </label>
              <input
                type="text"
                name="admission_date"
                value={formData.admission_date}
                readOnly
                className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFB] px-4 py-3 text-sm text-[#374151] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#374151]">
                Admission Amount
              </label>
              <input
                type="text"
                name="admission_amount"
                value={formData.admission_amount}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm text-[#374151] outline-none focus:border-[#083b9a]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#374151]">
                Course Fee
              </label>
              <input
                type="text"
                name="course_fee"
                value={formData.course_fee}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm text-[#374151] outline-none focus:border-[#083b9a]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#374151]">
                Total Amount
              </label>
              <input
                type="text"
                name="total_amount"
                value={formData.total_amount}
                readOnly
                className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFB] px-4 py-3 text-sm text-[#374151] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#374151]">
                Discount Amount
              </label>
              <input
                type="text"
                name="discount_amount"
                value={formData.discount_amount}
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
                name="admission_id"
                value={formData.admission_id}
                readOnly
                className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFB] px-4 py-3 text-sm text-[#374151] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#374151]">
                Paid Amount
              </label>
              <input
                type="text"
                name="paid_amount"
                value={formData.paid_amount}
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
                name="balance_amount"
                value={formData.balance_amount}
                readOnly
                className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFB] px-4 py-3 text-sm text-[#374151] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#374151]">
                Payment Mode
              </label>
              <select
                name="payment_mode"
                value={formData.payment_mode}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm text-[#374151] outline-none focus:border-[#083b9a]"
              >
                <option>Bank Transfer</option>
                <option>Cash</option>
                <option>Cheque</option>
                <option>Card</option>
                <option>Online</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#374151]">
                Payment Status
              </label>
              <select
                name="payment_status"
                value={formData.payment_status}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm text-[#374151] outline-none focus:border-[#083b9a]"
              >
                <option>Paid</option>
                <option>Pending</option>
                <option>Partial</option>
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
              name="father_name"
              value={formData.father_name}
              readOnly
              className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFB] px-4 py-3 text-sm text-[#374151] outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#374151]">
              Mother's Name
            </label>
            <input
              type="text"
              name="mother_name"
              value={formData.mother_name}
              readOnly
              className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFB] px-4 py-3 text-sm text-[#374151] outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#374151]">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              readOnly
              rows={3}
              className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFB] px-4 py-3 text-sm text-[#374151] outline-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#374151]">
                Mobile Number
              </label>
              <input
                type="text"
                name="mobile_number"
                value={formData.mobile_number}
                readOnly
                className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFB] px-4 py-3 text-sm text-[#374151] outline-none"
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
                readOnly
                className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFB] px-4 py-3 text-sm text-[#374151] outline-none"
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
