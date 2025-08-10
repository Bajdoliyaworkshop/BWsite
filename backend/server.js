require('dotenv').config();
const connectDB = require('./config/db');
const { app } = require('./api/index'); // Get plain Express app

const PORT = process.env.PORT || 5001;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running locally at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
})();
