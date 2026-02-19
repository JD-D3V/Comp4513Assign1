# COMP 4513 — Assignment 1

A RESTful API for querying a Spotify-style music database containing songs, artists, genres, and playlists from 2016–2019. All responses are in JSON format.

**Live API:** https://comp4513assign1-hkvi.onrender.com

---

## Built With

- **Node.js** — Runtime environment
- **Express** — Web framework and routing
- **node:sqlite** — Built-in SQLite database module (no external driver)
- **Render.com** — Hosting

---

## Setup

```bash
npm install
npm start
```

---

## Project Structure

| File | Description |
|---|---|
| `server.js` | Entry point — registers routes and starts the server |
| `db.js` | Opens the SQLite connection and exports it to all routes |
| `routes/artists.js` | All `/api/artists` endpoints |
| `routes/songs.js` | All `/api/songs` endpoints |
| `routes/genres.js` | The `/api/genres` endpoint |
| `routes/playlists.js` | All `/api/playlists` endpoints |
| `routes/mood.js` | All `/api/mood` endpoints |
| `routes/songHelpers.js` | Shared SQL query and song formatter used by songs and mood routes |
| `data/` | SQLite database file |

---

## Design Notes

- All song responses nest `artist` and `genre` as objects rather than exposing raw foreign keys.
- All artist responses nest `types` as an object rather than exposing `artist_type_id`.
- Mood `ref` values outside `[1, 20]` or missing default to 20.
- Not-found responses return HTTP 404 with `{ "error": "..." }`.
- Specific routes (e.g. `/sort/:order`, `/search/begin/:s`) are registered before the catch-all `/:ref` to avoid Express parameter conflicts.

---

## Example Response

**Request:** `GET /api/artists/129`

```json
{
  "artist_id": 129,
  "artist_name": "Ed Sheeran",
  "artist_image_url": "https://i.scdn.co/image/...",
  "spotify_url": "https://open.spotify.com/artist/...",
  "spotify_desc": "Edward Christopher Sheeran ...",
  "types": {
    "type_name": "Solo"
  }
}
```

---

## API Reference

| Method | Route | Description |
|---|---|---|
| GET | `/api/artists` | All artists sorted by name |
| GET | `/api/artists/:id` | Single artist by ID |
| GET | `/api/artists/averages/:id` | Avg audio stats for an artist's songs |
| GET | `/api/genres` | All genres |
| GET | `/api/songs` | All songs sorted by title |
| GET | `/api/songs/sort/:order` | Songs sorted by `artist`, `year`, or `duration` |
| GET | `/api/songs/:id` | Single song by ID |
| GET | `/api/songs/search/begin/:s` | Songs whose title starts with substring |
| GET | `/api/songs/search/any/:s` | Songs whose title contains substring |
| GET | `/api/songs/search/year/:year` | Songs from a given year |
| GET | `/api/songs/artist/:id` | All songs by an artist |
| GET | `/api/songs/genre/:id` | All songs in a genre |
| GET | `/api/playlists` | All playlist IDs |
| GET | `/api/playlists/:id` | All songs in a playlist |
| GET | `/api/mood/dancing/:n` | Top N songs by danceability |
| GET | `/api/mood/happy/:n` | Top N songs by valence |
| GET | `/api/mood/coffee/:n` | Top N songs by liveness/acousticness |
| GET | `/api/mood/studying/:n` | Top N songs by energy × speechiness (asc) |

---

## Test Links

[/api/artists](https://comp4513assign1-hkvi.onrender.com/api/artists)

[/api/artists/129](https://comp4513assign1-hkvi.onrender.com/api/artists/129)

[/api/artists/sdfjkhsdf](https://comp4513assign1-hkvi.onrender.com/api/artists/sdfjkhsdf)

[/api/artists/averages/129](https://comp4513assign1-hkvi.onrender.com/api/artists/averages/129)

[/api/genres](https://comp4513assign1-hkvi.onrender.com/api/genres)

[/api/songs](https://comp4513assign1-hkvi.onrender.com/api/songs)

[/api/songs/sort/artist](https://comp4513assign1-hkvi.onrender.com/api/songs/sort/artist)

[/api/songs/sort/year](https://comp4513assign1-hkvi.onrender.com/api/songs/sort/year)

[/api/songs/sort/duration](https://comp4513assign1-hkvi.onrender.com/api/songs/sort/duration)

[/api/songs/1010](https://comp4513assign1-hkvi.onrender.com/api/songs/1010)

[/api/songs/sjdkfhsdkjf](https://comp4513assign1-hkvi.onrender.com/api/songs/sjdkfhsdkjf)

[/api/songs/search/begin/love](https://comp4513assign1-hkvi.onrender.com/api/songs/search/begin/love)

[/api/songs/search/begin/sdjfhs](https://comp4513assign1-hkvi.onrender.com/api/songs/search/begin/sdjfhs)

[/api/songs/search/any/love](https://comp4513assign1-hkvi.onrender.com/api/songs/search/any/love)

[/api/songs/search/year/2017](https://comp4513assign1-hkvi.onrender.com/api/songs/search/year/2017)

[/api/songs/search/year/2027](https://comp4513assign1-hkvi.onrender.com/api/songs/search/year/2027)

[/api/songs/artist/149](https://comp4513assign1-hkvi.onrender.com/api/songs/artist/149)

[/api/songs/artist/7834562](https://comp4513assign1-hkvi.onrender.com/api/songs/artist/7834562)

[/api/songs/genre/115](https://comp4513assign1-hkvi.onrender.com/api/songs/genre/115)

[/api/playlists](https://comp4513assign1-hkvi.onrender.com/api/playlists)

[/api/playlists/3](https://comp4513assign1-hkvi.onrender.com/api/playlists/3)

[/api/playlists/35362](https://comp4513assign1-hkvi.onrender.com/api/playlists/35362)

[/api/mood/dancing/5](https://comp4513assign1-hkvi.onrender.com/api/mood/dancing/5)

[/api/mood/dancing/500](https://comp4513assign1-hkvi.onrender.com/api/mood/dancing/500)

[/api/mood/dancing/ksdjf](https://comp4513assign1-hkvi.onrender.com/api/mood/dancing/ksdjf)

[/api/mood/happy/8](https://comp4513assign1-hkvi.onrender.com/api/mood/happy/8)

[/api/mood/happy](https://comp4513assign1-hkvi.onrender.com/api/mood/happy)

[/api/mood/coffee/10](https://comp4513assign1-hkvi.onrender.com/api/mood/coffee/10)

[/api/mood/studying/15](https://comp4513assign1-hkvi.onrender.com/api/mood/studying/15)
