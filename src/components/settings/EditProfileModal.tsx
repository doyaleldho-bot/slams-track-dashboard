import React, { useEffect, useState } from "react"
import { X, Image as ImageIcon, ChevronRight } from "lucide-react"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { updateProfile } from "../../redux/action/UserThunk"
import { toast } from "react-toastify"

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useAppDispatch()
  const { profile, loading } = useAppSelector((s) => s.profile)

  const [formData, setFormData] = useState({
    fullName: "",
    role: "",
    email: "",
    address: "",
    phone1: "",
    phone2: "",
  })

  const [initialFormData, setInitialFormData] = useState(formData)

  const [errors, setErrors] = useState<Record<string, string>>({})

  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imageName, setImageName] = useState<string>("")

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullname || "",
        role: profile.role || "",
        email: profile.email || "",
        address: profile.address || "",
        phone1: profile.phone_number || "",
        phone2: "",
      })
      if (profile.profile_photo) {
        setImageName(profile.profile_photo.split("/").pop() || "Profile Image")
      }
    }
  }, [profile, isOpen])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    setSelectedImage(file)
    setImageName(file.name)

    setErrors((prev) => ({
      ...prev,
      profileImage: "",
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.role.trim()) {
      newErrors.role = "Role is required"
    }

    if (!formData.phone1.trim()) {
      newErrors.phone1 = "Phone number is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address"
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
    }

    // if (!selectedImage) {
    //   newErrors.profileImage = "Profile image is required"
    // }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    const payload: any = {}

    if (formData.fullName !== profile?.fullname) {
      payload.fullname = formData.fullName
    }

    if (formData.role !== profile?.role) {
      payload.role = formData.role
    }

    if (formData.email !== profile?.email) {
      payload.email = formData.email
    }

    if (formData.address !== profile?.address) {
      payload.address = formData.address
    }

    if (formData.phone1 !== profile?.phone_number) {
      payload.phone_number = formData.phone1
    }

    if (selectedImage) {
      payload.profile_photo = selectedImage
    }

    // no changes
    if (Object.keys(payload).length === 0) {
      toast.info("No changes detected")
      return
    }

    try {
      await dispatch(updateProfile(payload)).unwrap()

      toast.success("Profile updated successfully")
      onClose()
    } catch (error: any) {
      toast.error(error || "Profile update failed")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[900px] rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-[#2F2F2F]">Edit Profile</h2>

          <button onClick={onClose}>
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="grid gap-5 md:grid-cols-2">
            {/* Full Name */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Full Name
              </label>

              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`h-11 w-full rounded-lg border bg-[#F8F8F8] px-4 outline-none ${
                  errors.fullName ? "border-red-500" : "border-[#E5E7EB]"
                }`}
              />

              {errors.fullName && (
                <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Phone Number *
              </label>

              <input
                name="phone1"
                value={formData.phone1}
                onChange={handleChange}
                className={`h-11 w-full rounded-lg border bg-[#F8F8F8] px-4 outline-none ${
                  errors.phone1 ? "border-red-500" : "border-[#E5E7EB]"
                }`}
              />

              {errors.phone1 && (
                <p className="mt-1 text-xs text-red-500">{errors.phone1}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="mb-2 block text-sm font-medium">Role *</label>

              <input
                name="role"
                disabled={!!formData.role}
                value={formData.role}
                onChange={handleChange}
                className={`h-11 w-full rounded-lg border bg-[#F8F8F8] px-4 outline-none ${
                  errors.role ? "border-red-500" : "border-[#E5E7EB]"
                }`}
              />

              {errors.role && (
                <p className="mt-1 text-xs text-red-500">{errors.role}</p>
              )}
            </div>

            {/* Secondary Phone */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Alternate Phone
              </label>

              <input
                name="phone2"
                value={formData.phone2}
                onChange={handleChange}
                className="h-11 w-full rounded-lg border border-[#E5E7EB] bg-[#F8F8F8] px-4 outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium">Email *</label>

            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`h-11 w-full rounded-lg border bg-[#F8F8F8] px-4 outline-none ${
                errors.email ? "border-red-500" : "border-[#E5E7EB]"
              }`}
            />

            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Address & Upload */}
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Address *
              </label>

              <textarea
                rows={5}
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full resize-none rounded-lg border bg-[#F8F8F8] p-4 outline-none ${
                  errors.address ? "border-red-500" : "border-[#E5E7EB]"
                }`}
              />

              {errors.address && (
                <p className="mt-1 text-xs text-red-500">{errors.address}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Profile Image
              </label>

              <label
                className={`flex h-[170px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all ${
                  selectedImage
                    ? "border-green-500 bg-green-50"
                    : errors.profileImage
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 bg-[#FAFAFA]"
                }`}
              >
                <ImageIcon
                  size={30}
                  className={selectedImage ? "text-green-600" : "text-gray-500"}
                />

                {imageName ? (
                  <>
                    <p className="mt-3 text-sm font-medium text-green-700">
                      {imageName}
                    </p>

                    <span className="text-xs text-green-600">
                      Uploaded Successfully
                    </span>
                  </>
                ) : (
                  <>
                    <span className="mt-2 text-sm">
                      Click to upload or drag and drop
                    </span>

                    <span className="text-xs text-gray-400">
                      JPG / PNG Max 10MB
                    </span>
                  </>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {errors.profileImage && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.profileImage}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            onClick={handleSave}
            className="h-11 min-w-[120px] rounded-md bg-[#0D47A1] px-6 text-sm font-medium text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditProfileModal
