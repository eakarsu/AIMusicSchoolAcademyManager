const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, s.first_name AS student_first_name, s.last_name AS student_last_name
      FROM certificates c
      LEFT JOIN students s ON c.student_id = s.id
      ORDER BY c.id
    `);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, s.first_name AS student_first_name, s.last_name AS student_last_name
      FROM certificates c
      LEFT JOIN students s ON c.student_id = s.id
      WHERE c.id = $1
    `, [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { student_id, type, title, date_issued, description, level, issued_by } = req.body;
    const result = await pool.query(
      `INSERT INTO certificates (student_id, type, title, date_issued, description, level, issued_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [student_id, type, title, date_issued, description, level, issued_by]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { student_id, type, title, date_issued, description, level, issued_by } = req.body;
    const result = await pool.query(
      `UPDATE certificates SET student_id=$1, type=$2, title=$3, date_issued=$4, description=$5, level=$6, issued_by=$7
       WHERE id=$8 RETURNING *`,
      [student_id, type, title, date_issued, description, level, issued_by, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM certificates WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', item: result.rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
