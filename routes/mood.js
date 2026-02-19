const express = require('express');
const router = express.Router();
const db = require('../db');

const SONGS_BASE = `
  SELECT s.song_id, s.title, s.year, s.bpm, s.energy, s.danceability, s.loudness,
         s.liveness, s.valence, s.duration, s.acousticness, s.speechiness, s.popularity,
         a.artist_id, a.artist_name,
         g.genre_id, g.genre_name
  FROM songs s
  INNER JOIN artists a ON s.artist_id = a.artist_id
  INNER JOIN genres g ON s.genre_id = g.genre_id
`;

const formatSong = (row) => ({
  song_id: row.song_id,
  title: row.title,
  year: row.year,
  bpm: row.bpm,
  energy: row.energy,
  danceability: row.danceability,
  loudness: row.loudness,
  liveness: row.liveness,
  valence: row.valence,
  duration: row.duration,
  acousticness: row.acousticness,
  speechiness: row.speechiness,
  popularity: row.popularity,
  artist: { artist_id: row.artist_id, artist_name: row.artist_name },
  genre: { genre_id: row.genre_id, genre_name: row.genre_name },
});

// Clamp N to [1, 20], defaulting to 20 for missing/invalid values
const getLimit = (ref) => {
  const n = parseInt(ref);
  if (isNaN(n) || n < 1 || n > 20) return 20;
  return n;
};

// GET /api/mood/dancing/:ref? — top N songs by danceability (descending)
router.get('/dancing/:ref?', (req, res) => {
  const limit = getLimit(req.params.ref);
  const rows = db.prepare(SONGS_BASE + ' ORDER BY s.danceability DESC LIMIT ?').all(limit);
  res.json(rows.map(formatSong));
});

// GET /api/mood/happy/:ref? — top N songs by valence (descending)
router.get('/happy/:ref?', (req, res) => {
  const limit = getLimit(req.params.ref);
  const rows = db.prepare(SONGS_BASE + ' ORDER BY s.valence DESC LIMIT ?').all(limit);
  res.json(rows.map(formatSong));
});

// GET /api/mood/coffee/:ref? — top N songs by liveness/acousticness (descending)
router.get('/coffee/:ref?', (req, res) => {
  const limit = getLimit(req.params.ref);
  const rows = db
    .prepare(SONGS_BASE + ' ORDER BY (CAST(s.liveness AS REAL) / s.acousticness) DESC LIMIT ?')
    .all(limit);
  res.json(rows.map(formatSong));
});

// GET /api/mood/studying/:ref? — top N songs by energy*speechiness (ascending)
router.get('/studying/:ref?', (req, res) => {
  const limit = getLimit(req.params.ref);
  const rows = db
    .prepare(SONGS_BASE + ' ORDER BY (s.energy * s.speechiness) ASC LIMIT ?')
    .all(limit);
  res.json(rows.map(formatSong));
});

module.exports = router;
