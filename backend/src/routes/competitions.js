const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM competitions ORDER BY id');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM competitions WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { name, date, location, category, registration_deadline, entry_fee, status, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO competitions (name, date, location, category, registration_deadline, entry_fee, status, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [name, date, location, category, registration_deadline, entry_fee, status, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, date, location, category, registration_deadline, entry_fee, status, notes } = req.body;
    const result = await pool.query(
      `UPDATE competitions SET name=$1, date=$2, location=$3, category=$4, registration_deadline=$5, entry_fee=$6, status=$7, notes=$8
       WHERE id=$9 RETURNING *`,
      [name, date, location, category, registration_deadline, entry_fee, status, notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM competitions WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', item: result.rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Entries endpoints
router.get('/:id/entries', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ce.*, s.first_name, s.last_name
      FROM competition_entries ce
      LEFT JOIN students s ON ce.student_id = s.id
      WHERE ce.competition_id = $1
      ORDER BY ce.id
    `, [req.params.id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/:id/entries', async (req, res) => {
  try {
    const { student_id, piece, category, result: entryResult, score, notes } = req.body;
    const r = await pool.query(
      `INSERT INTO competition_entries (competition_id, student_id, piece, category, result, score, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [req.params.id, student_id, piece, category, entryResult, score, notes]
    );
    res.status(201).json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id/entries/:entryId', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM competition_entries WHERE id = $1 RETURNING *', [req.params.entryId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', item: result.rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
