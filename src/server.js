const app = require('./app');
const connectDB = require('./config/db');
const { PORT } = require('./config/env');

const DEFAULT_PORT = Number(PORT) || 5000;
const MAX_PORT_RETRIES = 10;

const startServer = (port, attempt = 0) => {
  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && attempt < MAX_PORT_RETRIES) {
      const nextPort = port + 1;
      console.warn(`Port ${port} is in use. Retrying on ${nextPort}...`);
      startServer(nextPort, attempt + 1);
      return;
    }

    console.error('Failed to start server:', error.message);
    process.exit(1);
  });
};

const bootstrap = async () => {
  try {
    await connectDB(); // connect to database
    startServer(DEFAULT_PORT);
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
};

bootstrap();