const express = require('express');
const router = express.Router();
const db = require('../db');

const ARTISTS_BASE = `
  SELECT a.artist_id, a.artist_name, a.artist_image_url, a.spotify_url, a.spotify_desc,
         t.type_name
  FROM artists a
  INNER JOIN types t ON a.artist_type_id = t.type_id
`;

const formatArtist = (row) => ({
  artist_id: row.artist_id,
  artist_name: row.artist_name,
  artist_image_url: row.artist_image_url,
  spotify_url: row.spotify_url,
  spotify_desc: row.spotify_desc,
  types: { type_name: row.type_name },
});

// GET /api/artists — all artists sorted by name
router.get('/', (req, res) => {
  const rows = db.prepare(ARTISTS_BASE + ' ORDER BY a.artist_name').all();
  res.json(rows.map(formatArtist));
});

// GET /api/artists/averages/:ref — average song stats for an artist
// MUST be registered before /:ref to avoid param conflict
router.get('/averages/:ref', (req, res) => {
  const ref = parseInt(req.params.ref);
  if (isNaN(ref)) {
    return res.status(404).json({ error: `No artist found with id: ${req.params.ref}` });
  }

  const row = db.prepare(`
    SELECT AVG(bpm) AS bpm, AVG(energy) AS energy, AVG(danceability) AS danceability,
           AVG(loudness) AS loudness, AVG(liveness) AS liveness, AVG(valence) AS valence,
           AVG(duration) AS duration, AVG(acousticness) AS acousticness,
           AVG(speechiness) AS speechiness, AVG(popularity) AS popularity
    FROM songs WHERE artist_id = ?
  `).get(ref);

  if (!row || row.bpm === null) {
    return res.status(404).json({ error: `No songs found for artist with id: ${ref}` });
  }

  res.json(row);
});

// GET /api/artists/:ref — single artist by id
router.get('/:ref', (req, res) => {
  const ref = parseInt(req.params.ref);
  if (isNaN(ref)) {
    return res.status(404).json({ error: `No artist found with id: ${req.params.ref}` });
  }

  const row = db.prepare(ARTISTS_BASE + ' WHERE a.artist_id = ?').get(ref);
  if (!row) {
    return res.status(404).json({ error: `No artist found with id: ${ref}` });
  }

  res.json(formatArtist(row));
});

module.exports = router;
