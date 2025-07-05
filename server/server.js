const app = require('./app');
const connectDB = require('./config/db');
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});