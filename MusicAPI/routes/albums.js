const express = require('express');
const router = express.Router();
const dbo = require('../db/connection');

// GET all albums
router.get('/', async (req, res) => {
    try {
        const db = dbo.getDb();
        const albums = await db.collection('albums').find().toArray();
        res.json(albums);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET all albums by a musician ID
router.get('/musician/:id', async (req, res) => {
    try {
        const db = dbo.getDb();
        const albums = await db.collection('albums').find({ musician_id: parseInt(req.params.id) }).toArray();
        res.json(albums);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST (create) a new album
router.post('/', async (req, res) => {
    try {
        const db = dbo.getDb();
        const newAlbum = req.body;
        await db.collection('albums').insertOne(newAlbum);
        res.status(201).json(newAlbum);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET a single album by ID
router.get('/:id', async (req, res) => {
    try {
        const db = dbo.getDb();
        const album = await db.collection('albums').findOne({ album_id: parseInt(req.params.id) });
        if (!album) return res.status(404).json({ error: 'Album not found' });
        res.json(album);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Search albums by term
router.get('/search/:term', async (req, res) => {
    try {
        const db = dbo.getDb();
        const term = req.params.term;
        const albums = await db.collection('albums').find({ $text: { $search: term } }).toArray();
        res.json(albums);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Edit an album by ID
router.put('/:id', async (req, res) => {
    try {
        const db = dbo.getDb();
        const id = parseInt(req.params.id);
        const updateData = req.body;

        const result = await db.collection('albums').updateOne(
            { album_id: id },
            { $set: updateData }
        );

        if (result.matchedCount === 0) return res.status(404).json({ error: 'Album not found' });
        res.json({ message: 'Album updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete an album by ID
router.delete('/:id', async (req, res) => {
    try {
        const db = dbo.getDb();
        const id = parseInt(req.params.id);

        const result = await db.collection('albums').deleteOne({ album_id: id });

        if (result.deletedCount === 0) return res.status(404).json({ error: 'Album not found' });
        res.json({ message: 'Album deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Test CREATE, DELETE, EDIT and check (with Postman)
// Checked => works

module.exports = router;
