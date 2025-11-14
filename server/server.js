const express = require('express');
const cors = require('cors');
const db = reqiore("./db");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const SHOWTIMES = ["2:00 PM", "5:00 PM", "8:00 PM"];

// Get all movies
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

        const today = new Date();
        const movies = rows.map(m => ({
            ...m,
            showtimes: SHOWTIMES,
            status: new Date(m.release_date) <= today ? "Currently Running" : "Coming Soon"
        }));

        res.json(movies);
    });
});