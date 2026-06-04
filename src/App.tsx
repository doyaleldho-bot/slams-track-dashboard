import { BrowserRouter, Routes, Route } from "react-router-dom"
import DashboardLayout from "./layouts/DashboardLayout"
import HomePage from "./pages/HomePage"
import AcademicPage from "./pages/AcademicPage"
import StudentPage from "./pages/StudentPage"
import FinancePage from "./pages/FinancePage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<DashboardLayout />}>
          {/* MAIN DASHBOARD LAYOUT */}
          <Route path="/" element={<HomePage />} />
          <Route path="/StaffManagement" element={<StudentPage />} />
          <Route path="/AcademicManagement" element={<AcademicPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/studentManagement" element={<StudentPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
