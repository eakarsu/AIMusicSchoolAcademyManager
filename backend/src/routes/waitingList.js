const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM waiting_list ORDER BY priority, id');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM waiting_list WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { student_name, parent_name, email, phone, instrument, preferred_day, preferred_time, teacher_preference, priority, status, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO waiting_list (student_name, parent_name, email, phone, instrument, preferred_day, preferred_time, teacher_preference, priority, status, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [student_name, parent_name, email, phone, instrument, preferred_day, preferred_time, teacher_preference, priority, status, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { student_name, parent_name, email, phone, instrument, preferred_day, preferred_time, teacher_preference, priority, status, notes } = req.body;
    const result = await pool.query(
      `UPDATE waiting_list SET student_name=$1, parent_name=$2, email=$3, phone=$4, instrument=$5, preferred_day=$6, preferred_time=$7, teacher_preference=$8, priority=$9, status=$10, notes=$11
       WHERE id=$12 RETURNING *`,
      [student_name, parent_name, email, phone, instrument, preferred_day, preferred_time, teacher_preference, priority, status, notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM waiting_list WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', item: result.rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
