const express = require('express');
const router = express.Router();
const dbo = require('../db/connection');

// GET all musicians
router.get('/', async (req, res) => {
    try {
        const db = dbo.getDb();
        const musicians = await db.collection('musicians').find().toArray();
        res.json(musicians);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET a single musician by ID
router.get('/:id', async (req, res) => {
    try {
        const db = dbo.getDb();
        const musician = await db.collection('musicians').findOne({ musician_id: parseInt(req.params.id) });
        if (!musician) return res.status(404).json({ error: 'Musician not found' });
        res.json(musician);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST CREATE a new musician
router.post('/', async (req, res) => {
    try {
        const db = dbo.getDb();
        const newMusician = req.body;
        await db.collection('musicians').insertOne(newMusician);
        res.status(201).json(newMusician);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Search musicians by term
router.get('/search/:term', async (req, res) => {
    try {
        const db = dbo.getDb();
        const term = req.params.term;
        const musicians = await db.collection('musicians').find({ $text: { $search: term } }).toArray();
        res.json(musicians);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Edit a musician by ID
router.put('/:id', async (req, res) => {
    try {
        const db = dbo.getDb();
        const id = parseInt(req.params.id);
        const updateData = req.body;

        const result = await db.collection('musicians').updateOne(
            { musician_id: id },
            { $set: updateData }
        );

        if (result.matchedCount === 0) return res.status(404).json({ error: 'Musician not found' });
        res.json({ message: 'Musician updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a musician by ID
router.delete('/:id', async (req, res) => {
    try {
        const db = dbo.getDb();
        const id = parseInt(req.params.id);

        const result = await db.collection('musicians').deleteOne({ musician_id: id });

        if (result.deletedCount === 0) return res.status(404).json({ error: 'Musician not found' });
        res.json({ message: 'Musician deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Test CREATE, DELETE, EDIT and check (with Postman)
// Checked => works


module.exports = router;
