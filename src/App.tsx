// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";

// Institution Portal Components
import InstitutionLayout from "./components/InstitutionLayout";
import InstitutionDashboardPage from "./pages/institution/InstitutionDashboardPage";
import RequiredDocumentsPage from "./pages/institution/RequiredDocumentsPage";
import UploadDocumentPage from "./pages/institution/UploadDocumentPage";
import MySubmissionsPage from "./pages/institution/MySubmissionsPage";
import InstitutionProfilePage from "./pages/InstitutionProfilePage";
import InstitutionNotificationsPage from "./pages/institution/InstitutionNotificationsPage";

// AICTE Portal Components
import AicteLayout from "./components/AicteLayout";
import AicteDashboardPage from "./pages/aicte/AicteDashboardPage";
import AicteInstitutionsPage from "./pages/aicte/AicteInstitutionsPage";
import AicteInstitutionDetailPage from "./pages/aicte/AicteInstitutionDetailPage";
import AicteDocumentReviewPage from "./pages/aicte/AicteDocumentReviewPage";
import AicteReportPage from "./pages/aicte/AicteReportPage";
import AicteHistoryPage from "./pages/aicte/AicteHistoryPage";
import AicteProfilePage from "./pages/aicte/AicteProfilePage";

import NotFoundPage from "./pages/NotFoundPage";

// Root redirector based on active role
function RootRedirect() {
  const { userRole, isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return userRole === "aicte" ? (
    <Navigate to="/aicte/dashboard" replace />
  ) : (
    <Navigate to="/institution/dashboard" replace />
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Root Redirect */}
        <Route path="/" element={<RootRedirect />} />

        {/* Unified Login Page */}
        <Route path="/login" element={<LoginPage />} />

        {/* 1. INSTITUTION PORTAL ROUTES */}
        <Route path="/institution" element={<InstitutionLayout />}>
          <Route index element={<Navigate to="/institution/dashboard" replace />} />
          <Route path="dashboard" element={<InstitutionDashboardPage />} />
          <Route path="required-documents" element={<RequiredDocumentsPage />} />
          <Route path="upload" element={<UploadDocumentPage />} />
          <Route path="submissions" element={<MySubmissionsPage />} />
          <Route path="profile" element={<InstitutionProfilePage />} />
          <Route path="notifications" element={<InstitutionNotificationsPage />} />
          <Route path="*" element={<Navigate to="/institution/dashboard" replace />} />
        </Route>

        {/* 2. AICTE IN-CHARGE PORTAL ROUTES */}
        <Route path="/aicte" element={<AicteLayout />}>
          <Route index element={<Navigate to="/aicte/dashboard" replace />} />
          <Route path="dashboard" element={<AicteDashboardPage />} />
          <Route path="institutions" element={<AicteInstitutionsPage />} />
          <Route path="institution/:id" element={<AicteInstitutionDetailPage />} />
          <Route path="review/:institutionId/:docId" element={<AicteDocumentReviewPage />} />
          <Route path="report/:institutionId/:docId" element={<AicteReportPage />} />
          <Route path="history" element={<AicteHistoryPage />} />
          <Route path="profile" element={<AicteProfilePage />} />
          <Route path="*" element={<Navigate to="/aicte/dashboard" replace />} />
        </Route>

        {/* Global Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
