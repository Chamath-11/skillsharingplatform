import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import CreatePostPage from './pages/CreatePostPage';
import LearningPlansPage from './pages/LearningPlansPage';
import CreatePlanPage from './pages/CreatePlanPage';
import NotificationsPage from './pages/NotificationsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PostDetailsPage from './pages/PostDetailsPage';
import PlanDetailsPage from './pages/PlanDetailsPage';
import ResourceLibraryPage from './pages/ResourceLibraryPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile/:userId" element={<ProfilePage />} />
              <Route path="/post/:postId" element={<PostDetailsPage />} />
              <Route path="/plan/:planId" element={<PlanDetailsPage />} />
              <Route path="/resources" element={<ResourceLibraryPage />} />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              } />
              <Route path="/create-post" element={
                <ProtectedRoute>
                  <CreatePostPage />
                </ProtectedRoute>
              } />
              <Route path="/learning-plans" element={
                <ProtectedRoute>
                  <LearningPlansPage />
                </ProtectedRoute>
              } />
              <Route path="/create-plan" element={
                <ProtectedRoute>
                  <CreatePlanPage />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;