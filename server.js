const express = require('express');
const cors = require('cors');

const artistRoutes = require('./routes/artists');
const songRoutes = require('./routes/songs');
const genreRoutes = require('./routes/genres');
const playlistRoutes = require('./routes/playlists');
const moodRoutes = require('./routes/mood');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Mount routers
app.use('/api/artists', artistRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/mood', moodRoutes);

// Root — quick health check
app.get('/', (req, res) => {
  res.json({ message: 'COMP 4513 Assignment 1 API is running.' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
