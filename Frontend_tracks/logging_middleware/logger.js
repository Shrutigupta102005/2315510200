"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");

const DEFAULT_LOG_FILE = path.join(__dirname, "logs", "application.log");

function createLogger(options = {}) {
  const serviceName = options.serviceName || process.env.LOG_SERVICE_NAME || "notification-system";
  const logFile = options.logFile || process.env.LOG_FILE_PATH || DEFAULT_LOG_FILE;
  const remoteUrl = options.remoteUrl || process.env.LOG_API_URL || "";
  const authToken = options.authToken || process.env.LOG_API_TOKEN || "";

  async function write(level, event, details = {}) {
    const entry = {
      level,
      event,
      service: serviceName,
      timestamp: new Date().toISOString(),
      details,
    };

    await appendToFile(logFile, entry);

    if (remoteUrl) {
      await sendRemote(remoteUrl, authToken, entry);
    }

    return entry;
  }

  return {
    info: (event, details) => write("info", event, details),
    warn: (event, details) => write("warn", event, details),
    error: (event, details) => write("error", event, details),
  };
}

function requestLogger(logger) {
  return async function logRequest(request, handler) {
    const startedAt = Date.now();
    const method = request.method || "GET";
    const url = request.url || "";

    try {
      const result = await handler();
      await logger.info("request.completed", {
        method,
        url,
        durationMs: Date.now() - startedAt,
      });
      return result;
    } catch (error) {
      await logger.error("request.failed", {
        method,
        url,
        durationMs: Date.now() - startedAt,
        message: error.message,
      });
      throw error;
    }
  };
}

async function appendToFile(filePath, entry) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.appendFile(filePath, `${JSON.stringify(entry)}\n`, "utf8");
}

async function sendRemote(remoteUrl, authToken, entry) {
  const headers = {
    "content-type": "application/json",
  };

  if (authToken) {
    headers.authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(remoteUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(entry),
  });

  if (!response.ok) {
    throw new Error(`Remote logger returned ${response.status}`);
  }
}

module.exports = {
  createLogger,
  requestLogger,
};
