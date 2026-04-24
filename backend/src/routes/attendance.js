const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, s.first_name AS student_first_name, s.last_name AS student_last_name,
             l.instrument AS lesson_instrument, l.lesson_type
      FROM attendance a
      LEFT JOIN students s ON a.student_id = s.id
      LEFT JOIN lessons l ON a.lesson_id = l.id
      ORDER BY a.id
    `);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, s.first_name AS student_first_name, s.last_name AS student_last_name,
             l.instrument AS lesson_instrument, l.lesson_type
      FROM attendance a
      LEFT JOIN students s ON a.student_id = s.id
      LEFT JOIN lessons l ON a.lesson_id = l.id
      WHERE a.id = $1
    `, [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { lesson_id, student_id, date, status, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO attendance (lesson_id, student_id, date, status, notes)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [lesson_id, student_id, date, status, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { lesson_id, student_id, date, status, notes } = req.body;
    const result = await pool.query(
      `UPDATE attendance SET lesson_id=$1, student_id=$2, date=$3, status=$4, notes=$5
       WHERE id=$6 RETURNING *`,
      [lesson_id, student_id, date, status, notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM attendance WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', item: result.rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
