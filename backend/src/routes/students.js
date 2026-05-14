const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(200, parseInt(req.query.limit) || 50);
    const offset = (page - 1) * limit;
    const countResult = await pool.query('SELECT COUNT(*) FROM students');
    const total = parseInt(countResult.rows[0].count);
    const result = await pool.query('SELECT * FROM students ORDER BY id LIMIT $1 OFFSET $2', [limit, offset]);
    res.json({ data: result.rows, page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, email, phone, date_of_birth, enrollment_date, level, instrument, parent_name, parent_email, parent_phone, address, notes, status, family_id, photo_url } = req.body;
    if (!first_name || !first_name.trim()) return res.status(400).json({ error: 'First name is required' });
    if (!last_name || !last_name.trim()) return res.status(400).json({ error: 'Last name is required' });
    const result = await pool.query(
      `INSERT INTO students (first_name, last_name, email, phone, date_of_birth, enrollment_date, level, instrument, parent_name, parent_email, parent_phone, address, notes, status, family_id, photo_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
      [first_name, last_name, email, phone, date_of_birth, enrollment_date, level, instrument, parent_name, parent_email, parent_phone, address, notes, status, family_id, photo_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { first_name, last_name, email, phone, date_of_birth, enrollment_date, level, instrument, parent_name, parent_email, parent_phone, address, notes, status, family_id, photo_url } = req.body;
    const result = await pool.query(
      `UPDATE students SET first_name=$1, last_name=$2, email=$3, phone=$4, date_of_birth=$5, enrollment_date=$6, level=$7, instrument=$8, parent_name=$9, parent_email=$10, parent_phone=$11, address=$12, notes=$13, status=$14, family_id=$15, photo_url=$16
       WHERE id=$17 RETURNING *`,
      [first_name, last_name, email, phone, date_of_birth, enrollment_date, level, instrument, parent_name, parent_email, parent_phone, address, notes, status, family_id, photo_url, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM students WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', item: result.rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
