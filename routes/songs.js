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

const SORT_MAP = {
  id: 's.song_id',
  title: 's.title',
  artist: 'a.artist_name',
  genre: 'g.genre_name',
  year: 's.year',
  duration: 's.duration',
};

// GET /api/songs — all songs sorted by title
router.get('/', (req, res) => {
  const rows = db.prepare(SONGS_BASE + ' ORDER BY s.title').all();
  res.json(rows.map(formatSong));
});

// GET /api/songs/sort/:order — songs sorted by a given field
// MUST be registered before /:ref
router.get('/sort/:order', (req, res) => {
  const order = req.params.order.toLowerCase();
  const sortField = SORT_MAP[order];

  if (!sortField) {
    return res.status(400).json({ error: `Invalid sort field: ${req.params.order}. Valid values: ${Object.keys(SORT_MAP).join(', ')}` });
  }

  const rows = db.prepare(SONGS_BASE + ` ORDER BY ${sortField}`).all();
  res.json(rows.map(formatSong));
});

// GET /api/songs/search/begin/:substring — songs whose title starts with substring
router.get('/search/begin/:substring', (req, res) => {
  const sub = req.params.substring;
  const rows = db.prepare(SONGS_BASE + ' WHERE LOWER(s.title) LIKE LOWER(?) ORDER BY s.title')
    .all(`${sub}%`);

  if (rows.length === 0) {
    return res.status(404).json({ error: `No songs found starting with: ${sub}` });
  }

  res.json(rows.map(formatSong));
});

// GET /api/songs/search/any/:substring — songs whose title contains substring
router.get('/search/any/:substring', (req, res) => {
  const sub = req.params.substring;
  const rows = db.prepare(SONGS_BASE + ' WHERE LOWER(s.title) LIKE LOWER(?) ORDER BY s.title')
    .all(`%${sub}%`);

  if (rows.length === 0) {
    return res.status(404).json({ error: `No songs found containing: ${sub}` });
  }

  res.json(rows.map(formatSong));
});

// GET /api/songs/search/year/:year — songs from a given year
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

// GET /api/songs/artist/:ref — all songs by a given artist id
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

// GET /api/songs/genre/:ref — all songs in a given genre id
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

// GET /api/songs/:ref — single song by id
// MUST be registered last to avoid swallowing named sub-routes
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
