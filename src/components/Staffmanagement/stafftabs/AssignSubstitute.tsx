import React from "react";
import { Check } from "lucide-react";
import type { SubstituteDetails } from "../SubstituteDetailsModal";

type AbsentTeacher = {
  id: string;
  name: string;
  subject: string;
  reason: string;
  date: string;
};

type TimetableRow = {
  teacherId: string;
  period: string;
  batch: string;
  className: string;
  subject: string;
};

type FreeTeacher = {
  teacherId: string;
  teacherName: string;
  department: string;
  subject: string;
  currentStatus: string;
  workload: string;
};

const absentTeachers: AbsentTeacher[] = [
  {
    id: "TCH003",
    name: "Sarah Johnson",
    subject: "Mathematics",
    reason: "Medical Leave",
    date: "30-05-2026",
  },
  {
    id: "TCH005",
    name: "Mrs. Priya Sharma",
    subject: "English",
    reason: "Personal Emergency",
    date: "30-05-2026",
  },
];

const timetableRows: TimetableRow[] = [
  {
    teacherId: "TCH003",
    period: "Period 1",
    batch: "2024 Batch",
    className: "Class 10-A",
    subject: "Mathematics",
  },
  {
    teacherId: "TCH005",
    period: "Period 2",
    batch: "2024 Batch",
    className: "Class 9-A",
    subject: "Mathematics",
  },
];

const freeTeachers: FreeTeacher[] = [
  {
    teacherId: "TCH003",
    teacherName: "Michael Chen",
    department: "Science",
    subject: "Physics, Mathematics",
    currentStatus: "Free",
    workload: "3 classes",
  },
  {
    teacherId: "TCH005",
    teacherName: "Lisa Martinez",
    department: "Science",
    subject: "Physics, Mathematics",
    currentStatus: "Free",
    workload: "2 classes",
  },
];

const steps = [
  { number: 1, label: "Select Class" },
  { number: 2, label: "Teacher Timetable" },
  { number: 3, label: "Free Teacher" },
];

type AssignSubstituteProps = {
  onSubstituteAssigned?: (assignment: SubstituteDetails) => void;
};

const AssignSubstitute = ({ onSubstituteAssigned }: AssignSubstituteProps) => {
  const [step, setStep] = React.useState(1);
  const [selectedTeacher, setSelectedTeacher] = React.useState(absentTeachers[0]);
  const [selectedTimetable, setSelectedTimetable] = React.useState(timetableRows[0]);

  const handleAssign = (teacher: AbsentTeacher) => {
    setSelectedTeacher(teacher);
    setStep(2);
  };

  const handleNeedSubstitute = (row: TimetableRow) => {
    setSelectedTimetable(row);
    setStep(3);
  };

  const handleSelectTeacher = (teacher: FreeTeacher) => {
    onSubstituteAssigned?.(
      createSubstituteAssignment(selectedTeacher, selectedTimetable, teacher)
    );
    setStep(1);
  };

  return (
    <div className="space-y-3">
      <div className="rounded-[10px] bg-white px-8 py-4">
        <div className="mx-auto flex max-w-[720px] items-center justify-center text-[16px]">
          {steps.map((item, index) => {
            const isComplete = step > item.number;
            const isActive = step === item.number;

            return (
              <React.Fragment key={item.number}>
                <div className="flex items-center whitespace-nowrap">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-[24px] font-medium ${
                      isComplete
                        ? "bg-[#10B826] text-white"
                        : isActive
                          ? "bg-[#2F80ED] text-white"
                          : "bg-[#E8E8E8] text-[#A8A8A8]"
                    }`}
                  >
                    {isComplete ? <Check size={24} strokeWidth={2.3} /> : item.number}
                  </div>
                  <span
                    className={`ml-2 text-[16px] font-normal ${
                      isActive || isComplete ? "text-[#252525]" : "text-[#8C8C8C]"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>

                {index !== steps.length - 1 && (
                  <div className="mx-7 h-px min-w-[70px] flex-1 bg-[#D8D8D8]" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="rounded-[10px] bg-white px-6 py-6">
        {step === 1 && <StepOne onAssign={handleAssign} />}
        {step === 2 && (
          <StepTwo
            selectedTeacher={selectedTeacher}
            onBack={() => setStep(1)}
            onNeedSubstitute={handleNeedSubstitute}
          />
        )}
        {step === 3 && (
          <StepThree
            onBack={() => setStep(2)}
            onSelectTeacher={handleSelectTeacher}
            selectedTimetable={selectedTimetable}
          />
        )}
      </div>
    </div>
  );
};

const StepOne = ({ onAssign }: { onAssign: (teacher: AbsentTeacher) => void }) => {
  return (
    <div>
      <h3 className="mb-6 text-[16px] font-medium text-[#2F2F2F]">
        Step 1: Today&apos;s Absent Teachers
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="border-b text-[#767676]">
            <tr>
              <th className="py-3 text-left">Teacher ID</th>
              <th className="text-left">Teacher Name</th>
              <th className="text-left">Subject</th>
              <th className="text-left">Reason</th>
              <th className="text-left">Date</th>
              <th className="text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {absentTeachers.map((teacher) => (
              <tr key={teacher.id} className="border-b">
                <td className="py-4 text-[#454545]">{teacher.id}</td>
                <td className="text-[#2F2F2F]">{teacher.name}</td>
                <td className="text-[#454545]">{teacher.subject}</td>
                <td>
                  <span className="rounded-full border border-orange-300 px-3 py-1 text-xs text-orange-500">
                    {teacher.reason}
                  </span>
                </td>
                <td className="text-[#454545]">{teacher.date}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => onAssign(teacher)}
                    className="rounded-[6px] border border-blue-500 px-3 py-1 text-xs text-blue-500 transition hover:bg-blue-50"
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StepTwo = ({
  selectedTeacher,
  onBack,
  onNeedSubstitute,
}: {
  selectedTeacher: AbsentTeacher;
  onBack: () => void;
  onNeedSubstitute: (row: TimetableRow) => void;
}) => {
  return (
    <div>
      <h3 className="mb-5 text-[16px] font-normal text-[#161616]">
        Step 2: Regular Teacher Timetable ({selectedTeacher.name} - May{" "}
        {selectedTeacher.date})
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-[15px]">
          <thead className="border-b border-[#D6D6D6] text-[#4B5563]">
            <tr>
              <th className="px-9 py-3 text-left font-semibold">Teacher ID</th>
              <th className="px-8 text-left font-semibold">Period</th>
              <th className="px-8 text-left font-semibold">Batch</th>
              <th className="px-8 text-left font-semibold">Class</th>
              <th className="px-8 text-left font-semibold">Subject</th>
              <th className="px-8 text-left font-semibold">Status</th>
            </tr>
          </thead>

          <tbody>
            {timetableRows.map((row) => (
              <tr key={`${row.teacherId}-${row.period}`} className="border-b border-[#E4E4E4]">
                <td className="px-9 py-4 text-[#454545]">{row.teacherId}</td>
                <td className="px-8 text-[#454545]">{row.period}</td>
                <td className="px-8 font-medium text-[#454545]">{row.batch}</td>
                <td className="px-8 font-medium text-[#454545]">{row.className}</td>
                <td className="px-8 text-[#454545]">{row.subject}</td>
                <td className="px-8">
                  <button
                    type="button"
                    onClick={() => onNeedSubstitute(row)}
                    className="rounded-[6px] border border-red-500 px-3 py-1 text-[15px] font-medium leading-none text-red-500 transition hover:bg-red-50"
                  >
                    Need Substitute
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-16 flex justify-end pr-9">
        <button
          type="button"
          onClick={onBack}
          className="h-8 w-[91px] rounded-[4px] bg-[#D9D9D9] text-[13px] font-medium text-[#333333] transition hover:bg-[#CCCCCC]"
        >
          Back
        </button>
      </div>
    </div>
  );
};

const StepThree = ({
  selectedTimetable,
  onBack,
  onSelectTeacher,
}: {
  selectedTimetable: TimetableRow;
  onBack: () => void;
  onSelectTeacher: (teacher: FreeTeacher) => void;
}) => {
  return (
    <div>
      <h3 className="mb-5 text-[16px] font-normal text-[#161616]">
        Step 3: Available Teachers ({selectedTimetable.period} : 09:00 - 10:00)
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-[15px]">
          <thead className="border-b border-[#D6D6D6] text-[#4B5563]">
            <tr>
              <th className="px-5 py-3 text-left font-semibold">Teacher ID</th>
              <th className="px-5 text-left font-semibold">Teacher Name</th>
              <th className="px-5 text-left font-semibold">Department</th>
              <th className="px-5 text-left font-semibold">Subject</th>
              <th className="px-5 text-left font-semibold">Current Status</th>
              <th className="px-5 text-left font-semibold">Today&apos;s Workload</th>
              <th className="px-5 text-left font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {freeTeachers.map((teacher) => (
              <tr key={teacher.teacherId} className="border-b border-[#E4E4E4]">
                <td className="px-5 py-4 font-medium text-[#454545]">
                  {teacher.teacherId}
                </td>
                <td className="px-5 font-medium text-[#454545]">
                  {teacher.teacherName}
                </td>
                <td className="px-5 font-medium text-[#454545]">
                  {teacher.department}
                </td>
                <td className="px-5 font-medium text-[#454545]">
                  {teacher.subject}
                </td>
                <td className="px-5">
                  <span className="rounded-[6px] border border-[#22C55E] px-3 py-1 text-[15px] font-normal leading-none text-[#16A34A]">
                    {teacher.currentStatus}
                  </span>
                </td>
                <td className="px-5 font-medium text-[#454545]">
                  {teacher.workload}
                </td>
                <td className="px-5">
                  <button
                    type="button"
                    onClick={() => onSelectTeacher(teacher)}
                    className="h-8 min-w-[108px] rounded-[5px] bg-black px-2 text-[12px] font-medium text-white transition hover:bg-[#222222]"
                  >
                    Select Teacher
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-16 flex justify-end pr-7">
        <button
          type="button"
          onClick={onBack}
          className="h-9 w-[99px] rounded-[4px] bg-[#D9D9D9] text-[13px] font-medium text-[#333333] transition hover:bg-[#CCCCCC]"
        >
          Back
        </button>
      </div>
    </div>
  );
};

const createSubstituteAssignment = (
  absentTeacher: AbsentTeacher,
  timetable: TimetableRow,
  freeTeacher: FreeTeacher
): SubstituteDetails => {
  const section = timetable.className.split("-").pop() ?? "A";
  const batchYear = timetable.batch.split(" ")[0] ?? timetable.batch;

  return {
    id: freeTeacher.teacherId,
    regularTeacher: absentTeacher.name,
    substituteTeacher: freeTeacher.teacherName,
    batch: `${batchYear}-${section}`,
    section,
    date: formatAssignmentDate(absentTeacher.date),
    reason: absentTeacher.reason,
    reasonDescription: `${absentTeacher.name} is unavailable due to ${absentTeacher.reason.toLowerCase()}. ${freeTeacher.teacherName} has been assigned for ${timetable.period} in ${timetable.className}.`,
  };
};

const formatAssignmentDate = (date: string) => {
  const [day, month, year] = date.split("-");
  return `${year}-${month}-${day}`;
};

export default AssignSubstitute;
