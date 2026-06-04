import React, { useEffect, useState } from "react";
import type { TeacherAttendance } from "../types/TeacherAttendance";
import { X } from "lucide-react";

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherAttendance | null;
  onSave: (teacher: TeacherAttendance) => void;
}

const ActionModal: React.FC<ActionModalProps> = ({
  isOpen,
  onClose,
  teacher,
  onSave,
}) => {
  const [formData, setFormData] =
    useState<TeacherAttendance | null>(null);

  useEffect(() => {
    setFormData(teacher);
  }, [teacher]);

  if (!isOpen || !formData) return null;

  const handleSave = () => {
    onSave(formData);
  };



  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="bg-white w-[500px] rounded-xl shadow-lg p-6">

        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-xl font-semibold">
            Edit Attendance
          </h2>

          <button onClick={onClose} title="Close">
            <X size={20} />
          </button>
        </div>

        <div className="mt-6">

          <p className="mb-2 font-medium">
            Status
          </p>

          <div className="flex gap-4 flex-wrap">

            {["Present", "Absent", "Late", "Half Day"].map(
              (status) => (
                <label
                  key={status}
                  className="flex items-center gap-2"
                >
                  <input
                    type="radio"
                    name="status"
                    checked={formData.status === status}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        status:
                          status as TeacherAttendance["status"],
                      })
                    }
                  />
                  {status}
                </label>
              )
            )}

          </div>

          <div className="mt-4">

            <label htmlFor="checkIn" className="block mb-2">
              Check In
            </label>

            <input
              id="checkIn"
              value={formData.checkIn}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  checkIn: e.target.value,
                })
              }
              placeholder="Check In"
              className="w-full h-[40px] border rounded-md px-3"
            />

          </div>

          <div className="mt-4">

            <label htmlFor="checkOut" className="block mb-2">
              Check Out
            </label>

            <input
              id="checkOut"
              value={formData.checkOut}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  checkOut: e.target.value,
                })
              }
              placeholder="Check Out"
              className="w-full h-[40px] border rounded-md px-3"
            />

          </div>

          <div className="mt-4">

            <label htmlFor="remark" className="block mb-2">
              Remarks
            </label>

            <input
              id="remark"
              value={formData.remark}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  remark: e.target.value,
                })
              }
              placeholder="Remarks"
              className="w-full h-[40px] border rounded-md px-3"
            />

          </div>

          <button
            onClick={handleSave}
className="mt-6 w-full h-[44px] bg-gradient-to-r from-[#2087FF] to-[#135199] text-white rounded-md"          >
            Save
          </button>

        </div>
      </div>
    </div>
  );
};

export default ActionModal;