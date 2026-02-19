# COMP 4513 — Assignment 1

A RESTful API for querying a Spotify-style music database, built with Node.js, Express, and SQLite (better-sqlite3).

## Setup

```bash
npm install
npm start
```

The server listens on port **8080** by default (or `$PORT` if set by the host).

---

## API Test Links

Replace `HOST` with your deployed URL (e.g. `https://your-app.onrender.com`).

### Artists

| Route | Description |
|---|---|
| [HOST/api/artists](HOST/api/artists) | All artists sorted by name |
| [HOST/api/artists/10](HOST/api/artists/10) | Artist with id 10 |
| [HOST/api/artists/129](HOST/api/artists/129) | Artist with id 129 |
| [HOST/api/artists/9999](HOST/api/artists/9999) | Not found — returns error |
| [HOST/api/artists/averages/10](HOST/api/artists/averages/10) | Average song stats for artist 10 |

### Genres

| Route | Description |
|---|---|
| [HOST/api/genres](HOST/api/genres) | All genres |

### Songs

| Route | Description |
|---|---|
| [HOST/api/songs](HOST/api/songs) | All songs sorted by title |
| [HOST/api/songs/1010](HOST/api/songs/1010) | Song with id 1010 |
| [HOST/api/songs/9999](HOST/api/songs/9999) | Not found — returns error |
| [HOST/api/songs/sort/id](HOST/api/songs/sort/id) | Songs sorted by id |
| [HOST/api/songs/sort/title](HOST/api/songs/sort/title) | Songs sorted by title |
| [HOST/api/songs/sort/artist](HOST/api/songs/sort/artist) | Songs sorted by artist name |
| [HOST/api/songs/sort/genre](HOST/api/songs/sort/genre) | Songs sorted by genre name |
| [HOST/api/songs/sort/year](HOST/api/songs/sort/year) | Songs sorted by year |
| [HOST/api/songs/sort/duration](HOST/api/songs/sort/duration) | Songs sorted by duration |
| [HOST/api/songs/search/begin/love](HOST/api/songs/search/begin/love) | Songs starting with "love" |
| [HOST/api/songs/search/any/love](HOST/api/songs/search/any/love) | Songs containing "love" |
| [HOST/api/songs/search/year/2019](HOST/api/songs/search/year/2019) | Songs from 2019 |
| [HOST/api/songs/artist/149](HOST/api/songs/artist/149) | Songs by artist 149 |
| [HOST/api/songs/genre/115](HOST/api/songs/genre/115) | Songs in genre 115 |

### Playlists

| Route | Description |
|---|---|
| [HOST/api/playlists](HOST/api/playlists) | All playlist ids |
| [HOST/api/playlists/3](HOST/api/playlists/3) | Songs in playlist 3 |
| [HOST/api/playlists/35362](HOST/api/playlists/35362) | Not found — returns error |

### Mood

| Route | Description |
|---|---|
| [HOST/api/mood/dancing](HOST/api/mood/dancing) | Top 20 songs by danceability |
| [HOST/api/mood/dancing/5](HOST/api/mood/dancing/5) | Top 5 songs by danceability |
| [HOST/api/mood/happy](HOST/api/mood/happy) | Top 20 songs by valence |
| [HOST/api/mood/happy/5](HOST/api/mood/happy/5) | Top 5 songs by valence |
| [HOST/api/mood/coffee](HOST/api/mood/coffee) | Top 20 songs by liveness/acousticness |
| [HOST/api/mood/coffee/5](HOST/api/mood/coffee/5) | Top 5 songs by liveness/acousticness |
| [HOST/api/mood/studying](HOST/api/mood/studying) | Top 20 songs by energy×speechiness (asc) |
| [HOST/api/mood/studying/5](HOST/api/mood/studying/5) | Top 5 songs by energy×speechiness (asc) |

---

## Notes

- All song responses nest `artist` and `genre` as objects rather than exposing foreign keys.
- All artist responses nest `types` as an object rather than exposing `artist_type_id`.
- Mood `ref` values outside `[1, 20]` default to 20.
- Not-found responses return HTTP 404 with `{ "error": "..." }`.
