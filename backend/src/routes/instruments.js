const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM instruments ORDER BY id');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM instruments WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { name, type, brand, model, serial_number, condition, purchase_date, purchase_price, status, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO instruments (name, type, brand, model, serial_number, condition, purchase_date, purchase_price, status, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [name, type, brand, model, serial_number, condition, purchase_date, purchase_price, status, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, type, brand, model, serial_number, condition, purchase_date, purchase_price, status, notes } = req.body;
    const result = await pool.query(
      `UPDATE instruments SET name=$1, type=$2, brand=$3, model=$4, serial_number=$5, condition=$6, purchase_date=$7, purchase_price=$8, status=$9, notes=$10
       WHERE id=$11 RETURNING *`,
      [name, type, brand, model, serial_number, condition, purchase_date, purchase_price, status, notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM instruments WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', item: result.rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
