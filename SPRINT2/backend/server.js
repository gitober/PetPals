
const app = require('./app');
const http = require('http');
const config = require('./utils/config');
const logger = require('./utils/logger');

const PORT = 5000;

const server = http.createServer(app);

server.listen(config.PORT, () => {
  logger.info(`Server is running on http://localhost:${config.PORT}`)
});