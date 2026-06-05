import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
} from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  student: any;
}

const StudentDetailsModal = ({
  open,
  onClose,
  student,
}: Props) => {
  if (!open || !student) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl overflow-hidden">

        {/* Header */}
        <div className="bg-blue-500 px-8 py-5 flex justify-between items-start">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl font-semibold text-gray-600">
              {student.name.charAt(0)}
            </div>

            <div>
              <h2 className="text-white text-3xl font-semibold">
                {student.name}
              </h2>

              <p className="text-blue-100 text-lg">
                Student ID: {student.studentId}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white hover:opacity-80"
          >
            <X size={28} />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50">

          {/* Left */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-6">
              <User size={18} className="text-blue-500" />
              Personal Information
            </h3>

            <div className="grid grid-cols-2 gap-y-6">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{student.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">{student.dob}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium">{student.gender}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Blood Group</p>
                <p className="font-medium">{student.bloodGroup}</p>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="flex items-center gap-2 font-semibold text-lg mb-5">
                <Mail size={18} className="text-blue-500" />
                Email Address
              </h4>

              <div className="space-y-5">
                <div>
                  <p className="text-sm text-gray-500">
                    Email Address
                  </p>
                  <p>{student.email}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Phone Number
                  </p>
                  <p>{student.phone}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p>{student.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">

            <h3 className="flex items-center gap-2 text-lg font-semibold mb-6">
              <User size={18} className="text-blue-500" />
              Parent / Guardian Information
            </h3>

            <div className="grid grid-cols-2 gap-y-6">
              <div>
                <p className="text-sm text-gray-500">
                  Father's Name
                </p>
                <p>{student.fatherName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Mother's Name
                </p>
                <p>{student.motherName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Occupation
                </p>
                <p>{student.fatherOccupation}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Occupation
                </p>
                <p>{student.motherOccupation}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Contact
                </p>
                <p>{student.phone}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Phone Number
                </p>
                <p>{student.phone}</p>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-6">
                <GraduationCap
                  size={18}
                  className="text-blue-500"
                />
                Academic Information
              </h3>

              <div className="grid grid-cols-2 gap-y-6">
                <div>
                  <p className="text-sm text-gray-500">
                    Admission Date
                  </p>
                  <p>{student.admissionDate}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Academic Year
                  </p>
                  <p>{student.academicYear}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Previous School
                  </p>
                  <p>{student.previousSchool}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Class / Section
                  </p>
                  <p>{student.classSection}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsModal;