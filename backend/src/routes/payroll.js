const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, t.first_name AS teacher_first_name, t.last_name AS teacher_last_name
      FROM payroll p
      LEFT JOIN teachers t ON p.teacher_id = t.id
      ORDER BY p.id
    `);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, t.first_name AS teacher_first_name, t.last_name AS teacher_last_name
      FROM payroll p
      LEFT JOIN teachers t ON p.teacher_id = t.id
      WHERE p.id = $1
    `, [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { teacher_id, period_start, period_end, lessons_count, hours_worked, base_pay, commission, deductions, total_pay, status, paid_date, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO payroll (teacher_id, period_start, period_end, lessons_count, hours_worked, base_pay, commission, deductions, total_pay, status, paid_date, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [teacher_id, period_start, period_end, lessons_count, hours_worked, base_pay, commission, deductions, total_pay, status, paid_date, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { teacher_id, period_start, period_end, lessons_count, hours_worked, base_pay, commission, deductions, total_pay, status, paid_date, notes } = req.body;
    const result = await pool.query(
      `UPDATE payroll SET teacher_id=$1, period_start=$2, period_end=$3, lessons_count=$4, hours_worked=$5, base_pay=$6, commission=$7, deductions=$8, total_pay=$9, status=$10, paid_date=$11, notes=$12
       WHERE id=$13 RETURNING *`,
      [teacher_id, period_start, period_end, lessons_count, hours_worked, base_pay, commission, deductions, total_pay, status, paid_date, notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM payroll WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', item: result.rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
