const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM families ORDER BY id');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM families WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id/members', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students WHERE family_id = $1 ORDER BY id', [req.params.id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { family_name, primary_contact, email, phone, address, discount_percentage, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO families (family_name, primary_contact, email, phone, address, discount_percentage, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [family_name, primary_contact, email, phone, address, discount_percentage, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { family_name, primary_contact, email, phone, address, discount_percentage, notes } = req.body;
    const result = await pool.query(
      `UPDATE families SET family_name=$1, primary_contact=$2, email=$3, phone=$4, address=$5, discount_percentage=$6, notes=$7
       WHERE id=$8 RETURNING *`,
      [family_name, primary_contact, email, phone, address, discount_percentage, notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM families WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', item: result.rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
