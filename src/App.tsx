import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { useAppDispatch, useAppSelector } from "./redux/hooks"
import { useEffect, lazy, Suspense } from "react"
import { getProfile } from "./redux/action/UserThunk"

// Lazy-loaded components
const DashboardLayout = lazy(() => import("./layouts/DashboardLayout"))
const ProtectedRoute = lazy(() => import("./layouts/ProtectedRoute"))
const PublicRoute = lazy(() => import("./layouts/PublicRoute"))

const HomePage = lazy(() => import("./pages/HomePage"))
const Attendance = lazy(() => import("./pages/Attendance"))
const StaffManagement = lazy(() => import("./pages/StaffManagement"))
const AcademicPage = lazy(() => import("./pages/AcademicPage"))
const StudentPage = lazy(() => import("./pages/StudentPage"))
const FinancePage = lazy(() => import("./pages/FinancePage"))
const SettingPage = lazy(() => import("./pages/SettingPage"))
const LoginPage = lazy(() => import("./pages/LoginPage"))
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"))

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

      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            Loading...
          </div>
        }
      >
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<HomePage />} />
              <Route path="Staffmanagement" element={<StaffManagement />} />
              <Route
                path="AcademicManagement"
                element={<AcademicPage />}
              />
              <Route path="finance" element={<FinancePage />} />
              <Route
                path="studentManagement"
                element={<StudentPage />}
              />
              <Route path="Attendance" element={<Attendance />} />
              <Route path="settings" element={<SettingPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App