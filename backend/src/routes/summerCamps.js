const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM summer_camps ORDER BY id');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM summer_camps WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { name, start_date, end_date, age_group, instrument_focus, max_enrollment, current_enrollment, price, instructor, description, status } = req.body;
    const result = await pool.query(
      `INSERT INTO summer_camps (name, start_date, end_date, age_group, instrument_focus, max_enrollment, current_enrollment, price, instructor, description, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [name, start_date, end_date, age_group, instrument_focus, max_enrollment, current_enrollment, price, instructor, description, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, start_date, end_date, age_group, instrument_focus, max_enrollment, current_enrollment, price, instructor, description, status } = req.body;
    const result = await pool.query(
      `UPDATE summer_camps SET name=$1, start_date=$2, end_date=$3, age_group=$4, instrument_focus=$5, max_enrollment=$6, current_enrollment=$7, price=$8, instructor=$9, description=$10, status=$11
       WHERE id=$12 RETURNING *`,
      [name, start_date, end_date, age_group, instrument_focus, max_enrollment, current_enrollment, price, instructor, description, status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM summer_camps WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', item: result.rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
