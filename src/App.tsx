import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { AuthLayout } from './components/layout/AuthLayout';
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
import { LecturerDashboard } from './features/dashboard/lecturer/LecturerDashboard';
import { LecturerClassDetailsPage } from './features/dashboard/lecturer/LecturerClassDetailsPage';
import { CreateClassPage } from './features/dashboard/lecturer/CreateClassPage';
import { EditClassPage } from './features/dashboard/lecturer/EditClassPage';
import { CreateAttendanceSessionPage } from './features/dashboard/lecturer/CreateAttendanceSessionPage';
// import { LecturerQRGeneratorPage } from './features/dashboard/lecturer/LecturerQRGeneratorPage';
import { LecturerAttendanceTrackingPage } from './features/dashboard/lecturer/LecturerAttendanceTrackingPage';
import { AdminDashboard } from './features/dashboard/admin/AdminDashboard';
import { AdminUserManagementPage } from './features/dashboard/admin/AdminUserManagementPage';
import { AdminClassManagementPage } from './features/dashboard/admin/AdminClassManagementPage';
import { AdminAttendanceReportsPage } from './features/dashboard/admin/AdminAttendanceReportsPage';
import { AdminSystemLogsPage } from './features/dashboard/admin/AdminSystemLogsPage';
import { AdminSettingsPage } from './features/dashboard/admin/AdminSettingsPage';
import { AdminLoginPage } from './pages/auth/AdminLoginPage';
import { Toaster } from 'sonner';
import { useAuthListener } from './hooks/useAuthListener';

function App() {
  useAuthListener();

  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
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
          <Route path="/student/settings" element={<SettingsPage />} />
        </Route>

        {/* Protected Lecturer Routes */}
        <Route element={<RoleGuard allowedRoles={['lecturer']} />}>
          <Route path="/lecturer/dashboard" element={<LecturerDashboard />} />            <Route path="/lecturer/classes/:classId" element={<LecturerClassDetailsPage />} />          <Route path="/lecturer/create-class" element={<CreateClassPage />} />
          <Route path="/lecturer/edit-class/:classId" element={<EditClassPage />} />
          <Route path="/lecturer/create-session/:classId" element={<CreateAttendanceSessionPage />} />
          {/* <Route path="/lecturer/qr-generator" element={<LecturerQRGeneratorPage />} /> */}
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




