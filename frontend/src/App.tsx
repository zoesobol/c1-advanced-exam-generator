import { Navigate, Route, Routes } from "react-router-dom";

import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";
import { CreateExamPage } from "@/pages/CreateExamPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ExamDetailPage } from "@/pages/ExamDetailPage";
import { ExamSectionPage } from "@/pages/ExamSectionPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { SectionResultsPage } from "@/pages/SectionResultsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/exams/new" element={<CreateExamPage />} />
          <Route path="/exams/:examId" element={<ExamDetailPage />} />
          <Route
            path="/exams/:examId/sections/:partCode"
            element={<ExamSectionPage />}
          />
          <Route
            path="/exams/:examId/sections/:partCode/results"
            element={<SectionResultsPage />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
