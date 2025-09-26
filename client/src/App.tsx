import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NewRequestPage from './pages/NewRequestPage';
import AppLayout from './components/AppLayout';
import { useAuth } from './context/AuthContext';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/requests/new" element={<NewRequestPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const ProtectedRoute = () => {
  const { user, ready } = useAuth();
  if (!ready) {
    return (
      <div className="page">
        <p className="muted">Loading session…</p>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default App;
