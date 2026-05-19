const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');

// ---- helpers ----
const INSTRUMENTS = ['Piano', 'Violin', 'Guitar', 'Drums', 'Cello', 'Flute', 'Saxophone', 'Voice'];
const INSTRUMENT_COLORS = {
  Piano: '#8b5cf6',
  Violin: '#ef4444',
  Guitar: '#f59e0b',
  Drums: '#10b981',
  Cello: '#3b82f6',
  Flute: '#ec4899',
  Saxophone: '#14b8a6',
  Voice: '#a855f7',
};
const TEACHERS = [
  'Ms. Johnson', 'Mr. Patel', 'Dr. Smith', 'Mrs. Lopez',
  'Mr. Tanaka', 'Ms. Chen', 'Mr. Garcia', 'Mrs. Kim'
];
const STUDENTS = [
  { id: 1, name: 'Emma Wilson', instrument: 'Piano' },
  { id: 2, name: 'Liam Brown', instrument: 'Violin' },
  { id: 3, name: 'Olivia Davis', instrument: 'Guitar' },
  { id: 4, name: 'Noah Miller', instrument: 'Drums' },
  { id: 5, name: 'Ava Garcia', instrument: 'Cello' },
  { id: 6, name: 'Ethan Martinez', instrument: 'Flute' },
  { id: 7, name: 'Sophia Anderson', instrument: 'Saxophone' },
  { id: 8, name: 'Mason Taylor', instrument: 'Voice' },
  { id: 9, name: 'Isabella Thomas', instrument: 'Piano' },
  { id: 10, name: 'Lucas Moore', instrument: 'Violin' },
  { id: 11, name: 'Mia Jackson', instrument: 'Guitar' },
  { id: 12, name: 'James White', instrument: 'Cello' },
];
const PIECES = [
  { id: 1, title: 'Für Elise', composer: 'Beethoven', duration: 3 },
  { id: 2, title: 'Canon in D', composer: 'Pachelbel', duration: 5 },
  { id: 3, title: 'Clair de Lune', composer: 'Debussy', duration: 5 },
  { id: 4, title: 'Moonlight Sonata', composer: 'Beethoven', duration: 6 },
  { id: 5, title: 'Spring (Four Seasons)', composer: 'Vivaldi', duration: 4 },
  { id: 6, title: 'Air on the G String', composer: 'Bach', duration: 4 },
  { id: 7, title: 'Gymnopédie No. 1', composer: 'Satie', duration: 3 },
  { id: 8, title: 'Hungarian Dance No. 5', composer: 'Brahms', duration: 3 },
  { id: 9, title: 'The Entertainer', composer: 'Joplin', duration: 4 },
  { id: 10, title: 'Nocturne Op. 9 No. 2', composer: 'Chopin', duration: 4 },
];

function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ---- VIZ 1: lesson calendar (week grid) ----
router.get('/lesson-calendar', (req, res) => {
  const week = req.query.week || 'current';
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const timeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  const rnd = seededRandom(week === 'current' ? 42 : 99);
  const lessons = [];
  let id = 1;
  for (const day of days) {
    for (const slot of timeSlots) {
      // ~55% chance of a lesson at any slot/day
      if (rnd() < 0.55) {
        const student = STUDENTS[Math.floor(rnd() * STUDENTS.length)];
        const teacher = TEACHERS[Math.floor(rnd() * TEACHERS.length)];
        lessons.push({
          id: id++,
          day,
          time: slot,
          student: student.name,
          teacher,
          instrument: student.instrument,
          color: INSTRUMENT_COLORS[student.instrument],
          duration: 45,
        });
      }
    }
  }
  res.json({
    week,
    days,
    timeSlots,
    teachers: TEACHERS,
    instruments: INSTRUMENTS.map(i => ({ name: i, color: INSTRUMENT_COLORS[i] })),
    lessons,
    totalLessons: lessons.length,
  });
});

// ---- VIZ 2: student progress ----
router.get('/student-progress', (req, res) => {
  const studentId = parseInt(req.query.studentId) || 0;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const students = studentId
    ? STUDENTS.filter(s => s.id === studentId)
    : STUDENTS.slice(0, 6);
  const series = students.map(s => {
    const rnd = seededRandom(s.id * 7);
    let grade = 50 + Math.floor(rnd() * 20);
    const points = months.map((m, idx) => {
      grade = Math.min(100, grade + Math.floor(rnd() * 6) - 1);
      return { month: m, grade };
    });
    return {
      studentId: s.id,
      name: s.name,
      instrument: s.instrument,
      color: INSTRUMENT_COLORS[s.instrument],
      points,
    };
  });

  // combined dataset format suitable for recharts (one row per month)
  const combined = months.map((m, idx) => {
    const row = { month: m };
    series.forEach(s => {
      row[s.name] = s.points[idx].grade;
    });
    return row;
  });

  res.json({
    students: STUDENTS,
    months,
    series,
    combined,
  });
});

// ---- NON-VIZ 1: invoice PDF ----
router.get('/invoice-options', (req, res) => {
  const months = [];
  const now = new Date();
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleString('en-US', { month: 'long', year: 'numeric' }),
    });
  }
  res.json({ students: STUDENTS, months });
});

router.get('/invoice-pdf', (req, res) => {
  const studentId = parseInt(req.query.studentId) || 1;
  const month = req.query.month || '2026-05';
  const student = STUDENTS.find(s => s.id === studentId) || STUDENTS[0];
  const rnd = seededRandom(studentId * 100 + parseInt(month.replace('-', '')));
  const rate = 60; // $/hr
  const lessonCount = 3 + Math.floor(rnd() * 5);
  const lessons = [];
  let totalHours = 0;
  for (let i = 0; i < lessonCount; i++) {
    const day = 1 + Math.floor(rnd() * 28);
    const hours = 0.75 + Math.floor(rnd() * 2) * 0.25;
    totalHours += hours;
    lessons.push({
      date: `${month}-${String(day).padStart(2, '0')}`,
      teacher: TEACHERS[Math.floor(rnd() * TEACHERS.length)],
      instrument: student.instrument,
      hours,
      amount: +(hours * rate).toFixed(2),
    });
  }
  lessons.sort((a, b) => a.date.localeCompare(b.date));
  const total = +(totalHours * rate).toFixed(2);

  const doc = new PDFDocument({ size: 'LETTER', margin: 50 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="invoice_${student.id}_${month}.pdf"`);
  doc.pipe(res);

  doc.fillColor('#7c3aed').fontSize(24).text('Music School Academy', { align: 'left' });
  doc.moveDown(0.2);
  doc.fillColor('#111').fontSize(10).text('Invoice', { align: 'left' });
  doc.moveDown();

  doc.fontSize(11).fillColor('#374151');
  doc.text(`Invoice #: INV-${student.id}-${month.replace('-', '')}`);
  doc.text(`Date: ${new Date().toISOString().slice(0, 10)}`);
  doc.text(`Billing Period: ${month}`);
  doc.moveDown();

  doc.fontSize(12).fillColor('#111').text(`Billed To: ${student.name}`);
  doc.fontSize(10).fillColor('#374151').text(`Primary instrument: ${student.instrument}`);
  doc.moveDown();

  // Table header
  doc.fontSize(11).fillColor('#7c3aed').text('Lessons', { underline: true });
  doc.moveDown(0.3);
  const tableTop = doc.y;
  const colX = [50, 140, 260, 380, 460];
  doc.fontSize(10).fillColor('#111');
  doc.text('Date', colX[0], tableTop);
  doc.text('Teacher', colX[1], tableTop);
  doc.text('Instrument', colX[2], tableTop);
  doc.text('Hours', colX[3], tableTop);
  doc.text('Amount', colX[4], tableTop);
  doc.moveTo(50, tableTop + 14).lineTo(560, tableTop + 14).strokeColor('#ddd').stroke();

  let y = tableTop + 20;
  doc.fillColor('#374151').fontSize(10);
  for (const l of lessons) {
    doc.text(l.date, colX[0], y);
    doc.text(l.teacher, colX[1], y);
    doc.text(l.instrument, colX[2], y);
    doc.text(l.hours.toFixed(2), colX[3], y);
    doc.text(`$${l.amount.toFixed(2)}`, colX[4], y);
    y += 18;
  }

  doc.moveTo(50, y + 4).lineTo(560, y + 4).strokeColor('#ddd').stroke();
  y += 18;
  doc.fontSize(11).fillColor('#111');
  doc.text(`Total hours: ${totalHours.toFixed(2)}`, 50, y);
  doc.text(`Rate: $${rate.toFixed(2)}/hr`, 250, y);
  doc.fontSize(13).fillColor('#7c3aed').text(`Total Due: $${total.toFixed(2)}`, 400, y);

  doc.moveDown(4);
  doc.fontSize(9).fillColor('#9ca3af').text('Thank you for choosing Music School Academy.', 50, doc.y, { align: 'center' });

  doc.end();
});

// ---- NON-VIZ 2: recital program ----
router.get('/recital-options', (req, res) => {
  res.json({ students: STUDENTS, pieces: PIECES });
});

router.post('/recital-program-pdf', (req, res) => {
  const { title, date, venue, items } = req.body || {};
  const programTitle = title || 'Spring Recital 2026';
  const programDate = date || new Date().toISOString().slice(0, 10);
  const programVenue = venue || 'Main Auditorium';
  const orderedItems = Array.isArray(items) ? items : [];

  const doc = new PDFDocument({ size: 'LETTER', margin: 60 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="recital_program.pdf"`);
  doc.pipe(res);

  // Cover-style header
  doc.fillColor('#7c3aed').fontSize(28).text(programTitle, { align: 'center' });
  doc.moveDown(0.3);
  doc.fillColor('#111').fontSize(14).text(programDate, { align: 'center' });
  doc.fillColor('#6b7280').fontSize(12).text(programVenue, { align: 'center' });
  doc.moveDown(1);
  doc.moveTo(60, doc.y).lineTo(552, doc.y).strokeColor('#7c3aed').lineWidth(2).stroke();
  doc.moveDown(1);

  doc.fontSize(16).fillColor('#7c3aed').text('Program', { align: 'left' });
  doc.moveDown(0.5);

  let totalDuration = 0;
  orderedItems.forEach((it, idx) => {
    const piece = PIECES.find(p => p.id === it.pieceId) || { title: it.pieceTitle, composer: '', duration: 4 };
    const student = STUDENTS.find(s => s.id === it.studentId) || { name: it.studentName || 'Student', instrument: '' };
    totalDuration += piece.duration || 4;
    doc.fontSize(13).fillColor('#111').text(`${idx + 1}. ${piece.title}`, { continued: false });
    doc.fontSize(10).fillColor('#6b7280').text(`    ${piece.composer ? piece.composer + ' • ' : ''}performed by ${student.name} (${student.instrument})`);
    doc.fontSize(9).fillColor('#9ca3af').text(`    Duration ~ ${piece.duration || 4} min`);
    doc.moveDown(0.5);
  });

  doc.moveDown(1);
  doc.moveTo(60, doc.y).lineTo(552, doc.y).strokeColor('#ddd').lineWidth(1).stroke();
  doc.moveDown(0.5);
  doc.fontSize(11).fillColor('#374151').text(`Total program length: ${totalDuration} minutes`, { align: 'right' });
  doc.fontSize(10).fillColor('#9ca3af').text(`Total performances: ${orderedItems.length}`, { align: 'right' });

  doc.moveDown(2);
  doc.fontSize(10).fillColor('#9ca3af').text('Thank you to our students, families, and teachers.', { align: 'center' });

  doc.end();
});

module.exports = router;
