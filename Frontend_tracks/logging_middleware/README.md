# Logging Middleware

Reusable logging middleware for the notification project.

It writes structured JSON logs to:

```text
logging_middleware/logs/application.log
```

Optional environment variables:

```text
LOG_SERVICE_NAME=notification-system
LOG_FILE_PATH=custom-log-file-path
LOG_API_URL=optional-remote-log-endpoint
LOG_API_TOKEN=optional-remote-log-token
```

## Usage

```js
const { createLogger } = require("../logging_middleware/logger");

const logger = createLogger({ serviceName: "notification-app-be" });
await logger.info("notifications.loaded", { count: 10 });
```

The module is original, dependency-free, and shared by the project code.
