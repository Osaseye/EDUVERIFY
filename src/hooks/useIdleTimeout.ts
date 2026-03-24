import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { authService } from '../services/authService';
import { toast } from 'sonner';

export const useIdleTimeout = (timeoutMs: number = 20 * 60 * 1000) => {
  const { user, logout } = useAuthStore();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only track idle time if the user is currently logged in
    if (!user) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const handleLogout = async () => {
      try {
        await authService.logoutUser();
        logout();
        toast.info('You have been logged out due to inactivity.');
      } catch (error) {
        console.error('Auto-logout failed:', error);
      }
    };

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(handleLogout, timeoutMs);
    };

    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];

    const handleUserActivity = () => {
      resetTimer();
    };

    // Initialize timer
    resetTimer();

    // Attach event listeners to detect activity
    events.forEach(event => window.addEventListener(event, handleUserActivity));

    // Cleanup function
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => window.removeEventListener(event, handleUserActivity));
    };
  }, [user, logout, timeoutMs]);
};
