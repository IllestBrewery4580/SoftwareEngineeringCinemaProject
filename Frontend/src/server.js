const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Sample movie data


// Routes
app.get('/movies', (req, res) => {
    res.json(movies);
});

app.get('/movies/:id', (req, res) => {
    const movie = movies.find(m => m.id === parseInt(reqparams.id));
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json(movie);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})