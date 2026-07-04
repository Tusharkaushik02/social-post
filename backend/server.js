const http = require('http');
const { initializeSocket } = require("./src/socket/socket");
const app= require('./src/app');
const connectDB = require('./src/db/db');
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const startServer = async () => {
  try {
    await connectDB();
    initializeSocket(server);

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
};

startServer();