import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Achievements } from './pages/Achievements';
import { Analytics } from './pages/Analytics';
import { Dashboard } from './pages/Dashboard';
import { ExploreSkills } from './pages/ExploreSkills';
import { Login } from './pages/Login';
import { MyLearning } from './pages/MyLearning';
import { Profile } from './pages/Profile';
import { Register } from './pages/Register';
import { Settings } from './pages/Settings';
import { SkillDetails } from './pages/SkillDetails';
import { TasksGoals } from './pages/TasksGoals';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <Login />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicOnlyRoute>
                  <Register />
                </PublicOnlyRoute>
              }
            />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="explore" element={<ExploreSkills />} />
              <Route path="skills/:skillId" element={<SkillDetails />} />
              <Route path="my-learning" element={<MyLearning />} />
              <Route path="tasks-goals" element={<TasksGoals />} />
              <Route path="achievements" element={<Achievements />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}
