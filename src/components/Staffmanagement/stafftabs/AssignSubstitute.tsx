import React from "react";
import { Check, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import type { SubstituteDetails } from "../SubstituteDetailsModal";
import api from "../../../api/axios";
import { toast } from "react-toastify";

type AbsentTeacher = {
  id: string;
  name: string;
  subject: string;
  reason: string;
  date: string;
  teacher_id?: number;
};

type TimetableRow = {
  id?: number;       // timetable entry id from the API
  classId?: number;  // class_assigned.id — needed for available-teachers payload
  rawPeriod?: string;// raw period number string ("8") — needed for available-teachers payload
  teacherId: string;
  period: string;    // display string e.g. "Period 8"
  batch: string;
  className: string;
  subject: string;
};

// Shape returned by /available-teachers-list/
type AvailableTeacher = {
  teacher_id: number;
  teacher_name: string;
  user_id: string;
};

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

  // Step 3 — available substitute teachers
  const [availableTeachers, setAvailableTeachers] = React.useState<AvailableTeacher[]>([]);
  const [isAvailableLoading, setIsAvailableLoading] = React.useState(false);
  const [availableError, setAvailableError] = React.useState<string | null>(null);
  const [isAssigning, setIsAssigning] = React.useState(false);

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

      console.log(`📅 Fetching timetable for teacher_id: ${teacherId}`);

      let response;
      try {
        response = await api.get(`/teacher-todays-timetable/${teacherId}/`);
      } catch (err: any) {
        const status = err?.response?.status;
        const data   = err?.response?.data;

        // ── Any 404 → no timetable today (expected backend behaviour) ──
        if (status === 404) {
         const msg =
  (typeof data === "object" && data !== null
    ? data.message || data.detail
    : null) || "No timetable found for today.";

// 👇 Improve here
setTimetableEmptyMessage(
  "No classes scheduled for today 📅"
);
          setTimetableEmptyMessage(msg);
          return;
        }

        // ── Backend returned status:false with a "no timetable" message ──
        const friendlyMsg = getNoTimetableMessage(err?.response);
        if (friendlyMsg) {
          setTimetableList([]);
          setTimetableEmptyMessage(friendlyMsg);
          return;
        }

        throw err; // real network / auth error — let outer catch handle it
      }

      if (response?.data?.status) {
        const mapped: TimetableRow[] = (response.data.data || []).map((item: any) => {
          const className = item.class_assigned
            ? `${item.class_assigned.class_name}-${item.class_assigned.section}`
            : "Unknown";
          return {
            id:        item.id,
            classId:   item.class_assigned?.id,           // needed for Step 3 payload
            rawPeriod: item.period ? String(item.period) : undefined, // raw "8" for payload
            teacherId: String(teacherId),
            period:    item.period ? `Period ${item.period}` : "Unknown",
            batch:     "2024 Batch",
            className,
            subject:   item.subject || "Unknown",
          };
        });
        setTimetableList(mapped);
      } else {
        setTimetableList([]);
        setTimetableEmptyMessage(response?.data?.message || "No timetable found for today.");
      }
    } catch (err: any) {
      console.error("Error fetching teacher timetable:", err);
      setTimetableError(
        err?.response?.data?.message ||
        err?.response?.data?.detail  ||
        err?.message ||
        "An error occurred while fetching the timetable."
      );
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

  const fetchAvailableTeachers = React.useCallback(
    async (row: TimetableRow, absentTeacherId: number | string) => {
      try {
        setIsAvailableLoading(true);
        setAvailableError(null);
        setAvailableTeachers([]);

        const payload = {
          teacher_id: String(absentTeacherId),
          period:     row.rawPeriod ?? row.period.replace("Period ", ""),
          class_id:   String(row.classId ?? ""),
        };

        console.log("📤 available-teachers payload:", payload);

        const res = await api.post("/available-teachers-list/", payload);

        if (res.data?.status) {
          setAvailableTeachers(res.data.available_teachers || []);
        } else {
          setAvailableError(res.data?.message || "No available teachers found.");
        }
      } catch (err: any) {
        console.error("Error fetching available teachers:", err);
        setAvailableError(
          err?.response?.data?.message ||
          err?.response?.data?.detail ||
          err?.message ||
          "Failed to load available teachers."
        );
      } finally {
        setIsAvailableLoading(false);
      }
    },
    []
  );

  const handleNeedSubstitute = (row: TimetableRow) => {
    setSelectedTimetable(row);
    setStep(3);
    // Fetch available teachers immediately when entering Step 3
    if (selectedTeacher?.teacher_id) {
      fetchAvailableTeachers(row, selectedTeacher.teacher_id);
    }
  };

  const handleSelectTeacher = async (teacher: AvailableTeacher) => {
    if (!selectedTeacher || !selectedTimetable) return;

    try {
      setIsAssigning(true);

      const payload = {
        class_id:              String(selectedTimetable.classId ?? ""),
        substitute_teacher_id: teacher.teacher_id,
        period:                selectedTimetable.rawPeriod ?? selectedTimetable.period.replace("Period ", ""),
        original_teacher_id:   selectedTeacher.teacher_id as number,
        date:                  formatAssignmentDate(selectedTeacher.date),
      };

      console.log("📤 assign-substitute payload:", payload);

      const res = await api.post("/assign-substitute-teacher/", payload);

      if (res.data?.status) {
        toast.success(res.data.message || "Substitute teacher assigned successfully!");
        onSubstituteAssigned?.(
          createSubstituteAssignment(selectedTeacher, selectedTimetable, teacher)
        );
        // Reset wizard back to step 1
        setStep(1);
        setSelectedTeacher(null);
        setSelectedTimetable(null);
        setTimetableList([]);
        setAvailableTeachers([]);
      } else {
        toast.error(res.data?.message || "Failed to assign substitute teacher.");
      }
    } catch (err: any) {
      console.error("Error assigning substitute teacher:", err);
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        "An error occurred while assigning the substitute teacher."
      );
    } finally {
      setIsAssigning(false);
    }
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
            selectedTimetable={selectedTimetable}
            availableTeachers={availableTeachers}
            isLoading={isAvailableLoading}
            isAssigning={isAssigning}
            error={availableError}
            onBack={() => setStep(2)}
            onSelectTeacher={handleSelectTeacher}
            onRetry={() => {
              if (selectedTeacher?.teacher_id) {
                fetchAvailableTeachers(selectedTimetable, selectedTeacher.teacher_id);
              }
            }}
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
  availableTeachers,
  isLoading,
  isAssigning,
  error,
  onBack,
  onSelectTeacher,
  onRetry,
}: {
  selectedTimetable: TimetableRow;
  availableTeachers: AvailableTeacher[];
  isLoading: boolean;
  isAssigning: boolean;
  error: string | null;
  onBack: () => void;
  onSelectTeacher: (teacher: AvailableTeacher) => void;
  onRetry: () => void;
}) => {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-[16px] font-normal text-[#161616]">
          Step 3: Available Substitute Teachers — {selectedTimetable.period} &bull; {selectedTimetable.className}
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
        <table className="w-full min-w-[600px] text-[15px]">
          <thead className="border-b border-[#D6D6D6] text-[#4B5563]">
            <tr>
              <th className="px-5 py-3 text-left font-semibold">Teacher ID</th>
              <th className="px-5 text-left font-semibold">Staff ID</th>
              <th className="px-5 text-left font-semibold">Teacher Name</th>
              <th className="px-5 text-left font-semibold">Status</th>
              <th className="px-5 text-left font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-10 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                    <Loader2 className="animate-spin text-blue-500" size={24} />
                    <span>Finding available teachers...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="py-10 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-red-500">
                    <AlertCircle size={24} />
                    <span className="font-medium">Failed to load teachers</span>
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
            ) : availableTeachers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-500">
                  No available teachers found for this period.
                </td>
              </tr>
            ) : (
              availableTeachers.map((teacher) => (
                <tr key={teacher.teacher_id} className="border-b border-[#E4E4E4]">
                  <td className="px-5 py-4 font-medium text-[#454545]">
                    {teacher.teacher_id}
                  </td>
                  <td className="px-5 text-[#454545]">
                    {teacher.user_id}
                  </td>
                  <td className="px-5 font-medium text-[#454545]">
                    {teacher.teacher_name}
                  </td>
                  <td className="px-5">
                    <span className="rounded-[6px] border border-[#22C55E] px-3 py-1 text-[14px] font-normal leading-none text-[#16A34A]">
                      Available
                    </span>
                  </td>
                  <td className="px-5">
                    <button
                      type="button"
                      onClick={() => onSelectTeacher(teacher)}
                      disabled={isAssigning}
                      className="h-8 min-w-[108px] rounded-[5px] bg-black px-2 text-[12px] font-medium text-white transition hover:bg-[#222222] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                    >
                      {isAssigning ? (
                        <><Loader2 size={13} className="animate-spin" /> Assigning...</>
                      ) : (
                        "Select Teacher"
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
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
  substitute: AvailableTeacher
): SubstituteDetails => {
  const section = timetable.className.split("-").pop() ?? "A";
  const batchYear = timetable.batch.split(" ")[0] ?? timetable.batch;

  return {
    id: substitute.user_id,
    regularTeacher: absentTeacher.name,
    substituteTeacher: substitute.teacher_name,
    batch: `${batchYear}-${section}`,
    section,
    date: formatAssignmentDate(absentTeacher.date),
    reason: absentTeacher.reason,
    reasonDescription: `${absentTeacher.name} is unavailable due to ${absentTeacher.reason.toLowerCase()}. ${substitute.teacher_name} has been assigned for ${timetable.period} in ${timetable.className}.`,
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
