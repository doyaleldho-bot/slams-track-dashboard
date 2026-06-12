export interface TeacherAttendance {
  id?: number;
  teacherId: string;
  teacherName: string;
  section: string;
  status: "Present" | "Absent" | "Late" | "Half day";
  checkIn: string;
  checkOut: string;
  remark: string;

  profileId?: number;
  attendanceDate?: string;
}