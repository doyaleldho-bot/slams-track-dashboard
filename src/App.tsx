import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import HomePage from "./pages/HomePage";
import AcademicPage from "./pages/AcademicPage";
import FinancePage from "./pages/FinancePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<DashboardLayout />}>
          {/* MAIN DASHBOARD LAYOUT */}
          <Route path="/" element={<HomePage />} />
          <Route path="/AcademicManagement" element={<AcademicPage />} />
          <Route path="/finance" element={<FinancePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
