const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { initDB } = require('./db');
const authMiddleware = require('./middleware/auth');
const {validateRuntime}=require('./governance/runtime');
const {createProviderGate}=require('./governance/providerGate');
const governanceRouter=require('./governance/router');

validateRuntime();

const app = express();
const PORT = process.env.BACKEND_PORT || 4001;
const CLIENT_URL = process.env.CLIENT_URL || `http://localhost:${process.env.FRONTEND_PORT || 3001}`;

// Security
app.use(helmet());
const allowedOrigins=String(process.env.CORS_ORIGINS||CLIENT_URL).split(',').map(v=>v.trim()).filter(Boolean);
app.use(cors({origin:(origin,cb)=>!origin||allowedOrigins.includes(origin)?cb(null,true):cb(new Error('Origin not allowed by CORS')),credentials:true}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(createProviderGate(['/api/ai','/api/gap','/api/lesson-curator-agent','/api/vision-practice-eval','/api/engagement-agent','/api/ensemble-autonomous','/api/digital-recital-platform']));

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

// Auth routes (public)
app.use('/api/auth', authRoutes);

// Apply auth middleware to all other /api routes
app.use('/api', authMiddleware);
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
app.use('/api/governed-media-releases',governanceRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Initialize database and start server
async function start() {
  try {
    if(process.env.ENABLE_LEGACY_SCHEMA_BOOTSTRAP==='true') await initDB();
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

// === BATCH 05 AUTO-MOUNT (custom feature suggestions) ===
app.use('/api/lesson-curator-agent', require('./routes/lesson-curator-agent'));
app.use('/api/vision-practice-eval', require('./routes/vision-practice-eval'));
app.use('/api/engagement-agent', require('./routes/engagement-agent'));
app.use('/api/ensemble-autonomous', require('./routes/ensemble-autonomous'));
app.use('/api/digital-recital-platform', require('./routes/digital-recital-platform'));

// === Batch 05 Gaps & Frontend Mounts ===
try { const _gap_student_matching = require('./routes/gap-student-matching'); app.use('/api/gap-student-matching', _gap_student_matching); } catch(e) { console.error('gap mount fail student-matching:', e.message); }
try { const _gap_retention_risk = require('./routes/gap-retention-risk'); app.use('/api/gap-retention-risk', _gap_retention_risk); } catch(e) { console.error('gap mount fail retention-risk:', e.message); }
try { const _gap_ensemble_assignment = require('./routes/gap-ensemble-assignment'); app.use('/api/gap-ensemble-assignment', _gap_ensemble_assignment); } catch(e) { console.error('gap mount fail ensemble-assignment:', e.message); }
try { const _gap_event_promotion = require('./routes/gap-event-promotion'); app.use('/api/gap-event-promotion', _gap_event_promotion); } catch(e) { console.error('gap mount fail event-promotion:', e.message); }
try { const _gap_parent = require('./routes/gap-parent'); app.use('/api/gap-parent', _gap_parent); } catch(e) { console.error('gap mount fail parent:', e.message); }
try { const _gap_student = require('./routes/gap-student'); app.use('/api/gap-student', _gap_student); } catch(e) { console.error('gap mount fail student:', e.message); }
try { const _gap_video = require('./routes/gap-video'); app.use('/api/gap-video', _gap_video); } catch(e) { console.error('gap mount fail video:', e.message); }
try { const _gap_native = require('./routes/gap-native'); app.use('/api/gap-native', _gap_native); } catch(e) { console.error('gap mount fail native:', e.message); }
try { const _gap_copyright_managed = require('./routes/gap-copyright-managed'); app.use('/api/gap-copyright-managed', _gap_copyright_managed); } catch(e) { console.error('gap mount fail copyright-managed:', e.message); }
try { const _gap_live = require('./routes/gap-live'); app.use('/api/gap-live', _gap_live); } catch(e) { console.error('gap mount fail live:', e.message); }
try { const _gap_webhooks = require('./routes/gap-webhooks'); app.use('/api/gap-webhooks', _gap_webhooks); } catch(e) { console.error('gap mount fail webhooks:', e.message); }
// === End Batch 05 Mounts ===

// === Custom Views (Academy Views) ===
try {
  const customViewsRoutes = require('./routes/customViews');
  app.use('/api/custom-views', customViewsRoutes);
  console.log('Custom Views mounted at /api/custom-views');
} catch (e) { console.error('custom-views mount fail:', e.message); }
