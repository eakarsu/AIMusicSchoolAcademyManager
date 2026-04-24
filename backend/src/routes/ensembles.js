const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ensembles ORDER BY id');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ensembles WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { name, type, director, rehearsal_day, rehearsal_time, room_id, max_members, current_members, level, status, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO ensembles (name, type, director, rehearsal_day, rehearsal_time, room_id, max_members, current_members, level, status, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [name, type, director, rehearsal_day, rehearsal_time, room_id, max_members, current_members, level, status, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, type, director, rehearsal_day, rehearsal_time, room_id, max_members, current_members, level, status, notes } = req.body;
    const result = await pool.query(
      `UPDATE ensembles SET name=$1, type=$2, director=$3, rehearsal_day=$4, rehearsal_time=$5, room_id=$6, max_members=$7, current_members=$8, level=$9, status=$10, notes=$11
       WHERE id=$12 RETURNING *`,
      [name, type, director, rehearsal_day, rehearsal_time, room_id, max_members, current_members, level, status, notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM ensembles WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', item: result.rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Members endpoints
router.get('/:id/members', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT em.*, s.first_name, s.last_name
      FROM ensemble_members em
      LEFT JOIN students s ON em.student_id = s.id
      WHERE em.ensemble_id = $1
      ORDER BY em.id
    `, [req.params.id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/:id/members', async (req, res) => {
  try {
    const { student_id, instrument, part } = req.body;
    const result = await pool.query(
      `INSERT INTO ensemble_members (ensemble_id, student_id, instrument, part)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [req.params.id, student_id, instrument, part]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id/members/:memberId', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM ensemble_members WHERE id = $1 RETURNING *', [req.params.memberId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', item: result.rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
