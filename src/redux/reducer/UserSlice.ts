import { createSlice } from "@reduxjs/toolkit"
import type { Profile } from "../interface/UserInterface"
import { getProfile, logoutUser, updateProfile } from "../action/UserThunk"

interface ProfileState {
  profile: Profile | null
  loading: boolean
  error: string | null
  initialized: boolean
  authenticated: boolean
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
  initialized: false,
  authenticated: false,
}

const profileSlice = createSlice({
  name: "profile",
  initialState,

  reducers: {
    clearProfile: (state) => {
      state.profile = null
      state.error = null
    },
  },

  extraReducers: (builder) => {
    builder

      // loading
      .addCase(getProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })

      // success
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload.data
        state.authenticated = true
        state.initialized = true
      })

      // error
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false
        state.profile = null
        state.authenticated = false
        state.initialized = true
        state.error = action.payload || "Profile loading failed"
      })
      //update profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true
      })

      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload.data
      })

      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      //logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false
        state.profile = null
        state.authenticated = false
        state.initialized = true
      })

      .addCase(logoutUser.rejected, (state) => {
        state.loading = false
        state.profile = null
      })
  },
})

export const { clearProfile } = profileSlice.actions

export default profileSlice.reducer
