import { X } from "lucide-react";

export type SubstituteDetails = {
  id: string;
  regularTeacher: string;
  substituteTeacher: string;
  batch: string;
  section: string;
  date: string;
  reason: string;
  reasonDescription?: string;
};

type SubstituteDetailsModalProps = {
  substitute: SubstituteDetails;
  onClose: () => void;
};

const SubstituteDetailsModal = ({
  substitute,
  onClose,
}: SubstituteDetailsModalProps) => {
  const reasonDescription =
    substitute.reasonDescription ??
    "Regular teacher has requested medical leave for personal health reasons. Expected to return on May 28, 2026.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-6">
      <div className="relative h-auto max-h-[90vh] w-full max-w-[968px] overflow-y-auto rounded-[20px] bg-[#FCF8FA] px-9 py-9 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close substitute details"
          className="absolute right-8 top-8 flex h-8 w-8 items-center justify-center rounded-full text-black transition hover:bg-black/5"
        >
          <X size={28} strokeWidth={2.25} />
        </button>

        <div className="pr-12">
          <h2 className="text-[24px] font-semibold leading-tight text-black">
            Substitute Details
          </h2>
          <p className="mt-2 text-[16px] font-normal text-[#2F2F2F]">
            View and manage substitute assignment
          </p>
        </div>

        <div className="mt-7 rounded-[8px] border border-[#D3D3D3] bg-transparent px-10 py-4">
          <h3 className="text-[18px] font-semibold text-black">
            Assignment Information
          </h3>

          <div className="mt-8 grid gap-x-20 gap-y-5 md:grid-cols-2">
            <div className="space-y-5">
              <DetailItem label="Substitute ID" value={substitute.id} />
              <DetailItem
                label="Substitute Teacher"
                value={substitute.substituteTeacher}
              />
              <DetailItem label="Section" value={substitute.section} />
              <DetailItem label="Reason" value={substitute.reason} />
            </div>

            <div className="space-y-5">
              <DetailItem
                label="Regular Teacher"
                value={substitute.regularTeacher}
              />
              <DetailItem label="Batch" value={substitute.batch} />
              <DetailItem label="Date" value={substitute.date} />
            </div>
          </div>

          <div className="my-7 h-px bg-[#D6D2D2]" />

          <div>
            <h4 className="text-[15px] font-normal text-black">
              Reason for Substitution
            </h4>
            <div className="mt-3 rounded-[8px] bg-[#F8CDD1] px-4 py-2">
              <p className="text-[12px] font-normal leading-5 text-red-600">
                {substitute.reason}
              </p>
              <p className="text-[11px] font-normal leading-4 text-[#4A4A4A]">
                {reasonDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-[15px] font-normal leading-6 text-[#4B5563]">{label}</p>
    <p className="mt-1 text-[15px] font-medium leading-6 text-[#111111]">
      {value}
    </p>
  </div>
);

export default SubstituteDetailsModal;
