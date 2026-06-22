import React from "react";
import { ArrowLeft, Download } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface AdmissionDetailProps {
  admission: {
    id: string;
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
  };
  onBack: () => void;
}

const FinanceAdmissionDetail: React.FC<AdmissionDetailProps> = ({
  admission,
  onBack,
}) => {
  return (
    <div className="rounded-[10px] bg-white p-6 shadow-sm">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-[10px] border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#F8FAFB]"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <button className="inline-flex items-center gap-2 rounded-[10px] bg-white px-4 py-2 text-sm font-medium text-[#374151] shadow-sm hover:bg-[#F8FAFB] border border-[#E5E7EB]">
          <Download size={16} />
          Download Receipt
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[10px] border border-[#E5E7EB] bg-[#F8F8F8] p-6">
          <h3 className="mb-4 text-lg font-semibold text-[#1F2937]">
            Academic
          </h3>
          <div className="grid gap-3 text-sm text-[#374151] md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase text-[#6B7280]">
                ADM ID
              </p>
              <p className="font-semibold">{admission.id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase text-[#6B7280]">
                STD Name
              </p>
              <p className="font-semibold">{admission.studentName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase text-[#6B7280]">
                Gender
              </p>
              <p className="font-semibold">{admission.gender}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase text-[#6B7280]">
                Date of Birth
              </p>
              <p className="font-semibold">{admission.birthDate}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase text-[#6B7280]">
                Course
              </p>
              <p className="font-semibold">{admission.course}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase text-[#6B7280]">
                Admission Date
              </p>
              <p className="font-semibold">{admission.admissionDate}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase text-[#6B7280]">
                Admission Amount
              </p>
              <p className="font-semibold">{admission.admissionAmount}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase text-[#6B7280]">
                Course Fee
              </p>
              <p className="font-semibold">{admission.courseFee}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase text-[#6B7280]">
                Discount Amount
              </p>
              <p className="font-semibold">{admission.discountAmount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[10px] border border-[#E5E7EB] bg-[#F8F8F8] p-6">
          <h3 className="mb-4 text-lg font-semibold text-[#1F2937]">Payment</h3>
          <div className="grid gap-3 text-sm text-[#374151] md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase text-[#6B7280]">
                Receipt ID
              </p>
              <p className="font-semibold">{admission.receiptId}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase text-[#6B7280]">
                Paid Amount
              </p>
              <p className="font-semibold">{admission.paidAmount}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase text-[#6B7280]">
                Balance Amount
              </p>
              <p className="font-semibold">{admission.balanceAmount}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase text-[#6B7280]">
                Payment Mode
              </p>
              <p className="font-semibold">{admission.paymentMode}</p>
            </div>
            <div className="space-y-1 col-span-2">
              <p className="text-xs font-medium uppercase text-[#6B7280]">
                Payment Status
              </p>
              <StatusBadge
                label={admission.paymentStatus}
                variant={
                  admission.paymentStatus === "Paid"
                    ? "paid"
                    : admission.paymentStatus === "Failed"
                      ? "failed"
                      : "pending"
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-[10px] border border-[#E5E7EB] bg-[#F8F8F8] p-6">
          <h3 className="mb-4 text-lg font-semibold text-[#1F2937]">
            Personal
          </h3>
          <div className="grid gap-3 text-sm text-[#374151]">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase text-[#6B7280]">
                Father’s name
              </p>
              <p className="font-semibold">{admission.fatherName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase text-[#6B7280]">
                Mother’s name
              </p>
              <p className="font-semibold">{admission.motherName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase text-[#6B7280]">
                Address
              </p>
              <p className="font-semibold whitespace-pre-line">
                {admission.address}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase text-[#6B7280]">
                  Mobile Number
                </p>
                <p className="font-semibold">{admission.mobileNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase text-[#6B7280]">
                  Email
                </p>
                <p className="font-semibold">{admission.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[10px] border border-[#E5E7EB] bg-[#F8F8F8] p-6">
          <h3 className="mb-4 text-lg font-semibold text-[#1F2937]">
            Documents
          </h3>
          <div className="space-y-3">
            {admission.documents.map((doc) => (
              <button
                key={doc.label}
                className="flex items-center justify-between rounded-[10px] border border-[#E5E7EB] bg-white px-4 py-4 text-left text-sm font-medium text-[#374151] hover:bg-[#F8FAFB] w-full"
              >
                <span>{doc.label}</span>
                <Download size={16} className="text-[#6B7280]" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceAdmissionDetail;
