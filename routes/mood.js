const express = require('express');
const router = express.Router();
const db = require('../db');
const { SONGS_BASE, formatSong } = require('./songHelpers');

const getLimit = (ref) => {
  const n = parseInt(ref);
  if (isNaN(n) || n < 1 || n > 20) return 20;
  return n;
};

router.get('/dancing', (req, res) => {
  const rows = db.prepare(SONGS_BASE + ' ORDER BY s.danceability DESC LIMIT ?').all(20);
  res.json(rows.map(formatSong));
});

router.get('/dancing/:ref', (req, res) => {
  const limit = getLimit(req.params.ref);
  const rows = db.prepare(SONGS_BASE + ' ORDER BY s.danceability DESC LIMIT ?').all(limit);
  res.json(rows.map(formatSong));
});

// valence is the positivity score
router.get('/happy', (req, res) => {
  const rows = db.prepare(SONGS_BASE + ' ORDER BY s.valence DESC LIMIT ?').all(20);
  res.json(rows.map(formatSong));
});

router.get('/happy/:ref', (req, res) => {
  const limit = getLimit(req.params.ref);
  const rows = db.prepare(SONGS_BASE + ' ORDER BY s.valence DESC LIMIT ?').all(limit);
  res.json(rows.map(formatSong));
});

router.get('/coffee', (req, res) => {
  const rows = db.prepare(SONGS_BASE + ' ORDER BY (CAST(s.liveness AS REAL) / s.acousticness) DESC LIMIT ?').all(20);
  res.json(rows.map(formatSong));
});

router.get('/coffee/:ref', (req, res) => {
  const limit = getLimit(req.params.ref);
  const rows = db.prepare(SONGS_BASE + ' ORDER BY (CAST(s.liveness AS REAL) / s.acousticness) DESC LIMIT ?').all(limit);
  res.json(rows.map(formatSong));
});

// low energy * speechiness = good for background studying
router.get('/studying', (req, res) => {
  const rows = db.prepare(SONGS_BASE + ' ORDER BY (s.energy * s.speechiness) ASC LIMIT ?').all(20);
  res.json(rows.map(formatSong));
});

router.get('/studying/:ref', (req, res) => {
  const limit = getLimit(req.params.ref);
  const rows = db.prepare(SONGS_BASE + ' ORDER BY (s.energy * s.speechiness) ASC LIMIT ?').all(limit);
  res.json(rows.map(formatSong));
});

module.exports = router;
