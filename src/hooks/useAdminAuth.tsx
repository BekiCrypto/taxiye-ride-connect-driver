
import { useState, useEffect } from 'react';

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin session exists in localStorage
    const adminSession = localStorage.getItem('admin_session');
    if (adminSession === 'true') {
      setIsAdmin(true);
    }
    setLoading(false);
  }, []);

  const login = (adminStatus: boolean) => {
    setIsAdmin(adminStatus);
    if (adminStatus) {
      localStorage.setItem('admin_session', 'true');
    }
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('admin_session');
  };

  return {
    isAdmin,
    loading,
    login,
    logout
  };
};
