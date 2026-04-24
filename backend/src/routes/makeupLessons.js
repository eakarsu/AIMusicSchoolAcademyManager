const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ml.*, s.first_name AS student_first_name, s.last_name AS student_last_name,
             t.first_name AS teacher_first_name, t.last_name AS teacher_last_name
      FROM makeup_lessons ml
      LEFT JOIN students s ON ml.student_id = s.id
      LEFT JOIN teachers t ON ml.teacher_id = t.id
      ORDER BY ml.id
    `);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ml.*, s.first_name AS student_first_name, s.last_name AS student_last_name,
             t.first_name AS teacher_first_name, t.last_name AS teacher_last_name
      FROM makeup_lessons ml
      LEFT JOIN students s ON ml.student_id = s.id
      LEFT JOIN teachers t ON ml.teacher_id = t.id
      WHERE ml.id = $1
    `, [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { original_lesson_id, student_id, teacher_id, original_date, makeup_date, makeup_time, room_id, status, reason, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO makeup_lessons (original_lesson_id, student_id, teacher_id, original_date, makeup_date, makeup_time, room_id, status, reason, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [original_lesson_id, student_id, teacher_id, original_date, makeup_date, makeup_time, room_id, status, reason, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { original_lesson_id, student_id, teacher_id, original_date, makeup_date, makeup_time, room_id, status, reason, notes } = req.body;
    const result = await pool.query(
      `UPDATE makeup_lessons SET original_lesson_id=$1, student_id=$2, teacher_id=$3, original_date=$4, makeup_date=$5, makeup_time=$6, room_id=$7, status=$8, reason=$9, notes=$10
       WHERE id=$11 RETURNING *`,
      [original_lesson_id, student_id, teacher_id, original_date, makeup_date, makeup_time, room_id, status, reason, notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM makeup_lessons WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', item: result.rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
