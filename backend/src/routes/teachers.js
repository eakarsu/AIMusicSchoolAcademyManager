const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(200, parseInt(req.query.limit) || 50);
    const offset = (page - 1) * limit;
    const countResult = await pool.query('SELECT COUNT(*) FROM teachers');
    const total = parseInt(countResult.rows[0].count);
    const result = await pool.query('SELECT * FROM teachers ORDER BY id LIMIT $1 OFFSET $2', [limit, offset]);
    res.json({ data: result.rows, page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM teachers WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, email, phone, specialties, bio, hourly_rate, commission_rate, status, hire_date, photo_url } = req.body;
    if (!first_name || !first_name.trim()) return res.status(400).json({ error: 'First name is required' });
    if (!last_name || !last_name.trim()) return res.status(400).json({ error: 'Last name is required' });
    const result = await pool.query(
      `INSERT INTO teachers (first_name, last_name, email, phone, specialties, bio, hourly_rate, commission_rate, status, hire_date, photo_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [first_name, last_name, email, phone, specialties, bio, hourly_rate, commission_rate, status, hire_date, photo_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { first_name, last_name, email, phone, specialties, bio, hourly_rate, commission_rate, status, hire_date, photo_url } = req.body;
    const result = await pool.query(
      `UPDATE teachers SET first_name=$1, last_name=$2, email=$3, phone=$4, specialties=$5, bio=$6, hourly_rate=$7, commission_rate=$8, status=$9, hire_date=$10, photo_url=$11
       WHERE id=$12 RETURNING *`,
      [first_name, last_name, email, phone, specialties, bio, hourly_rate, commission_rate, status, hire_date, photo_url, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM teachers WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', item: result.rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
