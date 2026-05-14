const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { pool } = require('../db');
const { rateLimiter } = require('../middleware/rateLimiter');

const OPENROUTER_MODEL = 'anthropic/claude-3-5-sonnet-20241022';

async function callOpenRouter(systemPrompt, userPrompt) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:3001',
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || OPENROUTER_MODEL,
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

function parseAIJson(text) {
  if (!text) return null;
  try {
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) return JSON.parse(jsonMatch[1].trim());
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1) return JSON.parse(text.slice(start, end + 1));
    return JSON.parse(text);
  } catch { return null; }
}

// POST /practice-plan
router.post('/practice-plan', rateLimiter, async (req, res) => {
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

Return JSON: { "student_name": "...", "week_plan": [{"day": "Monday", "exercises": [{"piece": "...", "duration_minutes": 15, "focus_area": "...", "technique_notes": "..."}], "total_minutes": 60}], "goals": [], "parent_notes": "..." }`;

    const aiResponse = await callOpenRouter(
      'You are an expert music education AI assistant. Return only valid JSON, no markdown.',
      prompt
    );

    const output = aiResponse.choices?.[0]?.message?.content || 'No response generated';
    const structured = parseAIJson(output);

    await pool.query(
      'INSERT INTO ai_outputs (type, input_data, output_data, model) VALUES ($1, $2, $3, $4)',
      ['practice-plan', JSON.stringify({ studentId }), JSON.stringify({ plan: output, structured }), process.env.OPENROUTER_MODEL || OPENROUTER_MODEL]
    );

    res.json({ plan: output, structured, student: s });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /progress-report
router.post('/progress-report', rateLimiter, async (req, res) => {
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

Return JSON: { "student_name": "...", "period": "...", "overall_grade": "A|B|C|D|F", "skill_scores": [{"skill": "Technique", "score": 85}], "strengths": [], "improvement_areas": [], "teacher_recommendation": "...", "ready_for_advancement": bool }`;

    const aiResponse = await callOpenRouter(
      'You are an expert music education AI assistant. Return only valid JSON, no markdown.',
      prompt
    );

    const output = aiResponse.choices?.[0]?.message?.content || 'No response generated';
    const structured = parseAIJson(output);

    await pool.query(
      'INSERT INTO ai_outputs (type, input_data, output_data, model) VALUES ($1, $2, $3, $4)',
      ['progress-report', JSON.stringify({ studentId }), JSON.stringify({ report: output, structured }), process.env.OPENROUTER_MODEL || OPENROUTER_MODEL]
    );

    res.json({ report: output, structured, student: s });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /recital-program
router.post('/recital-program', rateLimiter, async (req, res) => {
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
      ['recital-program', JSON.stringify({ recitalId }), JSON.stringify({ program: output }), process.env.OPENROUTER_MODEL || OPENROUTER_MODEL]
    );

    res.json({ program: output, recital: r });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /skill-assessment
router.post('/skill-assessment', rateLimiter, async (req, res) => {
  try {
    const { studentId } = req.body;
    const student = await pool.query('SELECT * FROM students WHERE id = $1', [studentId]);
    if (student.rows.length === 0) return res.status(404).json({ error: 'Student not found' });

    const grades = await pool.query('SELECT * FROM grades WHERE student_id = $1 ORDER BY date DESC', [studentId]);
    const practiceLogs = await pool.query('SELECT * FROM practice_logs WHERE student_id = $1 ORDER BY date DESC LIMIT 30', [studentId]);

    const s = student.rows[0];
    const prompt = `Provide a comprehensive skill assessment for this music student:
Name: ${s.first_name} ${s.last_name}
Instrument: ${s.instrument || 'Not specified'}
Level: ${s.level}
Grades: ${JSON.stringify(grades.rows)}
Practice Logs: ${JSON.stringify(practiceLogs.rows)}

Analyze skills: Technique, Musicality, Theory Knowledge, Sight-Reading, Practice Habits, Performance. Provide ratings and recommendations.`;

    const aiResponse = await callOpenRouter(
      'You are an expert music education AI assistant specializing in comprehensive student skill assessments.',
      prompt
    );

    const output = aiResponse.choices?.[0]?.message?.content || 'No response generated';

    await pool.query(
      'INSERT INTO ai_outputs (type, input_data, output_data, model) VALUES ($1, $2, $3, $4)',
      ['skill-assessment', JSON.stringify({ studentId }), JSON.stringify({ assessment: output }), process.env.OPENROUTER_MODEL || OPENROUTER_MODEL]
    );

    res.json({ assessment: output, student: s });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /lesson-plan
router.post('/lesson-plan', rateLimiter, async (req, res) => {
  try {
    const { studentId, teacherId } = req.body;
    const student = await pool.query('SELECT * FROM students WHERE id = $1', [studentId]);
    if (student.rows.length === 0) return res.status(404).json({ error: 'Student not found' });
    const teacher = await pool.query('SELECT * FROM teachers WHERE id = $1', [teacherId]);
    if (teacher.rows.length === 0) return res.status(404).json({ error: 'Teacher not found' });

    const s = student.rows[0];
    const t = teacher.rows[0];
    const prompt = `Create a detailed lesson plan for the next 4 lessons:
Student: ${s.first_name} ${s.last_name}, Level: ${s.level}, Instrument: ${s.instrument || 'Not specified'}
Teacher: ${t.first_name} ${t.last_name}, Specialties: ${(t.specialties || []).join(', ')}

Create a structured 4-lesson plan with objectives, warm-up, technical studies, repertoire, sight-reading, theory, and homework for each lesson.`;

    const aiResponse = await callOpenRouter(
      'You are an expert music education AI assistant who creates detailed, effective lesson plans.',
      prompt
    );

    const output = aiResponse.choices?.[0]?.message?.content || 'No response generated';

    await pool.query(
      'INSERT INTO ai_outputs (type, input_data, output_data, model) VALUES ($1, $2, $3, $4)',
      ['lesson-plan', JSON.stringify({ studentId, teacherId }), JSON.stringify({ lessonPlan: output }), process.env.OPENROUTER_MODEL || OPENROUTER_MODEL]
    );

    res.json({ lessonPlan: output, student: s, teacher: t });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /marketing-campaign
router.post('/marketing-campaign', rateLimiter, async (req, res) => {
  try {
    const { campaignType, targetAudience } = req.body;

    const prompt = `Create a marketing campaign for a music school:
Campaign Type: ${campaignType || 'General Enrollment'}
Target Audience: ${targetAudience || 'Parents of children ages 5-18'}

Create compelling content including: headline, tagline, email template, 3 social media posts, flyer content, key selling points, and call-to-action suggestions.`;

    const aiResponse = await callOpenRouter(
      'You are an expert music education marketing AI assistant.',
      prompt
    );

    const output = aiResponse.choices?.[0]?.message?.content || 'No response generated';

    await pool.query(
      'INSERT INTO ai_outputs (type, input_data, output_data, model) VALUES ($1, $2, $3, $4)',
      ['marketing-campaign', JSON.stringify({ campaignType, targetAudience }), JSON.stringify({ campaign: output }), process.env.OPENROUTER_MODEL || OPENROUTER_MODEL]
    );

    res.json({ campaign: output });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /schedule-makeup (makeup lesson auto-scheduling)
router.post('/schedule-makeup', rateLimiter, async (req, res) => {
  try {
    const { lessonId } = req.body;
    if (!lessonId) return res.status(400).json({ error: 'lessonId is required' });

    const lesson = await pool.query('SELECT * FROM lessons WHERE id = $1', [lessonId]);
    if (lesson.rows.length === 0) return res.status(404).json({ error: 'Lesson not found' });

    const l = lesson.rows[0];

    // Get teacher's existing lessons to find gaps
    const teacherLessons = await pool.query(
      'SELECT day_of_week, start_time, end_time FROM lessons WHERE teacher_id = $1 AND status = $2',
      [l.teacher_id, 'Active']
    );

    const prompt = `A makeup lesson needs to be scheduled for teacher (ID: ${l.teacher_id}).
Existing lesson slots: ${JSON.stringify(teacherLessons.rows)}
Original lesson: ${JSON.stringify(l)}

Return JSON: { "available_slots": [{"date": "YYYY-MM-DD", "time": "HH:MM", "duration_minutes": 30}], "recommended_slot": {"date": "YYYY-MM-DD", "time": "HH:MM", "duration_minutes": 30}, "reasoning": "..." }
Suggest slots for the next 2 weeks avoiding the existing time blocks.`;

    const aiResponse = await callOpenRouter(
      'You are an expert scheduling assistant for music schools. Return only valid JSON.',
      prompt
    );

    const output = aiResponse.choices?.[0]?.message?.content || '{}';
    const structured = parseAIJson(output);

    // If recommended slot provided, create makeup_lessons record
    let makeupLesson = null;
    if (structured?.recommended_slot) {
      const rs = structured.recommended_slot;
      try {
        const mk = await pool.query(
          `INSERT INTO makeup_lessons (original_lesson_id, student_id, teacher_id, original_date, makeup_date, makeup_time, status, reason)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
          [lessonId, l.student_id, l.teacher_id, new Date().toISOString().split('T')[0], rs.date, rs.time, 'Scheduled', 'AI auto-scheduled']
        );
        makeupLesson = mk.rows[0];
      } catch { /* ignore insert error */ }
    }

    res.json({ suggestion: output, structured, makeup_lesson: makeupLesson });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /student-matching — match students with instructors
router.post('/student-matching', rateLimiter, async (req, res) => {
  try {
    const { studentId } = req.body || {};
    if (!studentId) return res.status(400).json({ error: 'studentId required' });
    const studentR = await pool.query('SELECT * FROM students WHERE id=$1', [studentId]);
    if (!studentR.rows[0]) return res.status(404).json({ error: 'Student not found' });
    const teachersR = await pool.query('SELECT * FROM teachers LIMIT 50');
    const s = studentR.rows[0];
    const prompt = `Recommend the best instructor matches for this student.
Student: ${JSON.stringify({ name: `${s.first_name} ${s.last_name}`, instrument: s.instrument, level: s.level, age: s.age, goals: s.goals })}
Available instructors: ${JSON.stringify(teachersR.rows.map(t => ({ id: t.id, name: `${t.first_name} ${t.last_name}`, instruments: t.instruments, specialties: t.specialties, levels: t.levels, availability: t.availability })))}

Return JSON only: { "ranked_matches": [{"teacher_id": number, "teacher_name": string, "match_score": number, "reasoning": string, "trial_lesson_recommended": boolean}], "summary": string }`;
    const aiResponse = await callOpenRouter('You are a music school placement specialist. Return only valid JSON.', prompt);
    const output = aiResponse.choices?.[0]?.message?.content || '{}';
    const structured = parseAIJson(output);
    await pool.query(
      'INSERT INTO ai_outputs (type, input_data, output_data, model) VALUES ($1,$2,$3,$4)',
      ['student-matching', JSON.stringify({ studentId }), JSON.stringify({ raw: output, structured }), process.env.OPENROUTER_MODEL || OPENROUTER_MODEL]
    );
    res.json({ matches: output, structured });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /retention-risk — identify at-risk students
router.post('/retention-risk', rateLimiter, async (req, res) => {
  try {
    const { studentId } = req.body || {};
    let students;
    if (studentId) {
      const r = await pool.query('SELECT * FROM students WHERE id=$1', [studentId]);
      students = r.rows;
    } else {
      const r = await pool.query('SELECT * FROM students LIMIT 100');
      students = r.rows;
    }
    const attendance = await pool.query('SELECT student_id, COUNT(*) as total, SUM(CASE WHEN present THEN 1 ELSE 0 END) as attended FROM attendance GROUP BY student_id').catch(() => ({ rows: [] }));
    const billing = await pool.query('SELECT student_id, COUNT(*) as overdue FROM billing WHERE status=\'overdue\' GROUP BY student_id').catch(() => ({ rows: [] }));
    const prompt = `Identify retention risk for these students using attendance, billing, and engagement signals.
Students: ${JSON.stringify(students.slice(0, 50))}
Attendance summary: ${JSON.stringify(attendance.rows)}
Billing overdue: ${JSON.stringify(billing.rows)}

Return JSON only: { "at_risk": [{"student_id": number, "risk_level": "low"|"medium"|"high", "signals": [string], "recommended_interventions": [string]}], "overall_health": string }`;
    const aiResponse = await callOpenRouter('You are a student-retention analytics expert. Return only valid JSON.', prompt);
    const output = aiResponse.choices?.[0]?.message?.content || '{}';
    const structured = parseAIJson(output);
    await pool.query(
      'INSERT INTO ai_outputs (type, input_data, output_data, model) VALUES ($1,$2,$3,$4)',
      ['retention-risk', JSON.stringify({ studentId }), JSON.stringify({ raw: output, structured }), process.env.OPENROUTER_MODEL || OPENROUTER_MODEL]
    );
    res.json({ analysis: output, structured });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /event-promotion — promote recitals/competitions
router.post('/event-promotion', rateLimiter, async (req, res) => {
  try {
    const { eventName, eventType, audience, channels, eventDate } = req.body || {};
    if (!eventName) return res.status(400).json({ error: 'eventName required' });
    const prompt = `Generate a promotion plan for a music school event.
Event: ${eventName}
Type: ${eventType || 'recital'}
Audience: ${audience || 'parents and community'}
Channels: ${JSON.stringify(channels || ['email', 'social'])}
Date: ${eventDate || 'TBD'}

Return JSON only: { "tagline": string, "email_subject": string, "email_body": string, "social_posts": [{"platform": string, "copy": string, "hashtags": [string]}], "press_release_short": string, "call_to_action": string, "schedule_recommendations": [string] }`;
    const aiResponse = await callOpenRouter('You are a music school marketing specialist. Return only valid JSON.', prompt);
    const output = aiResponse.choices?.[0]?.message?.content || '{}';
    const structured = parseAIJson(output);
    await pool.query(
      'INSERT INTO ai_outputs (type, input_data, output_data, model) VALUES ($1,$2,$3,$4)',
      ['event-promotion', JSON.stringify({ eventName, eventType }), JSON.stringify({ raw: output, structured }), process.env.OPENROUTER_MODEL || OPENROUTER_MODEL]
    );
    res.json({ plan: output, structured });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /ensemble-assignment — recommend ensemble placements for students
router.post('/ensemble-assignment', rateLimiter, async (req, res) => {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(503).json({ error: 'AI service not configured (missing OPENROUTER_API_KEY)' });
    }
    const { ensembleId, candidateStudentIds } = req.body || {};

    let ensembles;
    if (ensembleId) {
      const r = await pool.query('SELECT * FROM ensembles WHERE id=$1', [ensembleId]);
      if (!r.rows[0]) return res.status(404).json({ error: 'Ensemble not found' });
      ensembles = r.rows;
    } else {
      const r = await pool.query("SELECT * FROM ensembles WHERE status='Active' LIMIT 20");
      ensembles = r.rows;
    }
    if (ensembles.length === 0) return res.status(404).json({ error: 'No ensembles available' });

    let students;
    if (Array.isArray(candidateStudentIds) && candidateStudentIds.length > 0) {
      const r = await pool.query('SELECT * FROM students WHERE id = ANY($1::int[])', [candidateStudentIds]);
      students = r.rows;
    } else {
      const r = await pool.query('SELECT * FROM students LIMIT 60');
      students = r.rows;
    }
    if (students.length === 0) return res.status(404).json({ error: 'No students available' });

    const existingMembers = await pool.query(
      'SELECT ensemble_id, student_id, instrument, part FROM ensemble_members WHERE ensemble_id = ANY($1::int[])',
      [ensembles.map(e => e.id)]
    ).catch(() => ({ rows: [] }));

    const prompt = `Recommend optimal ensemble assignments for the candidate students.
Ensembles: ${JSON.stringify(ensembles.map(e => ({ id: e.id, name: e.name, type: e.type, level: e.level, max_members: e.max_members, current_members: e.current_members })))}
Candidate students: ${JSON.stringify(students.map(s => ({ id: s.id, name: `${s.first_name} ${s.last_name}`, instrument: s.instrument, level: s.level, age: s.age })))}
Existing members: ${JSON.stringify(existingMembers.rows)}

Constraints:
- Don't exceed max_members per ensemble
- Match instrument & level
- Prefer balanced sections

Return JSON only: { "assignments": [{"ensemble_id": number, "ensemble_name": string, "student_id": number, "student_name": string, "suggested_part": string, "fit_score": number, "rationale": string}], "unassigned_students": [{"student_id": number, "reason": string}], "summary": string }`;

    const aiResponse = await callOpenRouter('You are a music school ensemble director and placement specialist. Return only valid JSON.', prompt);
    const output = aiResponse.choices?.[0]?.message?.content || '{}';
    const structured = parseAIJson(output);
    try {
      await pool.query(
        'INSERT INTO ai_outputs (type, input_data, output_data, model) VALUES ($1,$2,$3,$4)',
        ['ensemble-assignment', JSON.stringify({ ensembleId, candidateStudentIds }), JSON.stringify({ raw: output, structured }), process.env.OPENROUTER_MODEL || OPENROUTER_MODEL]
      );
    } catch { /* ignore */ }
    res.json({ recommendation: output, structured });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /practice-evaluation — text-based practice video evaluator
// PRODUCT-DECISION: A real vision-model practice evaluator would require uploading audio/video
// and a multimodal model + storage. To stay additive (no creds, no heavy deps), this endpoint
// accepts a *self-reported description* of the practice session (or a transcribed `notes` field
// from a phone recording) and produces structured feedback. When the studio later wires a
// vision/audio pipeline, the prompt + persistence layer here can be reused unchanged.
// Required env: OPENROUTER_API_KEY (returns 503 if missing).
router.post('/practice-evaluation', rateLimiter, async (req, res) => {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(503).json({ error: 'AI service not configured', missing: 'OPENROUTER_API_KEY' });
    }
    const { studentId, piece, notes, duration_minutes, recording_transcript } = req.body || {};
    if (!notes && !recording_transcript) {
      return res.status(400).json({ error: 'Provide notes or recording_transcript' });
    }

    let student = null;
    if (studentId) {
      try {
        const s = await pool.query('SELECT * FROM students WHERE id = $1', [studentId]);
        student = s.rows[0] || null;
      } catch { /* ignore */ }
    }

    const prompt = `Evaluate a music practice session and return structured feedback.

Student: ${student ? `${student.first_name} ${student.last_name} | ${student.instrument || 'N/A'} | level ${student.level || 'N/A'}` : 'unspecified'}
Piece: ${piece || 'unspecified'}
Duration (min): ${duration_minutes || 'unspecified'}
Self-reported notes: ${notes || 'none'}
Recording transcript (if available): ${recording_transcript || 'none'}

Return JSON only:
{
  "overall_score": <0-100>,
  "criteria": [{ "name": string, "score": <0-100>, "comment": string }],
  "strengths": [string],
  "areas_for_improvement": [string],
  "recommended_drills": [{ "name": string, "duration_minutes": number, "rationale": string }],
  "next_session_focus": string,
  "encouragement_note": string
}`;

    const aiResponse = await callOpenRouter('You are a music education evaluator. Return only valid JSON.', prompt);
    const output = aiResponse.choices?.[0]?.message?.content || '{}';
    const structured = parseAIJson(output);
    try {
      await pool.query(
        'INSERT INTO ai_outputs (type, input_data, output_data, model) VALUES ($1,$2,$3,$4)',
        ['practice-evaluation', JSON.stringify({ studentId, piece, duration_minutes }), JSON.stringify({ raw: output, structured }), process.env.OPENROUTER_MODEL || OPENROUTER_MODEL]
      );
    } catch { /* ignore */ }
    res.json({ evaluation: output, structured });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /parent-summary — parent portal weekly digest generator
// PRODUCT-DECISION: Full parent portal is multi-page UI/auth work; this endpoint produces the
// *content* (digest summary) that any portal/email/SMS would render. Pulls last 30d of practice
// logs + lessons + grades for the student.
// Required env: OPENROUTER_API_KEY (returns 503 if missing).
router.post('/parent-summary', rateLimiter, async (req, res) => {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(503).json({ error: 'AI service not configured', missing: 'OPENROUTER_API_KEY' });
    }
    const { studentId } = req.body || {};
    if (!studentId) return res.status(400).json({ error: 'studentId is required' });
    const s = await pool.query('SELECT * FROM students WHERE id = $1', [studentId]);
    if (s.rows.length === 0) return res.status(404).json({ error: 'Student not found' });
    const student = s.rows[0];

    const practice = await pool.query(
      `SELECT * FROM practice_logs WHERE student_id = $1 AND date >= NOW() - INTERVAL '30 days' ORDER BY date DESC`,
      [studentId]
    ).catch(() => ({ rows: [] }));
    const lessons = await pool.query(
      `SELECT * FROM lessons WHERE student_id = $1 AND lesson_date >= NOW() - INTERVAL '30 days' ORDER BY lesson_date DESC LIMIT 20`,
      [studentId]
    ).catch(() => ({ rows: [] }));
    const grades = await pool.query(
      `SELECT * FROM grades WHERE student_id = $1 ORDER BY date DESC LIMIT 5`,
      [studentId]
    ).catch(() => ({ rows: [] }));

    const prompt = `Produce a parent-friendly monthly digest for the music student below.

Student: ${student.first_name} ${student.last_name} | ${student.instrument || 'N/A'} | level ${student.level || 'N/A'}
Practice (30d): ${JSON.stringify(practice.rows)}
Lessons (30d): ${JSON.stringify(lessons.rows)}
Recent grades: ${JSON.stringify(grades.rows)}

Return JSON only:
{
  "headline": string,
  "practice_consistency_score": <0-100>,
  "highlights": [string],
  "concerns": [string],
  "what_to_celebrate": [string],
  "next_30_days_goals": [string],
  "talking_points_for_parent": [string],
  "encouragement_note_for_student": string
}`;

    const aiResponse = await callOpenRouter('You are an empathetic music education progress writer. Return only valid JSON.', prompt);
    const output = aiResponse.choices?.[0]?.message?.content || '{}';
    const structured = parseAIJson(output);
    try {
      await pool.query(
        'INSERT INTO ai_outputs (type, input_data, output_data, model) VALUES ($1,$2,$3,$4)',
        ['parent-summary', JSON.stringify({ studentId }), JSON.stringify({ raw: output, structured }), process.env.OPENROUTER_MODEL || OPENROUTER_MODEL]
      );
    } catch { /* ignore */ }
    res.json({ summary: output, structured, student });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
