import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUsers, FaChalkboardTeacher, FaGuitar, FaCalendarAlt, FaDoorOpen,
  FaHandHolding, FaStar, FaClipboardList, FaGraduationCap, FaMoneyBillWave,
  FaCheckSquare, FaBook, FaHome, FaEnvelope, FaRedo, FaSun, FaDrum,
  FaTrophy, FaWallet, FaExchangeAlt, FaPlayCircle, FaClock, FaFileAlt,
  FaCertificate, FaShoppingBag, FaRobot, FaBrain, FaMusic, FaLightbulb,
  FaBullhorn, FaLayerGroup
} from 'react-icons/fa';

const features = [
  { name: 'Students', desc: 'Student enrollment & profiles', icon: <FaUsers />, path: '/students' },
  { name: 'Teachers', desc: 'Teacher profiles & specialties', icon: <FaChalkboardTeacher />, path: '/teachers' },
  { name: 'Instruments', desc: 'Instrument tracking', icon: <FaGuitar />, path: '/instruments' },
  { name: 'Lessons', desc: 'Lesson scheduling (private/group)', icon: <FaCalendarAlt />, path: '/lessons' },
  { name: 'Rooms', desc: 'Room & studio booking', icon: <FaDoorOpen />, path: '/rooms' },
  { name: 'Rentals', desc: 'Instrument rental management', icon: <FaHandHolding />, path: '/rentals' },
  { name: 'Recitals', desc: 'Recital & performance planning', icon: <FaStar />, path: '/recitals' },
  { name: 'Practice Logs', desc: 'Practice log tracking', icon: <FaClipboardList />, path: '/practice-logs' },
  { name: 'Grades', desc: 'Grading & level advancement', icon: <FaGraduationCap />, path: '/grades' },
  { name: 'Billing', desc: 'Tuition billing & payments', icon: <FaMoneyBillWave />, path: '/billing' },
  { name: 'Attendance', desc: 'Attendance tracking', icon: <FaCheckSquare />, path: '/attendance' },
  { name: 'Music Library', desc: 'Sheet music catalog', icon: <FaBook />, path: '/music-library' },
  { name: 'Families', desc: 'Family/sibling accounts', icon: <FaHome />, path: '/families' },
  { name: 'Messages', desc: 'Communication portal', icon: <FaEnvelope />, path: '/messages' },
  { name: 'Makeup Lessons', desc: 'Make-up lesson management', icon: <FaRedo />, path: '/makeup-lessons' },
  { name: 'Summer Camps', desc: 'Summer camp registration', icon: <FaSun />, path: '/summer-camps' },
  { name: 'Ensembles', desc: 'Ensemble/band groupings', icon: <FaDrum />, path: '/ensembles' },
  { name: 'Competitions', desc: 'Competition registration', icon: <FaTrophy />, path: '/competitions' },
  { name: 'Theory Classes', desc: 'Theory class management', icon: <FaBook />, path: '/theory-classes' },
  { name: 'Payroll', desc: 'Teacher payroll & commission', icon: <FaWallet />, path: '/payroll' },
  { name: 'Substitutes', desc: 'Substitute teacher management', icon: <FaExchangeAlt />, path: '/substitutes' },
  { name: 'Trial Lessons', desc: 'Trial lesson booking', icon: <FaPlayCircle />, path: '/trial-lessons' },
  { name: 'Waiting List', desc: 'Waiting list management', icon: <FaClock />, path: '/waiting-list' },
  { name: 'Report Cards', desc: 'Report cards', icon: <FaFileAlt />, path: '/report-cards' },
  { name: 'Certificates', desc: 'Certificate generation', icon: <FaCertificate />, path: '/certificates' },
  { name: 'Merchandise', desc: 'Merchandise sales', icon: <FaShoppingBag />, path: '/merchandise' },
];

const aiFeatures = [
  { name: 'Practice Plan Generator', desc: 'AI-generated personalized practice plans', icon: <FaRobot />, path: '/ai/practice-plan' },
  { name: 'Progress Report Writer', desc: 'AI-written student progress reports', icon: <FaBrain />, path: '/ai/progress-report' },
  { name: 'Recital Program Creator', desc: 'AI-designed recital programs', icon: <FaMusic />, path: '/ai/recital-program' },
  { name: 'Skill Assessment', desc: 'AI skill assessment analysis', icon: <FaLightbulb />, path: '/ai/skill-assessment' },
  { name: 'Lesson Plan Suggestions', desc: 'AI-suggested lesson plans', icon: <FaClipboardList />, path: '/ai/lesson-plan' },
  { name: 'Marketing Campaigns', desc: 'AI-generated marketing content', icon: <FaBullhorn />, path: '/ai/marketing-campaign' },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to AI Music School Academy Manager</p>
      </div>

      <div className="dashboard-section">
        <h2><FaLayerGroup className="section-icon" /> School Management</h2>
        <div className="card-grid">
          {features.map(f => (
            <div className="dashboard-card" key={f.path} onClick={() => navigate(f.path)}>
              <div className="card-icon">{f.icon}</div>
              <h3>{f.name}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <h2><FaRobot className="section-icon" /> AI Features</h2>
        <div className="card-grid">
          {aiFeatures.map(f => (
            <div className="dashboard-card ai-card" key={f.path} onClick={() => navigate(f.path)}>
              <div className="card-icon">{f.icon}</div>
              <h3>{f.name}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
