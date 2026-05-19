const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const PDFDocument = require('pdfkit');

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
    if (!title || !title.trim()) return res.status(400).json({ error: 'Title is required' });
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

// PDF Export
router.get('/:id/export-pdf', async (req, res) => {
  try {
    const recitalResult = await pool.query('SELECT * FROM recitals WHERE id = $1', [req.params.id]);
    if (recitalResult.rows.length === 0) return res.status(404).json({ error: 'Recital not found' });

    const recital = recitalResult.rows[0];
    const performers = await pool.query(`
      SELECT rp.*, s.first_name, s.last_name
      FROM recital_performers rp
      LEFT JOIN students s ON rp.student_id = s.id
      WHERE rp.recital_id = $1
      ORDER BY rp.performance_order
    `, [req.params.id]);

    const doc = new PDFDocument({ margin: 60, size: 'LETTER' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="recital-${recital.id}.pdf"`);
    doc.pipe(res);

    // Header
    doc.fontSize(28).font('Helvetica-Bold').text(recital.title, { align: 'center' });
    doc.moveDown(0.5);

    // Date, time, venue
    doc.fontSize(14).font('Helvetica');
    if (recital.date) doc.text(`Date: ${new Date(recital.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, { align: 'center' });
    if (recital.time) doc.text(`Time: ${recital.time}`, { align: 'center' });
    if (recital.venue) doc.text(`Venue: ${recital.venue}`, { align: 'center' });
    doc.moveDown(1);

    // Divider
    doc.moveTo(60, doc.y).lineTo(552, doc.y).stroke();
    doc.moveDown(0.5);

    // Welcome message
    doc.fontSize(12).font('Helvetica-BoldOblique').text('Welcome', { align: 'center' });
    doc.font('Helvetica').fontSize(11).text(
      recital.description || 'Welcome to our music recital! We are delighted to share this special musical journey with you.',
      { align: 'center' }
    );
    doc.moveDown(1);

    // Program
    if (performers.rows.length > 0) {
      doc.fontSize(16).font('Helvetica-Bold').text('Program', { align: 'center' });
      doc.moveDown(0.5);
      doc.moveTo(60, doc.y).lineTo(552, doc.y).stroke();
      doc.moveDown(0.5);

      performers.rows.forEach((p, i) => {
        const performer = p.first_name ? `${p.first_name} ${p.last_name}` : `Performer ${i + 1}`;
        doc.fontSize(13).font('Helvetica-Bold').text(`${i + 1}. ${p.piece_title || 'Untitled Piece'}`);
        if (p.composer) doc.fontSize(11).font('Helvetica-Oblique').text(`  by ${p.composer}`);
        doc.fontSize(11).font('Helvetica').text(`  Performed by: ${performer}`);
        if (p.notes) doc.fontSize(10).fillColor('#666').text(`  ${p.notes}`).fillColor('black');
        doc.moveDown(0.5);
      });
    }

    doc.moveDown(1);
    doc.moveTo(60, doc.y).lineTo(552, doc.y).stroke();
    doc.moveDown(0.5);

    // Closing
    doc.fontSize(11).font('Helvetica-Oblique').text(
      'Thank you for joining us today. We hope you enjoy the performances!',
      { align: 'center' }
    );

    doc.end();
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ error: err.message });
  }
});

module.exports = router;
