import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';
import type { UserRole } from '../../../types';

interface RoleGuardProps {
  allowedRoles: UserRole[];
}

export const RoleGuard = ({ allowedRoles }: RoleGuardProps) => {
  const { user, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in but wrong role, redirect to unauthorized or home
  if (!allowedRoles.includes(user.role)) {
    // You could redirect to a dedicated "unauthorized" page
    // For now, redirect to their dashboard based on role? Or just login.
    console.warn(`User role ${user.role} not allowed for this route. Needed: ${allowedRoles.join(', ')}`);
    return <Navigate to="/" replace />;
  }

  // Check if student has completed onboarding
  if (user.role === 'student') {
    const hasCompletedOnboarding = !!user.enrolledFaceId && !!user.profile;
    const isOnboardingRoute = location.pathname === '/student/onboarding';

    if (!hasCompletedOnboarding && !isOnboardingRoute) {
      return <Navigate to="/student/onboarding" replace />;
    }

    if (hasCompletedOnboarding && isOnboardingRoute) {
      return <Navigate to="/student/dashboard" replace />;
    }
  }

  return <Outlet />;
};

