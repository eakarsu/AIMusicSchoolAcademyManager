const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT tl.*, t.first_name AS teacher_first_name, t.last_name AS teacher_last_name
      FROM trial_lessons tl
      LEFT JOIN teachers t ON tl.teacher_id = t.id
      ORDER BY tl.id
    `);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT tl.*, t.first_name AS teacher_first_name, t.last_name AS teacher_last_name
      FROM trial_lessons tl
      LEFT JOIN teachers t ON tl.teacher_id = t.id
      WHERE tl.id = $1
    `, [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { student_name, parent_name, email, phone, instrument, preferred_date, preferred_time, teacher_id, status, notes, converted } = req.body;
    const result = await pool.query(
      `INSERT INTO trial_lessons (student_name, parent_name, email, phone, instrument, preferred_date, preferred_time, teacher_id, status, notes, converted)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [student_name, parent_name, email, phone, instrument, preferred_date, preferred_time, teacher_id, status, notes, converted]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { student_name, parent_name, email, phone, instrument, preferred_date, preferred_time, teacher_id, status, notes, converted } = req.body;
    const result = await pool.query(
      `UPDATE trial_lessons SET student_name=$1, parent_name=$2, email=$3, phone=$4, instrument=$5, preferred_date=$6, preferred_time=$7, teacher_id=$8, status=$9, notes=$10, converted=$11
       WHERE id=$12 RETURNING *`,
      [student_name, parent_name, email, phone, instrument, preferred_date, preferred_time, teacher_id, status, notes, converted, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM trial_lessons WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', item: result.rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
