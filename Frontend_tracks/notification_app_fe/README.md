
# Stage 2 Notification Frontend

Responsive Next + Material UI frontend for all notifications and priority notifications.

## Setup

```powershell
cd notification_app_fe
npm install
```

Create `.env.local`:

```text
NOTIFICATION_API_URL=http://4.224.186.213/evaluation-service/notifications
NOTIFICATION_AUTH_URL=http://4.224.186.213/evaluation-service/auth
REGISTERED_EMAIL=your-email
REGISTERED_NAME=your-name
REGISTERED_ROLL_NO=your-roll-number
REGISTERED_ACCESS_CODE=your-access-code
CLIENT_ID=your-client-id
CLIENT_SECRET=your-client-secret
```

You can copy the placeholder format from `.env.example`. The live notification API requires `limit` to be at least `5`; the app enforces that before calling the server.

If you already generated a bearer token, you can use only this instead of the registration fields:

```text
NOTIFICATION_API_TOKEN=your-bearer-token
```

## Run

```powershell
npm run dev
```

The application runs on:

```text
http://localhost:3000
```

## Pages

- `/` - all notifications with type filter, pagination, and viewed/new state.
- `/priority` - top priority notifications with configurable top-n and type filter.
