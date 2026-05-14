const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(200, parseInt(req.query.limit) || 50);
    const offset = (page - 1) * limit;
    const countResult = await pool.query('SELECT COUNT(*) FROM billing');
    const total = parseInt(countResult.rows[0].count);
    const result = await pool.query(`
      SELECT b.*, s.first_name AS student_first_name, s.last_name AS student_last_name
      FROM billing b
      LEFT JOIN students s ON b.student_id = s.id
      ORDER BY b.id
      LIMIT $1 OFFSET $2
    `, [limit, offset]);
    res.json({ data: result.rows, page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.*, s.first_name AS student_first_name, s.last_name AS student_last_name
      FROM billing b
      LEFT JOIN students s ON b.student_id = s.id
      WHERE b.id = $1
    `, [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { student_id, amount, description, due_date, paid_date, payment_method, status, invoice_number, notes } = req.body;
    if (!amount) return res.status(400).json({ error: 'Amount is required' });
    const result = await pool.query(
      `INSERT INTO billing (student_id, amount, description, due_date, paid_date, payment_method, status, invoice_number, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [student_id, amount, description, due_date, paid_date, payment_method, status, invoice_number, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { student_id, amount, description, due_date, paid_date, payment_method, status, invoice_number, notes } = req.body;
    const result = await pool.query(
      `UPDATE billing SET student_id=$1, amount=$2, description=$3, due_date=$4, paid_date=$5, payment_method=$6, status=$7, invoice_number=$8, notes=$9
       WHERE id=$10 RETURNING *`,
      [student_id, amount, description, due_date, paid_date, payment_method, status, invoice_number, notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM billing WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', item: result.rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
