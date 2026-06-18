import { createAsyncThunk } from "@reduxjs/toolkit"
import type {
  ProfileResponse,
  UpdateProfilePayload,
} from "../interface/UserInterface"
import api from "../../api/axios"

export const getProfile = createAsyncThunk<
  ProfileResponse,
  void,
  { rejectValue: string }
>("profile/getProfile", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<ProfileResponse>("settings/profile/")

    return response.data
  } catch (error: any) {
    localStorage.setItem("logout", "false")
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch profile",
    )
  }
})

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (data: UpdateProfilePayload, { rejectWithValue }) => {
    try {
      const formData = new FormData()

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value as string | Blob)
        }
      })
      const response = await api.put("/settings/profile/update/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Profile update failed")
    }
  },
)

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem("refresh_token")

      await api.post("/logout/", {
        refresh: refreshToken,
      })

      localStorage.clear()

      return true
    } catch (error: any) {
      localStorage.clear()

      return rejectWithValue(error.response?.data || "Logout failed")
    }
  },
)
