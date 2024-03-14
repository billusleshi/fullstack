const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// Sample data for demo purposes
let songs = [
    { id: 1, title: 'Song 1' },
    { id: 2, title: 'Song 2' },
    { id: 3, title: 'Song 3' }
];

// Create a new song
app.post('/songs', (req, res) => {
    const newSong = req.body;
    songs.push(newSong);
    res.send('Song created successfully');
});

// List all songs
app.get('/songs', (req, res) => {
    res.json(songs);
});

// Update a specific song
app.put('/songs/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedSong = req.body;

    for (let i = 0; i < songs.length; i++) {
        if (songs[i].id === id) {
            songs[i] = updatedSong;
            return res.send('Song updated successfully');
        }
    }

    res.status(404).send('Song not found');
});

// Delete a specific song
app.delete('/songs/:id', (req, res) => {
    const id = parseInt(req.params.id);

    songs = songs.filter(song => song.id !== id);
    res.send('Song deleted successfully');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log( {PORT});
});
const mongoose = require('mongoose');

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://localhost/myMusicApp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define a schema for the 'songs' collection
const songSchema = new mongoose.Schema({
    title: String,
    artist: String,
    album: String,
    genre: String
});

// Create a model based on the schema
const Song = mongoose.model('Song', songSchema);

// Sample song data for demonstration
const sampleSong = new Song({
    title: 'Song Title',
    artist: 'Artist Name',
    album: 'Album Name',
    genre: 'Song Genre'
});

// Save the sample song to the database
sampleSong.save()
  .then(savedSong => console.log('Saved Song:', savedSong))
  .catch(err => console.error('Error saving song:', err));

  const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/myMusicApp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define Mongoose schema and model for 'songs' collection
const songSchema = new mongoose.Schema({
    title: String,
    artist: String,
    album: String,
    genre: String
});

const Song = mongoose.model('Song', songSchema);

// Route for generating overall statistics
app.get('/statistics', async (req, res) => {
    try {
        const totalSongs = await Song.countDocuments();
        const totalArtists = await Song.distinct('artist').length;
        const totalAlbums = await Song.distinct('album').length;
        const totalGenres = await Song.distinct('genre').length;

        const genresStatistics = await Song.aggregate([
            { $group: { _id: '$genre', count: { $sum: 1 } } }
        ]);

        const artistSongsStatistics = await Song.aggregate([
            { $group: { _id: '$artist', totalSongs: { $sum: 1 }, totalAlbums: { $addToSet: '$album' } } }
        ]);

        const albumSongsStatistics = await Song.aggregate([
            { $group: { _id: '$album', totalSongs: { $sum: 1 } } }
        ]);

        res.json({
            totalSongs,
            totalArtists,
            totalAlbums,
            totalGenres,
            genresStatistics,
            artistSongsStatistics,
            albumSongsStatistics
        });
    } catch (err) {
        console.error('Error generating statistics:', err);
        res.status(500).send('Error generating statistics');
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log({PORT});
});

