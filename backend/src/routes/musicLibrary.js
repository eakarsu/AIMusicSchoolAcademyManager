const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM music_library ORDER BY id');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM music_library WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { title, composer, arranger, genre, difficulty_level, instrument, isbn, publisher, copies_available, location, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO music_library (title, composer, arranger, genre, difficulty_level, instrument, isbn, publisher, copies_available, location, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [title, composer, arranger, genre, difficulty_level, instrument, isbn, publisher, copies_available, location, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, composer, arranger, genre, difficulty_level, instrument, isbn, publisher, copies_available, location, notes } = req.body;
    const result = await pool.query(
      `UPDATE music_library SET title=$1, composer=$2, arranger=$3, genre=$4, difficulty_level=$5, instrument=$6, isbn=$7, publisher=$8, copies_available=$9, location=$10, notes=$11
       WHERE id=$12 RETURNING *`,
      [title, composer, arranger, genre, difficulty_level, instrument, isbn, publisher, copies_available, location, notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM music_library WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', item: result.rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
