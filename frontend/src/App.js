import * as React from "react";
import { LoginSignupPage } from "./Pages/LoginPage";
import { ManagePage } from "./Pages/ManagePage";
import { Routes, Navigate, Route, BrowserRouter } from "react-router-dom";
import { AuthContext, AuthProvider } from "./Components/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginSignupPage />} />
          <Route path="/manage" element={<ManagePage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
