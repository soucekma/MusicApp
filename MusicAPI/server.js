const express = require('express');
const cors = require('cors');
const app = express();
const dbo = require('./db/connection');

// Middleware

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/musicians', require('./routes/musicians'));
app.use('/albums', require('./routes/albums'));

// Error Handling Middleware
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('An error occurred!');
});

// Port Configuration
const PORT = process.env.PORT || 3000;

// Connect to Database and Start Server
(async function startServer() {
    try {
        await dbo.connectToServer();
        app.listen(PORT, () => {
            console.log('Server started on port ' + PORT);
        });
    } catch (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }
})();
