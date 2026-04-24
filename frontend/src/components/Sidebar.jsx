import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaMusic, FaUsers, FaGuitar, FaCalendarAlt, FaDoorOpen, FaHandHolding,
  FaStar, FaClipboardList, FaGraduationCap, FaMoneyBillWave, FaCheckSquare,
  FaBook, FaHome, FaEnvelope, FaRedo, FaSun, FaDrum, FaTrophy,
  FaChalkboardTeacher, FaWallet, FaExchangeAlt, FaPlayCircle, FaClock,
  FaFileAlt, FaCertificate, FaShoppingBag, FaRobot, FaBrain, FaLightbulb,
  FaBullhorn, FaBars, FaSignOutAlt, FaTimes
} from 'react-icons/fa';

const groups = [
  {
    title: 'People',
    links: [
      { to: '/students', icon: <FaUsers />, label: 'Students' },
      { to: '/teachers', icon: <FaChalkboardTeacher />, label: 'Teachers' },
      { to: '/families', icon: <FaHome />, label: 'Families' },
    ]
  },
  {
    title: 'Scheduling',
    links: [
      { to: '/lessons', icon: <FaCalendarAlt />, label: 'Lessons' },
      { to: '/rooms', icon: <FaDoorOpen />, label: 'Rooms' },
      { to: '/makeup-lessons', icon: <FaRedo />, label: 'Makeup Lessons' },
      { to: '/trial-lessons', icon: <FaPlayCircle />, label: 'Trial Lessons' },
      { to: '/waiting-list', icon: <FaClock />, label: 'Waiting List' },
    ]
  },
  {
    title: 'Programs',
    links: [
      { to: '/recitals', icon: <FaStar />, label: 'Recitals' },
      { to: '/ensembles', icon: <FaDrum />, label: 'Ensembles' },
      { to: '/competitions', icon: <FaTrophy />, label: 'Competitions' },
      { to: '/theory-classes', icon: <FaBook />, label: 'Theory Classes' },
      { to: '/summer-camps', icon: <FaSun />, label: 'Summer Camps' },
    ]
  },
  {
    title: 'Academic',
    links: [
      { to: '/practice-logs', icon: <FaClipboardList />, label: 'Practice Logs' },
      { to: '/grades', icon: <FaGraduationCap />, label: 'Grades' },
      { to: '/report-cards', icon: <FaFileAlt />, label: 'Report Cards' },
      { to: '/certificates', icon: <FaCertificate />, label: 'Certificates' },
      { to: '/attendance', icon: <FaCheckSquare />, label: 'Attendance' },
    ]
  },
  {
    title: 'Resources',
    links: [
      { to: '/instruments', icon: <FaGuitar />, label: 'Instruments' },
      { to: '/rentals', icon: <FaHandHolding />, label: 'Rentals' },
      { to: '/music-library', icon: <FaBook />, label: 'Music Library' },
      { to: '/merchandise', icon: <FaShoppingBag />, label: 'Merchandise' },
    ]
  },
  {
    title: 'Finance',
    links: [
      { to: '/billing', icon: <FaMoneyBillWave />, label: 'Billing' },
      { to: '/payroll', icon: <FaWallet />, label: 'Payroll' },
    ]
  },
  {
    title: 'Communication',
    links: [
      { to: '/messages', icon: <FaEnvelope />, label: 'Messages' },
      { to: '/substitutes', icon: <FaExchangeAlt />, label: 'Substitutes' },
    ]
  },
  {
    title: 'AI Tools',
    links: [
      { to: '/ai/practice-plan', icon: <FaRobot />, label: 'Practice Plan' },
      { to: '/ai/progress-report', icon: <FaBrain />, label: 'Progress Report' },
      { to: '/ai/recital-program', icon: <FaMusic />, label: 'Recital Program' },
      { to: '/ai/skill-assessment', icon: <FaLightbulb />, label: 'Skill Assessment' },
      { to: '/ai/lesson-plan', icon: <FaClipboardList />, label: 'Lesson Plan' },
      { to: '/ai/marketing-campaign', icon: <FaBullhorn />, label: 'Marketing' },
    ]
  },
];

export default function Sidebar({ open, onToggle }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      {!open && (
        <button className="sidebar-toggle visible" onClick={onToggle}>
          <FaBars />
        </button>
      )}
      <aside className={`sidebar ${open ? '' : 'closed'}`}>
        <div className="sidebar-header">
          <FaMusic className="logo-icon" />
          <h2>
            Music School
            <span>Academy Manager</span>
          </h2>
          <button className="modal-close" onClick={onToggle} style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.6)' }}>
            <FaTimes />
          </button>
        </div>
        <div className="sidebar-nav">
          <div className="sidebar-group">
            <NavLink to="/" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <FaHome /> Dashboard
            </NavLink>
          </div>
          {groups.map(group => (
            <div className="sidebar-group" key={group.title}>
              <div className="sidebar-group-title">{group.title}</div>
              {group.links.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                  {link.icon} {link.label}
                </NavLink>
              ))}
            </div>
          ))}
        </div>
        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
