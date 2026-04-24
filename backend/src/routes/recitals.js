const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM recitals ORDER BY id');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM recitals WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { title, date, time, venue, description, program, status, max_performers, ticket_price, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO recitals (title, date, time, venue, description, program, status, max_performers, ticket_price, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [title, date, time, venue, description, program, status, max_performers, ticket_price, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, date, time, venue, description, program, status, max_performers, ticket_price, notes } = req.body;
    const result = await pool.query(
      `UPDATE recitals SET title=$1, date=$2, time=$3, venue=$4, description=$5, program=$6, status=$7, max_performers=$8, ticket_price=$9, notes=$10
       WHERE id=$11 RETURNING *`,
      [title, date, time, venue, description, program, status, max_performers, ticket_price, notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM recitals WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', item: result.rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Performers endpoints
router.get('/:id/performers', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT rp.*, s.first_name, s.last_name
      FROM recital_performers rp
      LEFT JOIN students s ON rp.student_id = s.id
      WHERE rp.recital_id = $1
      ORDER BY rp.performance_order
    `, [req.params.id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/:id/performers', async (req, res) => {
  try {
    const { student_id, piece_title, composer, performance_order, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO recital_performers (recital_id, student_id, piece_title, composer, performance_order, notes)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [req.params.id, student_id, piece_title, composer, performance_order, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id/performers/:performerId', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM recital_performers WHERE id = $1 RETURNING *', [req.params.performerId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', item: result.rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
