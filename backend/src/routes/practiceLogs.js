const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT pl.*, s.first_name AS student_first_name, s.last_name AS student_last_name
      FROM practice_logs pl
      LEFT JOIN students s ON pl.student_id = s.id
      ORDER BY pl.id
    `);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT pl.*, s.first_name AS student_first_name, s.last_name AS student_last_name
      FROM practice_logs pl
      LEFT JOIN students s ON pl.student_id = s.id
      WHERE pl.id = $1
    `, [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { student_id, date, duration_minutes, piece, notes, rating, teacher_feedback } = req.body;
    const result = await pool.query(
      `INSERT INTO practice_logs (student_id, date, duration_minutes, piece, notes, rating, teacher_feedback)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [student_id, date, duration_minutes, piece, notes, rating, teacher_feedback]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { student_id, date, duration_minutes, piece, notes, rating, teacher_feedback } = req.body;
    const result = await pool.query(
      `UPDATE practice_logs SET student_id=$1, date=$2, duration_minutes=$3, piece=$4, notes=$5, rating=$6, teacher_feedback=$7
       WHERE id=$8 RETURNING *`,
      [student_id, date, duration_minutes, piece, notes, rating, teacher_feedback, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM practice_logs WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', item: result.rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
