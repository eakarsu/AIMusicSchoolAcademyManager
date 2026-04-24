const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT rc.*, s.first_name AS student_first_name, s.last_name AS student_last_name,
             t.first_name AS teacher_first_name, t.last_name AS teacher_last_name
      FROM report_cards rc
      LEFT JOIN students s ON rc.student_id = s.id
      LEFT JOIN teachers t ON rc.teacher_id = t.id
      ORDER BY rc.id
    `);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT rc.*, s.first_name AS student_first_name, s.last_name AS student_last_name,
             t.first_name AS teacher_first_name, t.last_name AS teacher_last_name
      FROM report_cards rc
      LEFT JOIN students s ON rc.student_id = s.id
      LEFT JOIN teachers t ON rc.teacher_id = t.id
      WHERE rc.id = $1
    `, [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { student_id, teacher_id, term, year, instrument, technique_grade, musicality_grade, theory_grade, sight_reading_grade, practice_grade, overall_grade, comments, goals } = req.body;
    const result = await pool.query(
      `INSERT INTO report_cards (student_id, teacher_id, term, year, instrument, technique_grade, musicality_grade, theory_grade, sight_reading_grade, practice_grade, overall_grade, comments, goals)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [student_id, teacher_id, term, year, instrument, technique_grade, musicality_grade, theory_grade, sight_reading_grade, practice_grade, overall_grade, comments, goals]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { student_id, teacher_id, term, year, instrument, technique_grade, musicality_grade, theory_grade, sight_reading_grade, practice_grade, overall_grade, comments, goals } = req.body;
    const result = await pool.query(
      `UPDATE report_cards SET student_id=$1, teacher_id=$2, term=$3, year=$4, instrument=$5, technique_grade=$6, musicality_grade=$7, theory_grade=$8, sight_reading_grade=$9, practice_grade=$10, overall_grade=$11, comments=$12, goals=$13
       WHERE id=$14 RETURNING *`,
      [student_id, teacher_id, term, year, instrument, technique_grade, musicality_grade, theory_grade, sight_reading_grade, practice_grade, overall_grade, comments, goals, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM report_cards WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', item: result.rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
