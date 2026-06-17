import React from "react";
import { Check, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import type { SubstituteDetails } from "../SubstituteDetailsModal";
import api from "../../../api/axios";

type AbsentTeacher = {
  id: string;
  name: string;
  subject: string;
  reason: string;
  date: string;
  teacher_id?: number;
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

const getNoTimetableMessage = (errorResponse: any): string | null => {
  if (!errorResponse) return null;
  let data = errorResponse.data;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (e) {
      return null;
    }
  }
  if (
    data &&
    (data.status === false || !data.status) &&
    data.message &&
    typeof data.message === "string" &&
    data.message.toLowerCase().includes("no timetable found")
  ) {
    return data.message;
  }
  return null;
};

const AssignSubstitute = ({ onSubstituteAssigned }: AssignSubstituteProps) => {
  const [step, setStep] = React.useState(1);
  const [teachersList, setTeachersList] = React.useState<AbsentTeacher[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const [selectedTeacher, setSelectedTeacher] = React.useState<AbsentTeacher | null>(null);
  const [selectedTimetable, setSelectedTimetable] = React.useState<TimetableRow | null>(null);

  const [timetableList, setTimetableList] = React.useState<TimetableRow[]>([]);
  const [isTimetableLoading, setIsTimetableLoading] = React.useState(false);
  const [timetableError, setTimetableError] = React.useState<string | null>(null);
  const [timetableEmptyMessage, setTimetableEmptyMessage] = React.useState<string | null>(null);

  const fetchAbsentTeachers = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setFetchError(null);
      const response = await api.get("/todays-absent-teachers/");
      if (response.data && response.data.status) {
        const mapped: AbsentTeacher[] = (response.data.absent_teachers || []).map((t: any) => ({
          id: t.user_id || String(t.teacher_id),
          name: t.teacher_name || "Unknown",
          subject: t.role || "Teacher",
          reason: t.leave_reason || "Not specified",
          date: t.leave_start_date || response.data.date || "",
          teacher_id: t.teacher_id,
        }));
        setTeachersList(mapped);
      } else {
        setFetchError(response.data?.message || "Failed to fetch today's absent teachers.");
      }
    } catch (err: any) {
      console.error("Error fetching absent teachers:", err);
      setFetchError(
        err?.response?.data?.message ||
        err?.message ||
        "An error occurred while fetching absent teachers."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTeacherTimetable = React.useCallback(async (teacherId: number | string) => {
    try {
      setIsTimetableLoading(true);
      setTimetableError(null);
      setTimetableEmptyMessage(null);
      
      let response;
      const urlWithSlash = `/teacher-todays-timetable/${teacherId}/`;
      
      try {
        response = await api.get(urlWithSlash);
      } catch (err: any) {
        const msg = getNoTimetableMessage(err?.response);
        if (msg) {
          response = { data: { status: false, message: msg } };
        } else if (err?.response?.status === 404) {
          // Retry without trailing slash if it was a generic 404
          const urlWithoutSlash = `/teacher-todays-timetable/${teacherId}`;
          try {
            response = await api.get(urlWithoutSlash);
          } catch (retryErr: any) {
            const retryMsg = getNoTimetableMessage(retryErr?.response);
            if (retryMsg) {
              response = { data: { status: false, message: retryMsg } };
            } else {
              throw retryErr;
            }
          }
        } else {
          throw err;
        }
      }

      if (response.data) {
        if (response.data.status) {
          const mapped: TimetableRow[] = (response.data.data || []).map((item: any) => {
            const className = item.class_assigned
              ? `${item.class_assigned.class_name}-${item.class_assigned.section}`
              : "Unknown";
            return {
              id: item.id,
              teacherId: String(teacherId),
              period: item.period ? `Period ${item.period}` : "Unknown",
              batch: "2024 Batch",
              className: className,
              subject: item.subject || "Unknown",
            };
          });
          setTimetableList(mapped);
        } else {
          setTimetableList([]);
          setTimetableEmptyMessage(response.data.message || "No timetable found.");
        }
      } else {
        setTimetableError("Failed to fetch today's timetable.");
      }
    } catch (err: any) {
      const msg = getNoTimetableMessage(err?.response);
      if (msg) {
        setTimetableList([]);
        setTimetableEmptyMessage(msg);
      } else {
        console.error("Error fetching teacher timetable:", err);
        setTimetableError(
          err?.response?.data?.message ||
          err?.message ||
          "An error occurred while fetching teacher timetable."
        );
      }
    } finally {
      setIsTimetableLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAbsentTeachers();
  }, [fetchAbsentTeachers]);

  React.useEffect(() => {
  if (selectedTeacher?.teacher_id) {
    fetchTeacherTimetable(selectedTeacher.teacher_id);
  }
}, [selectedTeacher, fetchTeacherTimetable]); 

  const handleAssign = (teacher: AbsentTeacher) => {
    setSelectedTeacher(teacher);
    setStep(2);
  };

  const handleNeedSubstitute = (row: TimetableRow) => {
    setSelectedTimetable(row);
    setStep(3);
  };

  const handleSelectTeacher = (teacher: FreeTeacher) => {
    if (!selectedTeacher || !selectedTimetable) return;
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
        {step === 1 && (
          <StepOne
            teachers={teachersList}
            isLoading={isLoading}
            error={fetchError}
            onAssign={handleAssign}
            onRetry={fetchAbsentTeachers}
          />
        )}
        {step === 2 && selectedTeacher && (
          <StepTwo
            selectedTeacher={selectedTeacher}
            timetableRows={timetableList}
            isLoading={isTimetableLoading}
            error={timetableError}
            emptyMessage={timetableEmptyMessage}
            onBack={() => setStep(1)}
            onNeedSubstitute={handleNeedSubstitute}
            onRetry={() => {
              const idToFetch = selectedTeacher.teacher_id || selectedTeacher.id;
              fetchTeacherTimetable(idToFetch);
            }}
          />
        )}
        {step === 3 && selectedTimetable && (
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

const StepOne = ({
  teachers,
  isLoading,
  error,
  onAssign,
  onRetry,
}: {
  teachers: AbsentTeacher[];
  isLoading: boolean;
  error: string | null;
  onAssign: (teacher: AbsentTeacher) => void;
  onRetry: () => void;
}) => {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-[16px] font-medium text-[#2F2F2F]">
          Step 1: Today&apos;s Absent Teachers
        </h3>
        <button
          onClick={onRetry}
          disabled={isLoading}
          className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 disabled:opacity-50"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="border-b text-[#767676]">
            <tr>
              <th className="py-3 text-left">Teacher ID</th>
              <th className="text-left">Teacher Name</th>
              <th className="text-left">Role / Designation</th>
              <th className="text-left">Leave Reason</th>
              <th className="text-left">Date</th>
              <th className="text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-10 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                    <Loader2 className="animate-spin text-blue-500" size={24} />
                    <span>Fetching today's absent teachers...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="py-10 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-red-500">
                    <AlertCircle size={24} />
                    <span className="font-medium">Error loading list</span>
                    <span className="text-xs text-gray-500">{error}</span>
                    <button
                      onClick={onRetry}
                      className="mt-2 rounded bg-red-100 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-200"
                    >
                      Retry
                    </button>
                  </div>
                </td>
              </tr>
            ) : teachers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-500">
                  No absent teachers recorded for today.
                </td>
              </tr>
            ) : (
              teachers.map((teacher) => (
                <tr key={teacher.id} className="border-b">
                  <td className="py-4 text-[#454545]">{teacher.id}</td>
                  <td className="text-[#2F2F2F]">{teacher.name}</td>
                  <td className="text-[#454545]">{teacher.subject}</td>
                  <td>
                    <span className="rounded-full border border-orange-300 px-3 py-1 text-xs text-orange-500 bg-orange-50/50">
                      {teacher.reason}
                    </span>
                  </td>
                  <td className="text-[#454545]">{formatDateForDisplay(teacher.date)}</td>
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StepTwo = ({
  selectedTeacher,
  timetableRows,
  isLoading,
  error,
  emptyMessage,
  onBack,
  onNeedSubstitute,
  onRetry,
}: {
  selectedTeacher: AbsentTeacher;
  timetableRows: TimetableRow[];
  isLoading: boolean;
  error: string | null;
  emptyMessage: string | null;
  onBack: () => void;
  onNeedSubstitute: (row: TimetableRow) => void;
  onRetry: () => void;
}) => {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-[16px] font-normal text-[#161616]">
          Step 2: Regular Teacher Timetable ({selectedTeacher.name} - {formatDateForDisplay(selectedTeacher.date)})
        </h3>
        <button
          onClick={onRetry}
          disabled={isLoading}
          className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 disabled:opacity-50"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

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
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-10 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                    <Loader2 className="animate-spin text-blue-500" size={24} />
                    <span>Fetching teacher's timetable...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="py-10 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-red-500">
                    <AlertCircle size={24} />
                    <span className="font-medium">Error loading timetable</span>
                    <span className="text-xs text-gray-500">{error}</span>
                    <button
                      onClick={onRetry}
                      className="mt-2 rounded bg-red-100 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-200"
                    >
                      Retry
                    </button>
                  </div>
                </td>
              </tr>
            ) : timetableRows.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-500">
                  {emptyMessage || "No classes scheduled for this teacher today."}
                </td>
              </tr>
            ) : (
              timetableRows.map((row) => (
                <tr key={`${row.teacherId}-${row.period}-${row.id || row.className}`} className="border-b border-[#E4E4E4]">
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
              ))
            )}
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
  if (!date) return "";
  const parts = date.split("-");
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      // YYYY-MM-DD -> YYYY-MM-DD
      return date;
    }
    // DD-MM-YYYY -> YYYY-MM-DD
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  }
  return date;
};

const formatDateForDisplay = (dateStr: string) => {
  if (!dateStr) return "";
  try {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        // YYYY-MM-DD
        const [year, month, day] = parts;
        const d = new Date(Number(year), Number(month) - 1, Number(day));
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      } else {
        // DD-MM-YYYY
        const [day, month, year] = parts;
        const d = new Date(Number(year), Number(month) - 1, Number(day));
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      }
    }
  } catch (e) {
    // fallback
  }
  return dateStr;
};

export default AssignSubstitute;
