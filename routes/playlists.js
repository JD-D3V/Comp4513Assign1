const express = require('express');
const router = express.Router();
const db = require('../db');

const PLAYLIST_SONGS_QUERY = `
  SELECT p.playlist_id, s.song_id, s.title, a.artist_name, g.genre_name, s.year
  FROM playlists p
  INNER JOIN songs s ON p.song_id = s.song_id
  INNER JOIN artists a ON s.artist_id = a.artist_id
  INNER JOIN genres g ON s.genre_id = g.genre_id
`;

// GET /api/playlists — all distinct playlist ids
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT DISTINCT playlist_id FROM playlists ORDER BY playlist_id').all();
  res.json(rows);
});

// GET /api/playlists/:ref — all songs in the given playlist
router.get('/:ref', (req, res) => {
  const ref = parseInt(req.params.ref);
  if (isNaN(ref)) {
    return res.status(404).json({ error: `No playlist found with id: ${req.params.ref}` });
  }

  const rows = db.prepare(PLAYLIST_SONGS_QUERY + ' WHERE p.playlist_id = ?').all(ref);
  if (rows.length === 0) {
    return res.status(404).json({ error: `No playlist found with id: ${ref}` });
  }

  res.json(rows);
});

module.exports = router;
