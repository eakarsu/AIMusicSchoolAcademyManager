const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT l.*, s.first_name AS student_first_name, s.last_name AS student_last_name,
             t.first_name AS teacher_first_name, t.last_name AS teacher_last_name
      FROM lessons l
      LEFT JOIN students s ON l.student_id = s.id
      LEFT JOIN teachers t ON l.teacher_id = t.id
      ORDER BY l.id
    `);
    res.json(result.rows);
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
