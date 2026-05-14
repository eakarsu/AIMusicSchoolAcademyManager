import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Instruments from './pages/Instruments';
import Lessons from './pages/Lessons';
import Rooms from './pages/Rooms';
import Rentals from './pages/Rentals';
import Recitals from './pages/Recitals';
import PracticeLogs from './pages/PracticeLogs';
import Grades from './pages/Grades';
import Billing from './pages/Billing';
import Attendance from './pages/Attendance';
import MusicLibrary from './pages/MusicLibrary';
import Families from './pages/Families';
import Messages from './pages/Messages';
import MakeupLessons from './pages/MakeupLessons';
import SummerCamps from './pages/SummerCamps';
import Ensembles from './pages/Ensembles';
import Competitions from './pages/Competitions';
import TheoryClasses from './pages/TheoryClasses';
import Payroll from './pages/Payroll';
import Substitutes from './pages/Substitutes';
import TrialLessons from './pages/TrialLessons';
import WaitingList from './pages/WaitingList';
import ReportCards from './pages/ReportCards';
import Certificates from './pages/Certificates';
import Merchandise from './pages/Merchandise';
import AIPracticePlan from './pages/AIPracticePlan';
import AIProgressReport from './pages/AIProgressReport';
import AIRecitalProgram from './pages/AIRecitalProgram';
import AISkillAssessment from './pages/AISkillAssessment';
import AILessonPlan from './pages/AILessonPlan';
import AIMarketingCampaign from './pages/AIMarketingCampaign';
import AIScheduleMakeup from './pages/AIScheduleMakeup';
import AIStudentMatching from './pages/AIStudentMatching';
import AIRetentionRisk from './pages/AIRetentionRisk';
import AIEventPromotion from './pages/AIEventPromotion';
import AIEnsembleAssignment from './pages/AIEnsembleAssignment';
import AIPracticeEvaluation from './pages/AIPracticeEvaluation';
import AIParentSummary from './pages/AIParentSummary';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function AppLayout({ sidebarOpen, setSidebarOpen }) {
  return (
    <div className="app-layout">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main className={`main-content ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/instruments" element={<Instruments />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rentals" element={<Rentals />} />
          <Route path="/recitals" element={<Recitals />} />
          <Route path="/practice-logs" element={<PracticeLogs />} />
          <Route path="/grades" element={<Grades />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/music-library" element={<MusicLibrary />} />
          <Route path="/families" element={<Families />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/makeup-lessons" element={<MakeupLessons />} />
          <Route path="/summer-camps" element={<SummerCamps />} />
          <Route path="/ensembles" element={<Ensembles />} />
          <Route path="/competitions" element={<Competitions />} />
          <Route path="/theory-classes" element={<TheoryClasses />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/substitutes" element={<Substitutes />} />
          <Route path="/trial-lessons" element={<TrialLessons />} />
          <Route path="/waiting-list" element={<WaitingList />} />
          <Route path="/report-cards" element={<ReportCards />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/merchandise" element={<Merchandise />} />
          <Route path="/ai/practice-plan" element={<AIPracticePlan />} />
          <Route path="/ai/progress-report" element={<AIProgressReport />} />
          <Route path="/ai/recital-program" element={<AIRecitalProgram />} />
          <Route path="/ai/skill-assessment" element={<AISkillAssessment />} />
          <Route path="/ai/lesson-plan" element={<AILessonPlan />} />
          <Route path="/ai/marketing-campaign" element={<AIMarketingCampaign />} />
          <Route path="/ai/schedule-makeup" element={<AIScheduleMakeup />} />
          <Route path="/ai/student-matching" element={<AIStudentMatching />} />
          <Route path="/ai/retention-risk" element={<AIRetentionRisk />} />
          <Route path="/ai/event-promotion" element={<AIEventPromotion />} />
          <Route path="/ai/ensemble-assignment" element={<AIEnsembleAssignment />} />
          <Route path="/ai/practice-evaluation" element={<AIPracticeEvaluation />} />
          <Route path="/ai/parent-summary" element={<AIParentSummary />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
