import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import AddJob from "./pages/AddJob";
import CustomerAnalysis from "./pages/CustomerAnalysis";
import Profile from "./pages/Profile";
import "./index.css";

function Guard({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<Navigate to="/jobs" replace />} />

          <Route path="/jobs" element={<Guard><Jobs /></Guard>} />
          <Route path="/add" element={<Guard><AddJob /></Guard>} />
          <Route path="/analysis" element={<Guard><CustomerAnalysis /></Guard>} />
          <Route path="/profile" element={<Guard><Profile /></Guard>} />

          <Route path="*" element={<Navigate to="/jobs" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
