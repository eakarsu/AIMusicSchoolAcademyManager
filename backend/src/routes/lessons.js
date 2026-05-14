const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Check for scheduling conflicts
async function checkConflicts(teacher_id, room_id, day_of_week, start_time, end_time, excludeId = null) {
  const conflicts = [];

  if (teacher_id && day_of_week && start_time && end_time) {
    const teacherQuery = `
      SELECT id, student_id, instrument, start_time, end_time
      FROM lessons
      WHERE teacher_id = $1 AND day_of_week = $2 AND status = 'Active'
      AND (
        (start_time <= $3 AND end_time > $3) OR
        (start_time < $4 AND end_time >= $4) OR
        (start_time >= $3 AND end_time <= $4)
      )
      ${excludeId ? 'AND id != $5' : ''}
    `;
    const params = excludeId
      ? [teacher_id, day_of_week, start_time, end_time, excludeId]
      : [teacher_id, day_of_week, start_time, end_time];

    const result = await pool.query(teacherQuery, params);
    if (result.rows.length > 0) {
      conflicts.push({
        conflict_type: 'teacher',
        conflicting_lesson_id: result.rows[0].id,
        message: `Teacher already has a lesson on ${day_of_week} at ${result.rows[0].start_time} - ${result.rows[0].end_time}`,
        suggestion: 'Choose a different time slot'
      });
    }
  }

  if (room_id && day_of_week && start_time && end_time) {
    const roomQuery = `
      SELECT id, teacher_id, start_time, end_time
      FROM lessons
      WHERE room_id = $1 AND day_of_week = $2 AND status = 'Active'
      AND (
        (start_time <= $3 AND end_time > $3) OR
        (start_time < $4 AND end_time >= $4) OR
        (start_time >= $3 AND end_time <= $4)
      )
      ${excludeId ? 'AND id != $5' : ''}
    `;
    const params = excludeId
      ? [room_id, day_of_week, start_time, end_time, excludeId]
      : [room_id, day_of_week, start_time, end_time];

    const result = await pool.query(roomQuery, params);
    if (result.rows.length > 0) {
      conflicts.push({
        conflict_type: 'room',
        conflicting_lesson_id: result.rows[0].id,
        message: `Room is already booked on ${day_of_week} at ${result.rows[0].start_time} - ${result.rows[0].end_time}`,
        suggestion: 'Choose a different room or time slot'
      });
    }
  }

  return conflicts;
}

router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 50);
    const offset = (page - 1) * limit;

    const countResult = await pool.query('SELECT COUNT(*) FROM lessons');
    const total = parseInt(countResult.rows[0].count);

    const result = await pool.query(`
      SELECT l.*, s.first_name AS student_first_name, s.last_name AS student_last_name,
             t.first_name AS teacher_first_name, t.last_name AS teacher_last_name
      FROM lessons l
      LEFT JOIN students s ON l.student_id = s.id
      LEFT JOIN teachers t ON l.teacher_id = t.id
      ORDER BY l.id
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    res.json({ data: result.rows, page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT l.*, s.first_name AS student_first_name, s.last_name AS student_last_name,
             t.first_name AS teacher_first_name, t.last_name AS teacher_last_name
      FROM lessons l
      LEFT JOIN students s ON l.student_id = s.id
      LEFT JOIN teachers t ON l.teacher_id = t.id
      WHERE l.id = $1
    `, [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { student_id, teacher_id, instrument, lesson_type, day_of_week, start_time, end_time, duration, room_id, recurring, status, notes, price } = req.body;

    // Check for conflicts before inserting
    const conflicts = await checkConflicts(teacher_id, room_id, day_of_week, start_time, end_time);
    if (conflicts.length > 0) {
      return res.status(409).json({
        error: 'Scheduling conflict detected',
        conflicts,
        suggestion: conflicts[0]?.suggestion || 'Choose a different time slot'
      });
    }

    const result = await pool.query(
      `INSERT INTO lessons (student_id, teacher_id, instrument, lesson_type, day_of_week, start_time, end_time, duration, room_id, recurring, status, notes, price)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [student_id, teacher_id, instrument, lesson_type, day_of_week, start_time, end_time, duration, room_id, recurring, status, notes, price]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { student_id, teacher_id, instrument, lesson_type, day_of_week, start_time, end_time, duration, room_id, recurring, status, notes, price } = req.body;

    // Check for conflicts excluding this lesson
    const conflicts = await checkConflicts(teacher_id, room_id, day_of_week, start_time, end_time, parseInt(req.params.id));
    if (conflicts.length > 0) {
      return res.status(409).json({
        error: 'Scheduling conflict detected',
        conflicts,
        suggestion: conflicts[0]?.suggestion || 'Choose a different time slot'
      });
    }

    const result = await pool.query(
      `UPDATE lessons SET student_id=$1, teacher_id=$2, instrument=$3, lesson_type=$4, day_of_week=$5, start_time=$6, end_time=$7, duration=$8, room_id=$9, recurring=$10, status=$11, notes=$12, price=$13
       WHERE id=$14 RETURNING *`,
      [student_id, teacher_id, instrument, lesson_type, day_of_week, start_time, end_time, duration, room_id, recurring, status, notes, price, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM lessons WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', item: result.rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
