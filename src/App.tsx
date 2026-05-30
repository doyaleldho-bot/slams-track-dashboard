import { BrowserRouter, Routes, Route } from "react-router-dom"

function Home() {
  return <h1 className="text-red-500">Home Page</h1>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* MAIN DASHBOARD LAYOUT */}
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
