const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/genres — all genres sorted by name
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM genres ORDER BY genre_name').all();
  res.json(rows);
});

module.exports = router;
