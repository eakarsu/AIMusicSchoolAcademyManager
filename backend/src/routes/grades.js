const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT g.*, s.first_name AS student_first_name, s.last_name AS student_last_name
      FROM grades g
      LEFT JOIN students s ON g.student_id = s.id
      ORDER BY g.id
    `);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT g.*, s.first_name AS student_first_name, s.last_name AS student_last_name
      FROM grades g
      LEFT JOIN students s ON g.student_id = s.id
      WHERE g.id = $1
    `, [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { student_id, exam_type, level, score, date, examiner, status, certificate_issued, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO grades (student_id, exam_type, level, score, date, examiner, status, certificate_issued, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [student_id, exam_type, level, score, date, examiner, status, certificate_issued, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { student_id, exam_type, level, score, date, examiner, status, certificate_issued, notes } = req.body;
    const result = await pool.query(
      `UPDATE grades SET student_id=$1, exam_type=$2, level=$3, score=$4, date=$5, examiner=$6, status=$7, certificate_issued=$8, notes=$9
       WHERE id=$10 RETURNING *`,
      [student_id, exam_type, level, score, date, examiner, status, certificate_issued, notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM grades WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', item: result.rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
