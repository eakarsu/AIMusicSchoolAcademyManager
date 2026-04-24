const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const express = require('express');
const cors = require('cors');
const { initDB } = require('./db');

const app = express();
const PORT = process.env.BACKEND_PORT || 4001;

// Middleware
app.use(cors({
  origin: [`http://localhost:${process.env.FRONTEND_PORT || 3001}`, 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Import routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const teacherRoutes = require('./routes/teachers');
const instrumentRoutes = require('./routes/instruments');
const lessonRoutes = require('./routes/lessons');
const roomRoutes = require('./routes/rooms');
const rentalRoutes = require('./routes/rentals');
const recitalRoutes = require('./routes/recitals');
const practiceLogRoutes = require('./routes/practiceLogs');
const gradeRoutes = require('./routes/grades');
const billingRoutes = require('./routes/billing');
const attendanceRoutes = require('./routes/attendance');
const musicLibraryRoutes = require('./routes/musicLibrary');
const familyRoutes = require('./routes/families');
const messageRoutes = require('./routes/messages');
const makeupLessonRoutes = require('./routes/makeupLessons');
const summerCampRoutes = require('./routes/summerCamps');
const ensembleRoutes = require('./routes/ensembles');
const competitionRoutes = require('./routes/competitions');
const theoryClassRoutes = require('./routes/theoryClasses');
const payrollRoutes = require('./routes/payroll');
const substituteRoutes = require('./routes/substitutes');
const trialLessonRoutes = require('./routes/trialLessons');
const waitingListRoutes = require('./routes/waitingList');
const reportCardRoutes = require('./routes/reportCards');
const certificateRoutes = require('./routes/certificates');
const merchandiseRoutes = require('./routes/merchandise');
const aiRoutes = require('./routes/ai');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/instruments', instrumentRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/recitals', recitalRoutes);
app.use('/api/practice-logs', practiceLogRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/music-library', musicLibraryRoutes);
app.use('/api/families', familyRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/makeup-lessons', makeupLessonRoutes);
app.use('/api/summer-camps', summerCampRoutes);
app.use('/api/ensembles', ensembleRoutes);
app.use('/api/competitions', competitionRoutes);
app.use('/api/theory-classes', theoryClassRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/substitutes', substituteRoutes);
app.use('/api/trial-lessons', trialLessonRoutes);
app.use('/api/waiting-list', waitingListRoutes);
app.use('/api/report-cards', reportCardRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/merchandise', merchandiseRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Initialize database and start server
async function start() {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
