import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { roleLabels } from '../utils/format';

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">Kanona Travel Portal</div>
        <nav>
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/requests/new">New Request</NavLink>
        </nav>
        <div className="user-area">
          {user && (
            <span>
              {user.name} · {roleLabels[user.role]}
            </span>
          )}
          <button className="secondary" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </header>
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
