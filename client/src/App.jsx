import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts & Nav
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import HowItWorksPage from './pages/HowItWorksPage';
import AwarenessPage from './pages/AwarenessPage';
import FindRecyclerPage from './pages/FindRecyclerPage';
import CommunitySurveyPage from './pages/CommunitySurveyPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RecyclerRegisterPage from './pages/RecyclerRegisterPage';

// User Pages
import UserDashboardPage from './pages/UserDashboardPage';
import SubmitEWastePage from './pages/SubmitEWastePage';
import RequestDetailsPage from './pages/RequestDetailsPage';
import ProfilePage from './pages/ProfilePage';

// Recycler Pages
import RecyclerDashboardPage from './pages/RecyclerDashboardPage';
import RecyclerPickupSpotsPage from './pages/RecyclerPickupSpotsPage';
import RecyclerProfilePage from './pages/RecyclerProfilePage';

// Admin Pages
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminRecordsPage from './pages/AdminRecordsPage';
import AdminSurveyPage from './pages/AdminSurveyPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-layout">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/awareness" element={<AwarenessPage />} />
              <Route path="/find-recycler" element={<FindRecyclerPage />} />
              <Route path="/survey" element={<CommunitySurveyPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/register-recycler" element={<RecyclerRegisterPage />} />

              {/* Community User Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <UserDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/submit-ewaste"
                element={
                  <ProtectedRoute>
                    <SubmitEWastePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/request/:id"
                element={
                  <ProtectedRoute>
                    <RequestDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Recycler Protected Routes */}
              <Route
                path="/recycler-dashboard"
                element={
                  <RoleRoute allowedRoles={['recycler', 'admin']}>
                    <RecyclerDashboardPage />
                  </RoleRoute>
                }
              />
              <Route
                path="/recycler-pickup-spots"
                element={
                  <RoleRoute allowedRoles={['recycler', 'admin']}>
                    <RecyclerPickupSpotsPage />
                  </RoleRoute>
                }
              />
              <Route
                path="/recycler-profile"
                element={
                  <RoleRoute allowedRoles={['recycler', 'admin']}>
                    <RecyclerProfilePage />
                  </RoleRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin-dashboard"
                element={
                  <RoleRoute allowedRoles={['admin']}>
                    <AdminDashboardPage />
                  </RoleRoute>
                }
              />
              <Route
                path="/admin/records"
                element={
                  <RoleRoute allowedRoles={['admin']}>
                    <AdminRecordsPage />
                  </RoleRoute>
                }
              />
              <Route
                path="/admin/survey"
                element={
                  <RoleRoute allowedRoles={['admin']}>
                    <AdminSurveyPage />
                  </RoleRoute>
                }
              />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
