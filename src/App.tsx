import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import DashboardLayout from "./layouts/DashboardLayout"
import HomePage from "./pages/HomePage"
import Attendance from "./pages/Attendance"
import StaffManagement from "./pages/StaffManagement"
import AcademicPage from "./pages/AcademicPage"
import StudentPage from "./pages/StudentPage"
import FinancePage from "./pages/FinancePage"
import SettingPage from "./pages/SettingPage"
import LoginPage from "./pages/LoginPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import { ToastContainer } from "react-toastify"
import ProtectedRoute from "./layouts/ProtectedRoute"

//z
import { useAppDispatch, useAppSelector } from "./redux/hooks"
import { useEffect } from "react"
import { getProfile } from "./redux/action/UserThunk"
import PublicRoute from "./layouts/PublicRoute"

function App() {
  const dispatch = useAppDispatch()

  const { initialized } = useAppSelector((state) => state.profile)

  useEffect(() => {
    if (!initialized) {
      dispatch(getProfile())
    }
  }, [initialized, dispatch])
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<HomePage />} />
            <Route path="Staffmanagement" element={<StaffManagement />} />
            <Route path="AcademicManagement" element={<AcademicPage />} />
            <Route path="finance" element={<FinancePage />} />
            <Route path="studentManagement" element={<StudentPage />} />
            <Route path="Attendance" element={<Attendance />} />
            <Route path="settings" element={<SettingPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
