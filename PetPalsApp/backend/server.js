const http = require("http");
const app = require("./app");
const config = require("./config/config");
const logger = require("./utils/logger");

// Increase maxHeaderSize to 32KB
http.globalAgent.maxHeaderSize = 32 * 1024; // Global max header size
const server = http.createServer(app);

// Set server-specific header size to 32KB
server.maxHeaderSize = 32 * 1024;

// Adjust timeout configurations
server.headersTimeout = 60000; // Time allowed for headers
server.keepAliveTimeout = 60000; // Keep connections alive for 60 seconds

server.listen(config.PORT, () => {
  logger.info(`Server is running on http://localhost:${config.PORT}`);
});
