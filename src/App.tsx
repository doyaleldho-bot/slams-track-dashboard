import { BrowserRouter, Routes, Route } from "react-router-dom"
import DashboardLayout from "./layouts/DashboardLayout"
import HomePage from "./pages/HomePage"
import AcademicPage from "./pages/AcademicPage"
import StudentPage from "./pages/StudentPage"
import FinancePage from "./pages/FinancePage"
import Attendance from "./pages/Attendance"
import SettingPage from "./pages/settingPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<DashboardLayout />}>
          {/* MAIN DASHBOARD LAYOUT */}``
          <Route path="/" element={<HomePage />} />
          <Route path="/StaffManagement" element={<div>Staff Management Page is on Construction</div>} />
          <Route path="/AcademicManagement" element={<AcademicPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/studentManagement" element={<StudentPage />} />
          <Route path="/Attendance" element={<Attendance />} />
<<<<<<< HEAD
          <Route path="/settings" element={<SettingPage />} />
=======
          <Route path="/settings" element={<div>Settings Page Construction</div>} />
>>>>>>> f7c7fd9f7e4dd468969ba2396e3dbc6db13b3c4e
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
