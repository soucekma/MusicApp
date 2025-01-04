const { MongoClient } = require('mongodb');
const connectionString = 'mongodb://127.0.0.1:27017';

const client = new MongoClient(connectionString); // No options needed

let dbConnection;

module.exports = {
    connectToServer: async function () {
        try {
            const db = await client.connect();
            dbConnection = db.db('music');
            console.log('Successfully connected to MongoDB');
        } catch (err) {
            console.error('Error connecting to MongoDB:', err);
            process.exit(1);
        }
    },

    getDb: function () {
        if (!dbConnection) {
            throw new Error('Database not initialized.');
        }
        return dbConnection;
    }
};
