import { BrowserRouter, Routes, Route } from "react-router-dom"
import DashboardLayout from "./layouts/DashboardLayout"
import HomePage from "./pages/HomePage"
import AcademicPage from "./pages/AcademicPage"
import Attendance from "./pages/Attendance"
import SettingPage from "./pages/settingPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<DashboardLayout />}>
          {/* MAIN DASHBOARD LAYOUT */}
          <Route path="/" element={<HomePage />} />
          <Route path="/AcademicManagement" element={<AcademicPage />} />
          <Route path="/Attendance" element={<Attendance />} />
          <Route path="/settings" element={<SettingPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
