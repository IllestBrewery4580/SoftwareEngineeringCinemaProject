const express = require('express');
const cors = require('cors');
const db = reqiore("./db");
const app = express();

app.use(cors());
app.use(express.json())

// Hardcoded showtimes for now
const SHOWTIMES = ["2:00 PM", "5:00 PM", "8:00 PM"];

// Home Page - all movies
app.get("/movies", (req, res) => {
    db.all("SELECT * FROM movies", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        const today = new Date();
        const movies = rows.map(m => ({
            ...m,
            showtimes: SHOWTIMES,
            status: new Date(m.release_date) <= today ? "Currently Running" : "Coming Soon"
        }));

        res.json(movies);
    });
});

// Get movie details
app.get("/movies/:id", (req, res) => {
    db.all("SELECT * FROM movies", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!movie) return res.status(404).json({ error: "Movie not found" });

        movie.showtimes = SHOWTIMES;
        res.json(movie);
    });
});

// ✅ Search by title
app.get("/search", (req, res) => {
  const { title } = req.query;
  db.all("SELECT * FROM movies WHERE title LIKE ?", [`%${title}%`], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const movies = rows.map(m => ({ ...m, showtimes: SHOWTIMES }));
    res.json(movies);
  });
});

// ✅ Filter by genre
app.get("/filter", (req, res) => {
  const { genre } = req.query;
  db.all("SELECT * FROM movies WHERE genre = ?", [genre], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const movies = rows.map(m => ({ ...m, showtimes: SHOWTIMES }));
    res.json(movies);
  });
});

// ✅ Booking (prototype only)
app.get("/booking/:id/:showtime", (req, res) => {
  db.get("SELECT id, title FROM movies WHERE id = ?", [req.params.id], (err, movie) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!movie) return res.status(404).json({ error: "Movie not found" });

    res.json({
      movie_title: movie.title,
      showtime: req.params.showtime,
      message: "Booking UI prototype only. Seats & checkout not implemented."
    });
  });
});

// ✅ Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));