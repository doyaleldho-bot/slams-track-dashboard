import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import HomePage from "./pages/HomePage";
import Attendance from "./pages/Attendance";
import StaffManagement from "./pages/StaffManagement";
import AcademicPage from "./pages/AcademicPage"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<DashboardLayout />}>
          {/* MAIN DASHBOARD LAYOUT */}
          <Route path="/" element={<HomePage />} />
          <Route path="/Staffmanagement" element={<StaffManagement/>} />
          <Route path="/AcademicManagement" element={<AcademicPage />} />
          <Route path="/Attendance" element={<Attendance />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
