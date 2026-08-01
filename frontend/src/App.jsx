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
import OTPVerification from "./components/OTPVerification";
import Dashboard from "./profile/Dashboard";
import NotFound from "./pages/NotFound";
import "./App.css";
import { Toaster } from "react-hot-toast";
import Courses from "./pages/Courses"; // Add this import
import ForgotPassword from "./auth/ForgotPassword";
import Profile from './profile/Profile';
import CodeEditor from "./pages/CodeEditor";
import CourseDetail from "./pages/CourseDetail";
import ExerciseDetail from "./components/ExerciseDetail";
import Devden from "./devden/devden";
import Byteai from "./byteai/byteai";


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
            <Route path="/verify-email" element={<OTPVerification />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <Courses />
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

            {/* forgot-password */}
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* profile update */}
            <Route path="/profile" element={<Profile />} />

            {/* editor */}
            <Route path="/editor" element={<CodeEditor />} />

            {/* courses-individuals */}
            <Route path="/course/:courseId" element={<CourseDetail />} />

            {/* exercises */}
            <Route path="/courses/:courseId/exercises/:exerciseId" element={<ExerciseDetail />} />

            {/* devden */}
             <Route path="/devden" element={< Devden/>} />

            {/* byteai */}
               <Route path="/byteai" element={<Byteai/>} />

            {/* Redirect unknown routes to 404 */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </div>
      </Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#2D2D2D",
            color: "#FFFFFF",
            border: "1px solid #4A4A4A",
            borderRadius: "0px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "13px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
          },
          success: {
            style: {
              background: "#2D2D2D",
              color: "#FFFFFF",
              border: "1px solid #35C759",
              borderLeft: "4px solid #35C759",
              borderRadius: "0px",
            },
            iconTheme: {
              primary: "#35C759",
              secondary: "#2D2D2D",
            },
          },
          error: {
            style: {
              background: "#2D2D2D",
              color: "#FFFFFF",
              border: "1px solid #FF4D4F",
              borderLeft: "4px solid #FF4D4F",
              borderRadius: "0px",
            },
            iconTheme: {
              primary: "#FF4D4F",
              secondary: "#2D2D2D",
            },
          },
          loading: {
            style: {
              background: "#2D2D2D",
              color: "#FFFFFF",
              border: "1px solid #FF6A2A",
              borderLeft: "4px solid #FF6A2A",
              borderRadius: "0px",
            },
            iconTheme: {
              primary: "#FF6A2A",
              secondary: "#2D2D2D",
            },
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;
