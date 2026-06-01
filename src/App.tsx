import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import HomePage from "./pages/HomePage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<DashboardLayout />}>
          {/* MAIN DASHBOARD LAYOUT */}
          <Route path="/" element={<HomePage />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;