import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Sidebar.css'

const Sidebar = () => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">📋</span>
        <span className="logo-text">AttendSync</span>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
        <div className="user-info">
          <p className="user-name">{user?.name}</p>
          <p className="user-role">{user?.role}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">🏠</span>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/employees" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">👥</span>
          <span>Employees</span>
        </NavLink>
        <NavLink to="/attendance" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">📅</span>
          <span>Attendance</span>
        </NavLink>
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        <span>←</span>
        <span>Logout</span>
      </button>
    </aside>
  )
}

export default Sidebar