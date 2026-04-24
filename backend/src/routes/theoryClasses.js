const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT tc.*, t.first_name AS teacher_first_name, t.last_name AS teacher_last_name
      FROM theory_classes tc
      LEFT JOIN teachers t ON tc.teacher_id = t.id
      ORDER BY tc.id
    `);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT tc.*, t.first_name AS teacher_first_name, t.last_name AS teacher_last_name
      FROM theory_classes tc
      LEFT JOIN teachers t ON tc.teacher_id = t.id
      WHERE tc.id = $1
    `, [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { name, level, teacher_id, day_of_week, start_time, end_time, room_id, max_students, current_students, price, status, syllabus } = req.body;
    const result = await pool.query(
      `INSERT INTO theory_classes (name, level, teacher_id, day_of_week, start_time, end_time, room_id, max_students, current_students, price, status, syllabus)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [name, level, teacher_id, day_of_week, start_time, end_time, room_id, max_students, current_students, price, status, syllabus]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, level, teacher_id, day_of_week, start_time, end_time, room_id, max_students, current_students, price, status, syllabus } = req.body;
    const result = await pool.query(
      `UPDATE theory_classes SET name=$1, level=$2, teacher_id=$3, day_of_week=$4, start_time=$5, end_time=$6, room_id=$7, max_students=$8, current_students=$9, price=$10, status=$11, syllabus=$12
       WHERE id=$13 RETURNING *`,
      [name, level, teacher_id, day_of_week, start_time, end_time, room_id, max_students, current_students, price, status, syllabus, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM theory_classes WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', item: result.rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
