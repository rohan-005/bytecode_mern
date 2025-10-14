import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/landing_page";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Dashboard from "./profile/Dashboard";
import NotFound from "./pages/NotFound";
import "./App.css";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Only Route Example */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <div>Admin Panel</div>
                </ProtectedRoute>
              }
            />

            {/* 404 Page */}
            <Route path="/404" element={<NotFound />} />

            {/* Redirect unknown routes to 404 */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </div>
      </Router>
      <Toaster
        position="top-right"
      />
    </AuthProvider>
  );
}

export default App;
