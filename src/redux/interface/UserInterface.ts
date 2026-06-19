export interface Profile {
  profile_photo: string
  fullname: string
  role: string
  phone_number: string
  email: string
  address: string
  gender: string
  employee_id: string
  designation: string | null
  department: string | null
  joining_date: string | null
  assigned_by: string
  account_created: string
  status: string
}

export interface UpdateProfilePayload {
  full_name: string
  role: string
  email: string
  address: string
  phone_number: string
  profile_photo?: File | null
}

export interface ProfileResponse {
  status: boolean
  message: string
  data: Profile
}
