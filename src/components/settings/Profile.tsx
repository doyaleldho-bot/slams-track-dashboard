import React, { useState } from "react"
import { User, Eye, EyeOff } from "lucide-react"
import EditProfileModal from "./EditProfileModal"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import api from "../../api/axios"
import { toast } from "react-toastify"
import { useNavigate } from "react-router"
import { logoutUser } from "../../redux/action/UserThunk"

const profileData = {
  basicProfile: {
    fullName: "Sreedevi R",
    role: "Super Admin",
    phoneNumber: "8125485652",
    email: "Sree@gmail.com",
    address:
      "Flat No. 303, Green Meadows Apartments, MG Road, Near Metro Station, Ernakulam, Kochi, Kerala - 682016, India",
  },

  workProfile: {
    employeeId: "SUPADM1234",
    assignedBy: "System / Founder",
    accountCreated: "01-05-2025",
    status: "Active",
  },
}

export const BASE_URL = import.meta.env.VITE_API_URL
const Profile: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { profile, loading } = useAppSelector((s) => s.profile)

  const [openModal, setOpenModal] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }))
  }

  const handleChangePassword = async () => {
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }

    let isValid = true

    if (!passwordData.currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required"
      isValid = false
    }

    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = "New password is required"
      isValid = false
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters"
      isValid = false
    }

    if (!passwordData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required"
      isValid = false
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      isValid = false
    }

    setErrors(newErrors)

    if (!isValid) return

    const payload = {
      current_password: passwordData.currentPassword,
      new_password: passwordData.newPassword,
      confirm_password: passwordData.confirmPassword,
    }

    try {
      const response = await api.post("/settings/change-password/", payload)

      toast.success(response.data.message || "Password changed successfully")

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error: any) {
      console.log(error.response?.data)

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Password change failed"

      toast.error(errorMessage)
    }
  }

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap()

      toast.success("Logged out successfully")

      navigate("/login", {
        replace: true,
      })
    } catch (error: any) {
      toast.error(error?.message || "Logout failed")

      navigate("/login", {
        replace: true,
      })
    }
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center" >
        Loading profile...
      </div>
    )
  }
  console.log(`${BASE_URL}${profile?.profile_photo?.replace(/^\/+/, "")}`)
  return (
    <div className="space-y-6 p-6" >
      {/* Header */}
      < div className="flex items-start justify-between" >
        <div className="flex items-center gap-4" >
          {
            profile?.profile_photo ? (
              <img
                src={`${BASE_URL}${profile?.profile_photo?.replace(/^\/+/, "")}`}
                className="h-44 w-44 rounded-full object-cover"
                alt="Profile"
              />
            ) : (
              <div className="flex h-44 w-44 items-center justify-center rounded-full bg-[#fff]" >
                <User size={110} className="text-[#002F9666]" />
              </div>
            )}
        </div>

        < button
          className="rounded-md bg-[#0D47A1] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#1565C0]"
          onClick={() => setOpenModal(true)}
        >
          Edit
        </button>
      </div>
      {/* Basic Profile */}
      <div className="rounded-xl bg-white p-6 shadow-sm" >
        <h3 className="mb-5 text-sm font-semibold text-[#444]" >
          Basic Profile
        </h3>

        < div className="grid gap-y-4 md:grid-cols-[180px_1fr]" >
          <p className="font-medium text-[#555]" > Full Name: </p>
          < p > {profile?.fullname || "-"}</p>

          < p className="font-medium text-[#555]" > Role: </p>
          < p > {profile?.role || "-"}</p>

          < p className="font-medium text-[#555]" > Phone Number: </p>
          < p > {profile?.phone_number || "-"}</p>

          < p className="font-medium text-[#555]" > Email ID: </p>
          < p > {profile?.email || "-"}</p>

          < p className="font-medium text-[#555]" > Address: </p>

          < p className="max-w-[600px] leading-6" > {profile?.address || "-"}</p>
        </div>
      </div>
      {/* Work Profile */}
      <div className="rounded-xl bg-white p-6 shadow-sm" >
        <h3 className="mb-5 text-sm font-semibold text-[#444]" > Work Profile </h3>

        < div className="grid gap-y-4 md:grid-cols-[180px_1fr]" >
          <p className="font-medium text-[#555]" > Employee ID: </p>
          < p > {profile?.employee_id || "-"}</p>

          < p className="font-medium text-[#555]" > Assigned By: </p>
          < p > {profile?.assigned_by || "-"}</p>

          < p className="font-medium text-[#555]" > Account Created: </p>

          <p>
            {
              profile?.account_created
                ? new Date(profile.account_created).toLocaleDateString("en-GB")
                : "-"
            }
          </p>

          < p className="font-medium text-[#555]" > Status: </p>

          < span
            className={`w-fit rounded-full px-3 py-1 text-sm font-medium ${profile?.status === "Active"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
              }`}
          >
            {profile?.status || "-"}
          </span>
        </div>
      </div>
      {/* Change Password */}
      <div className="rounded-xl bg-white p-6 shadow-sm" >
        <h3 className="mb-5 text-sm font-semibold text-[#444]" >
          Change Password
        </h3>

        < div className="grid gap-4 lg:grid-cols-4" >
          <div className="relative" >
            <input
              type={showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Current Password"
              className="h-11 w-full rounded-lg border border-[#E5E7EB] px-4 pr-10 outline-none"
            />

            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

            {
              errors.currentPassword && (
                <p className="mt-1 text-xs text-red-500" >
                  {errors.currentPassword}
                </p>
              )
            }
          </div>

          < div className="relative" >
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="New Password"
              className="h-11 w-full rounded-lg border border-[#E5E7EB] px-4 pr-10 outline-none"
            />

            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

            {
              errors.newPassword && (
                <p className="mt-1 text-xs text-red-500" > {errors.newPassword} </p>
              )
            }
          </div>
          < div className="relative" >
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm Password"
              className="h-11 w-full rounded-lg border border-[#E5E7EB] px-4 pr-10 outline-none"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

            {
              errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500" >
                  {errors.confirmPassword}
                </p>
              )
            }
          </div>

          < button
            onClick={handleChangePassword}
            className="h-11 rounded-lg bg-[#0D47A1] px-6 text-white transition hover:bg-[#1565C0]"
          >
            Save
          </button>
        </div>
      </div>
      {/* sign out button */}
      <button
        className="h-11 rounded-lg bg-[#FFFFFF] px-6  transition hover:bg-[#f7f7f7] border border-[#E5E7EB] text-[#E7000B] text-sm leading-5 font-[Arimo] text-center"
        onClick={handleLogout}
      >
        Sign out
      </button>
      < EditProfileModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />
    </div>
  )
}

export default Profile
