const express = require('express');
const router = express.Router();
const db = require('../db');
const { SONGS_BASE, formatSong } = require('./songHelpers');

const SORT_MAP = {
  id: 's.song_id',
  title: 's.title',
  artist: 'a.artist_name',
  genre: 'g.genre_name',
  year: 's.year',
  duration: 's.duration',
};

router.get('/', (req, res) => {
  const rows = db.prepare(SONGS_BASE + ' ORDER BY s.title').all();
  res.json(rows.map(formatSong));
});

router.get('/sort/:order', (req, res) => {
  const order = req.params.order.toLowerCase();
  const sortField = SORT_MAP[order];

  if (!sortField) {
    return res.status(400).json({ error: `Invalid sort field: ${req.params.order}` });
  }

  const rows = db.prepare(SONGS_BASE + ` ORDER BY ${sortField}`).all();
  res.json(rows.map(formatSong));
});

// title starts with substring
router.get('/search/begin/:substring', (req, res) => {
  const sub = req.params.substring;
  const rows = db.prepare(SONGS_BASE + ' WHERE LOWER(s.title) LIKE LOWER(?) ORDER BY s.title')
    .all(`${sub}%`);

  if (rows.length === 0) {
    return res.status(404).json({ error: `No songs found starting with: ${sub}` });
  }

  res.json(rows.map(formatSong));
});

router.get('/search/any/:substring', (req, res) => {
  const sub = req.params.substring;
  const rows = db.prepare(SONGS_BASE + ' WHERE LOWER(s.title) LIKE LOWER(?) ORDER BY s.title')
    .all(`%${sub}%`);

  if (rows.length === 0) {
    return res.status(404).json({ error: `No songs found containing: ${sub}` });
  }

  res.json(rows.map(formatSong));
});

router.get('/search/year/:year', (req, res) => {
  const year = parseInt(req.params.year);
  if (isNaN(year)) {
    return res.status(400).json({ error: `Invalid year: ${req.params.year}` });
  }

  const rows = db.prepare(SONGS_BASE + ' WHERE s.year = ? ORDER BY s.title').all(year);
  if (rows.length === 0) {
    return res.status(404).json({ error: `No songs found for year: ${year}` });
  }

  res.json(rows.map(formatSong));
});

router.get('/artist/:ref', (req, res) => {
  const ref = parseInt(req.params.ref);
  if (isNaN(ref)) {
    return res.status(404).json({ error: `No songs found for artist with id: ${req.params.ref}` });
  }

  const rows = db.prepare(SONGS_BASE + ' WHERE s.artist_id = ? ORDER BY s.title').all(ref);
  if (rows.length === 0) {
    return res.status(404).json({ error: `No songs found for artist with id: ${ref}` });
  }

  res.json(rows.map(formatSong));
});

router.get('/genre/:ref', (req, res) => {
  const ref = parseInt(req.params.ref);
  if (isNaN(ref)) {
    return res.status(404).json({ error: `No songs found for genre with id: ${req.params.ref}` });
  }

  const rows = db.prepare(SONGS_BASE + ' WHERE s.genre_id = ? ORDER BY s.title').all(ref);
  if (rows.length === 0) {
    return res.status(404).json({ error: `No songs found for genre with id: ${ref}` });
  }

  res.json(rows.map(formatSong));
});

router.get('/:ref', (req, res) => {
  const ref = parseInt(req.params.ref);
  if (isNaN(ref)) {
    return res.status(404).json({ error: `No song found with id: ${req.params.ref}` });
  }

  const row = db.prepare(SONGS_BASE + ' WHERE s.song_id = ?').get(ref);
  if (!row) {
    return res.status(404).json({ error: `No song found with id: ${ref}` });
  }

  res.json(formatSong(row));
});

module.exports = router;
