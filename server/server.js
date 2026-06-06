require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 4000;

async function startServer() {
  await connectDB(process.env.MONGODB_URI);

  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Server failed to start:', error.message);
  process.exit(1);
});