import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { AuthLayout } from './components/layout/AuthLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { StudentOnboarding } from './features/onboarding/components/StudentOnboarding';
import { RoleGuard } from './features/auth/components/RoleGuard';
import { StudentDashboard } from './features/dashboard/student/StudentDashboard';
import { MyClassesPage } from './features/dashboard/student/MyClassesPage';
import { ClassDetailsPage } from './features/dashboard/student/ClassDetailsPage';
import { AttendanceHistoryPage } from './features/dashboard/student/AttendanceHistoryPage';
import { SettingsPage } from './features/dashboard/student/SettingsPage';
import { ScannerPage } from './features/dashboard/student/ScannerPage';
import LecturerDashboard from './features/dashboard/lecturer/LecturerDashboard';
import { CreateClassPage } from './features/dashboard/lecturer/CreateClassPage';
import { CreateAttendanceSessionPage } from './features/dashboard/lecturer/CreateAttendanceSessionPage';
import { LecturerQRGeneratorPage } from './features/dashboard/lecturer/LecturerQRGeneratorPage';
import { LecturerAttendanceTrackingPage } from './features/dashboard/lecturer/LecturerAttendanceTrackingPage';
import { AdminDashboard } from './features/dashboard/admin/AdminDashboard';
import { AdminUserManagementPage } from './features/dashboard/admin/AdminUserManagementPage';
import { AdminClassManagementPage } from './features/dashboard/admin/AdminClassManagementPage';
import { AdminAttendanceReportsPage } from './features/dashboard/admin/AdminAttendanceReportsPage';
import { AdminSystemLogsPage } from './features/dashboard/admin/AdminSystemLogsPage';
import { AdminSettingsPage } from './features/dashboard/admin/AdminSettingsPage';
import { AdminLoginPage } from './pages/auth/AdminLoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
        </Route>

        {/* Protected Student Routes */}
        <Route element={<RoleGuard allowedRoles={['student']} />}>  
          <Route path="/student/onboarding" element={<StudentOnboarding />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/classes" element={<MyClassesPage />} />
          <Route path="/student/classes/:classId" element={<ClassDetailsPage />} />
          <Route path="/student/history" element={<AttendanceHistoryPage />} />
          <Route path="/student/scanner" element={<ScannerPage />} />
          <Route path="/student/settings" element={<SettingsPage />} />
        </Route>

        {/* Protected Lecturer Routes */}
        <Route element={<RoleGuard allowedRoles={['lecturer']} />}>
          <Route path="/lecturer/dashboard" element={<LecturerDashboard />} />
          <Route path="/lecturer/create-class" element={<CreateClassPage />} />
          <Route path="/lecturer/create-session/:classId" element={<CreateAttendanceSessionPage />} />
          <Route path="/lecturer/qr-generator" element={<LecturerQRGeneratorPage />} />
          <Route path="/lecturer/attendance-tracking" element={<LecturerAttendanceTrackingPage />} />
          <Route path="/lecturer/settings" element={<SettingsPage />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<RoleGuard allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUserManagementPage />} />
          <Route path="/admin/classes" element={<AdminClassManagementPage />} />
          <Route path="/admin/reports" element={<AdminAttendanceReportsPage />} />
          <Route path="/admin/logs" element={<AdminSystemLogsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;




