import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LicenseProvider, useLicense } from './context/LicenseContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import Loading from './components/Common/Loading';

// Pages
import LicensePage from './pages/LicensePage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import InventoryPage from './pages/InventoryPage';
import StokFlowPage from './pages/StokFlowPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

function ProtectedRoute({ children }) {
  const { isActivated, loading: licenseLoading } = useLicense();
  const { isAuthenticated, loading: authLoading } = useAuth();

  if (licenseLoading || authLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-main)'
        }}
      >
        <Loading message="Memeriksa lisensi & sesi login..." size={42} />
      </div>
    );
  }

  // If application is not activated with hardware lock, redirect to license activation
  if (!isActivated) {
    return <Navigate to="/license" replace />;
  }

  // If not logged in, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicAuthRoute({ children }) {
  const { isActivated, loading: licenseLoading } = useLicense();
  const { isAuthenticated, loading: authLoading } = useAuth();

  if (licenseLoading || authLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-main)'
        }}
      >
        <Loading message="Memuat aplikasi..." size={36} />
      </div>
    );
  }

  if (!isActivated) {
    return <Navigate to="/license" replace />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function LicenseRoute({ children }) {
  const { isActivated, loading } = useLicense();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-main)'
        }}
      >
        <Loading message="Memeriksa status lisensi perangkat..." size={36} />
      </div>
    );
  }

  if (isActivated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <NotificationProvider>
          <LicenseProvider>
            <AuthProvider>
              <Routes>
                {/* License Activation Route */}
                <Route
                  path="/license"
                  element={
                    <LicenseRoute>
                      <LicensePage />
                    </LicenseRoute>
                  }
                />

                {/* Login Route */}
                <Route
                  path="/login"
                  element={
                    <PublicAuthRoute>
                      <LoginPage />
                    </PublicAuthRoute>
                  }
                />

                {/* Protected App Routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <HomePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/inventory"
                  element={
                    <ProtectedRoute>
                      <InventoryPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/stok-flow"
                  element={
                    <ProtectedRoute>
                      <StokFlowPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute>
                      <ReportsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AuthProvider>
          </LicenseProvider>
        </NotificationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
