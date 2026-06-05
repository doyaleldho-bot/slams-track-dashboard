import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import HomePage from "./pages/HomePage";
import Attendance from "./pages/Attendance";
import StaffManagement from "./pages/StaffManagement";
import AcademicPage from "./pages/AcademicPage"
import StudentPage from "./pages/StudentPage"
import FinancePage from "./pages/FinancePage"
import SettingPage from "./pages/settingPage"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<DashboardLayout />}>
          {/* MAIN DASHBOARD LAYOUT */}``
          <Route path="/" element={<HomePage />} />
          <Route path="/Staffmanagement" element={<StaffManagement/>} />
          <Route path="/AcademicManagement" element={<AcademicPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/studentManagement" element={<StudentPage />} />
          <Route path="/Attendance" element={<Attendance />} />
          <Route path="/settings" element={<SettingPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
