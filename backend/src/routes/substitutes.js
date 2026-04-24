const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*,
             t1.first_name AS teacher_first_name, t1.last_name AS teacher_last_name,
             t2.first_name AS sub_first_name, t2.last_name AS sub_last_name,
             l.instrument AS lesson_instrument, l.day_of_week AS lesson_day
      FROM substitutes s
      LEFT JOIN teachers t1 ON s.teacher_id = t1.id
      LEFT JOIN teachers t2 ON s.substitute_teacher_id = t2.id
      LEFT JOIN lessons l ON s.lesson_id = l.id
      ORDER BY s.id
    `);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*,
             t1.first_name AS teacher_first_name, t1.last_name AS teacher_last_name,
             t2.first_name AS sub_first_name, t2.last_name AS sub_last_name,
             l.instrument AS lesson_instrument, l.day_of_week AS lesson_day
      FROM substitutes s
      LEFT JOIN teachers t1 ON s.teacher_id = t1.id
      LEFT JOIN teachers t2 ON s.substitute_teacher_id = t2.id
      LEFT JOIN lessons l ON s.lesson_id = l.id
      WHERE s.id = $1
    `, [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { teacher_id, substitute_teacher_id, lesson_id, date, reason, status, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO substitutes (teacher_id, substitute_teacher_id, lesson_id, date, reason, status, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [teacher_id, substitute_teacher_id, lesson_id, date, reason, status, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { teacher_id, substitute_teacher_id, lesson_id, date, reason, status, notes } = req.body;
    const result = await pool.query(
      `UPDATE substitutes SET teacher_id=$1, substitute_teacher_id=$2, lesson_id=$3, date=$4, reason=$5, status=$6, notes=$7
       WHERE id=$8 RETURNING *`,
      [teacher_id, substitute_teacher_id, lesson_id, date, reason, status, notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM substitutes WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', item: result.rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
