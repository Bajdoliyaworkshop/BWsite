// backend/server.js
require('dotenv').config();
const connectDB = require('./config/db');
const app = require('./api/index').app || require('./api/index'); // Import the Express app from api/index.js

const PORT = process.env.PORT || 5001;

(async () => {
  try {
    await connectDB(); // Connect to MongoDB before starting server
    app.listen(PORT, () => {
      console.log(`🚀 Server running locally at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
})();
