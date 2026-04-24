const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { pool } = require('../db');

async function callOpenRouter(systemPrompt, userPrompt) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:3001',
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 2000
    })
  });
  const data = await response.json();
  return data;
}

// POST /practice-plan
router.post('/practice-plan', async (req, res) => {
  try {
    const { studentId } = req.body;
    const student = await pool.query('SELECT * FROM students WHERE id = $1', [studentId]);
    if (student.rows.length === 0) return res.status(404).json({ error: 'Student not found' });

    const practiceLogs = await pool.query('SELECT * FROM practice_logs WHERE student_id = $1 ORDER BY date DESC LIMIT 20', [studentId]);
    const grades = await pool.query('SELECT * FROM grades WHERE student_id = $1 ORDER BY date DESC LIMIT 5', [studentId]);

    const s = student.rows[0];
    const prompt = `Create a personalized weekly practice plan for this music student:
Name: ${s.first_name} ${s.last_name}
Instrument: ${s.instrument || 'Not specified'}
Level: ${s.level}
Recent practice logs: ${JSON.stringify(practiceLogs.rows)}
Recent grades: ${JSON.stringify(grades.rows)}

Please provide a structured daily practice plan for 7 days with specific exercises, pieces to work on, time allocations, and goals.`;

    const aiResponse = await callOpenRouter(
      'You are an expert music education AI assistant specializing in creating personalized practice plans for music students of all levels.',
      prompt
    );

    const output = aiResponse.choices?.[0]?.message?.content || 'No response generated';

    await pool.query(
      'INSERT INTO ai_outputs (type, input_data, output_data, model) VALUES ($1, $2, $3, $4)',
      ['practice-plan', JSON.stringify({ studentId }), JSON.stringify({ plan: output }), process.env.OPENROUTER_MODEL]
    );

    res.json({ plan: output, student: s });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /progress-report
router.post('/progress-report', async (req, res) => {
  try {
    const { studentId } = req.body;
    const student = await pool.query('SELECT * FROM students WHERE id = $1', [studentId]);
    if (student.rows.length === 0) return res.status(404).json({ error: 'Student not found' });

    const grades = await pool.query('SELECT * FROM grades WHERE student_id = $1 ORDER BY date DESC', [studentId]);
    const practiceLogs = await pool.query('SELECT * FROM practice_logs WHERE student_id = $1 ORDER BY date DESC LIMIT 30', [studentId]);
    const attendance = await pool.query('SELECT * FROM attendance WHERE student_id = $1 ORDER BY date DESC LIMIT 30', [studentId]);

    const s = student.rows[0];
    const prompt = `Write a professional progress report for the parents of this music student:
Name: ${s.first_name} ${s.last_name}
Instrument: ${s.instrument || 'Not specified'}
Level: ${s.level}
Enrollment Date: ${s.enrollment_date}
Grades: ${JSON.stringify(grades.rows)}
Practice Logs (last 30): ${JSON.stringify(practiceLogs.rows)}
Attendance (last 30): ${JSON.stringify(attendance.rows)}

Write a warm, professional progress report suitable for parents. Include strengths, areas for improvement, practice habits analysis, and recommendations.`;

    const aiResponse = await callOpenRouter(
      'You are an expert music education AI assistant who writes professional, encouraging progress reports for music students.',
      prompt
    );

    const output = aiResponse.choices?.[0]?.message?.content || 'No response generated';

    await pool.query(
      'INSERT INTO ai_outputs (type, input_data, output_data, model) VALUES ($1, $2, $3, $4)',
      ['progress-report', JSON.stringify({ studentId }), JSON.stringify({ report: output }), process.env.OPENROUTER_MODEL]
    );

    res.json({ report: output, student: s });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /recital-program
router.post('/recital-program', async (req, res) => {
  try {
    const { recitalId } = req.body;
    const recital = await pool.query('SELECT * FROM recitals WHERE id = $1', [recitalId]);
    if (recital.rows.length === 0) return res.status(404).json({ error: 'Recital not found' });

    const performers = await pool.query(`
      SELECT rp.*, s.first_name, s.last_name
      FROM recital_performers rp
      LEFT JOIN students s ON rp.student_id = s.id
      WHERE rp.recital_id = $1
      ORDER BY rp.performance_order
    `, [recitalId]);

    const r = recital.rows[0];
    const prompt = `Create a beautiful recital program for this event:
Title: ${r.title}
Date: ${r.date}
Time: ${r.time}
Venue: ${r.venue}
Description: ${r.description || ''}
Performers: ${JSON.stringify(performers.rows)}

Create a polished, professional recital program including a welcome message, performer bios (creative ones based on names), program order, and closing remarks.`;

    const aiResponse = await callOpenRouter(
      'You are an expert music education AI assistant who creates beautiful, professional recital programs.',
      prompt
    );

    const output = aiResponse.choices?.[0]?.message?.content || 'No response generated';

    await pool.query(
      'INSERT INTO ai_outputs (type, input_data, output_data, model) VALUES ($1, $2, $3, $4)',
      ['recital-program', JSON.stringify({ recitalId }), JSON.stringify({ program: output }), process.env.OPENROUTER_MODEL]
    );

    res.json({ program: output, recital: r });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /skill-assessment
router.post('/skill-assessment', async (req, res) => {
  try {
    const { studentId } = req.body;
    const student = await pool.query('SELECT * FROM students WHERE id = $1', [studentId]);
    if (student.rows.length === 0) return res.status(404).json({ error: 'Student not found' });

    const grades = await pool.query('SELECT * FROM grades WHERE student_id = $1 ORDER BY date DESC', [studentId]);
    const practiceLogs = await pool.query('SELECT * FROM practice_logs WHERE student_id = $1 ORDER BY date DESC LIMIT 30', [studentId]);
    const reportCards = await pool.query('SELECT * FROM report_cards WHERE student_id = $1 ORDER BY year DESC, term DESC LIMIT 5', [studentId]);

    const s = student.rows[0];
    const prompt = `Provide a comprehensive skill assessment for this music student:
Name: ${s.first_name} ${s.last_name}
Instrument: ${s.instrument || 'Not specified'}
Level: ${s.level}
Grades: ${JSON.stringify(grades.rows)}
Practice Logs: ${JSON.stringify(practiceLogs.rows)}
Report Cards: ${JSON.stringify(reportCards.rows)}

Analyze and assess the student's skills in: Technique, Musicality, Theory Knowledge, Sight-Reading, Practice Habits, Performance. Provide ratings, detailed analysis, and specific recommendations for each area.`;

    const aiResponse = await callOpenRouter(
      'You are an expert music education AI assistant specializing in comprehensive student skill assessments.',
      prompt
    );

    const output = aiResponse.choices?.[0]?.message?.content || 'No response generated';

    await pool.query(
      'INSERT INTO ai_outputs (type, input_data, output_data, model) VALUES ($1, $2, $3, $4)',
      ['skill-assessment', JSON.stringify({ studentId }), JSON.stringify({ assessment: output }), process.env.OPENROUTER_MODEL]
    );

    res.json({ assessment: output, student: s });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /lesson-plan
router.post('/lesson-plan', async (req, res) => {
  try {
    const { studentId, teacherId } = req.body;
    const student = await pool.query('SELECT * FROM students WHERE id = $1', [studentId]);
    if (student.rows.length === 0) return res.status(404).json({ error: 'Student not found' });

    const teacher = await pool.query('SELECT * FROM teachers WHERE id = $1', [teacherId]);
    if (teacher.rows.length === 0) return res.status(404).json({ error: 'Teacher not found' });

    const s = student.rows[0];
    const t = teacher.rows[0];
    const prompt = `Create a detailed lesson plan for the next 4 lessons:
Student: ${s.first_name} ${s.last_name}
Student Level: ${s.level}
Student Instrument: ${s.instrument || 'Not specified'}
Teacher: ${t.first_name} ${t.last_name}
Teacher Specialties: ${(t.specialties || []).join(', ')}

Create a structured 4-lesson plan with objectives, warm-up exercises, technical studies, repertoire work, sight-reading exercises, theory integration, and homework assignments for each lesson.`;

    const aiResponse = await callOpenRouter(
      'You are an expert music education AI assistant who creates detailed, effective lesson plans for music teachers.',
      prompt
    );

    const output = aiResponse.choices?.[0]?.message?.content || 'No response generated';

    await pool.query(
      'INSERT INTO ai_outputs (type, input_data, output_data, model) VALUES ($1, $2, $3, $4)',
      ['lesson-plan', JSON.stringify({ studentId, teacherId }), JSON.stringify({ lessonPlan: output }), process.env.OPENROUTER_MODEL]
    );

    res.json({ lessonPlan: output, student: s, teacher: t });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /marketing-campaign
router.post('/marketing-campaign', async (req, res) => {
  try {
    const { campaignType, targetAudience } = req.body;

    const prompt = `Create a marketing campaign for a music school:
Campaign Type: ${campaignType || 'General Enrollment'}
Target Audience: ${targetAudience || 'Parents of children ages 5-18'}

Create compelling marketing content including:
1. Campaign headline and tagline
2. Email template
3. Social media posts (3 variations)
4. Flyer/brochure content
5. Key selling points
6. Call-to-action suggestions`;

    const aiResponse = await callOpenRouter(
      'You are an expert music education marketing AI assistant who creates compelling enrollment campaigns for music schools and academies.',
      prompt
    );

    const output = aiResponse.choices?.[0]?.message?.content || 'No response generated';

    await pool.query(
      'INSERT INTO ai_outputs (type, input_data, output_data, model) VALUES ($1, $2, $3, $4)',
      ['marketing-campaign', JSON.stringify({ campaignType, targetAudience }), JSON.stringify({ campaign: output }), process.env.OPENROUTER_MODEL]
    );

    res.json({ campaign: output });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
