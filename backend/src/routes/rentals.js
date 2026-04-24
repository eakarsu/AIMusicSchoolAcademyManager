const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, i.name AS instrument_name, s.first_name AS student_first_name, s.last_name AS student_last_name
      FROM instrument_rentals r
      LEFT JOIN instruments i ON r.instrument_id = i.id
      LEFT JOIN students s ON r.student_id = s.id
      ORDER BY r.id
    `);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, i.name AS instrument_name, s.first_name AS student_first_name, s.last_name AS student_last_name
      FROM instrument_rentals r
      LEFT JOIN instruments i ON r.instrument_id = i.id
      LEFT JOIN students s ON r.student_id = s.id
      WHERE r.id = $1
    `, [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { instrument_id, student_id, start_date, end_date, monthly_rate, deposit, status, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO instrument_rentals (instrument_id, student_id, start_date, end_date, monthly_rate, deposit, status, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [instrument_id, student_id, start_date, end_date, monthly_rate, deposit, status, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { instrument_id, student_id, start_date, end_date, monthly_rate, deposit, status, notes } = req.body;
    const result = await pool.query(
      `UPDATE instrument_rentals SET instrument_id=$1, student_id=$2, start_date=$3, end_date=$4, monthly_rate=$5, deposit=$6, status=$7, notes=$8
       WHERE id=$9 RETURNING *`,
      [instrument_id, student_id, start_date, end_date, monthly_rate, deposit, status, notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM instrument_rentals WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', item: result.rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
