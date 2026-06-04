export interface TeacherAttendance {
  teacherId: string;
  teacherName: string;
  section: string;
  status: "Present" | "Absent" | "Late";
  checkIn: string;
  checkOut: string;
  remark: string;
}