# Notification Priority Inbox

Original Stage 1 implementation for selecting the top priority campus notifications.

## Run with sample data

```powershell
node notification_app_be/priority_inbox.js
```

## Run with the notification API

```powershell
$env:NOTIFICATION_API_URL="http://4.224.186.213/evaluation-service/notifications"
$env:NOTIFICATION_AUTH_URL="http://4.224.186.213/evaluation-service/auth"
$env:REGISTERED_EMAIL="your-email"
$env:REGISTERED_NAME="your-name"
$env:REGISTERED_ROLL_NO="your-roll-number"
$env:REGISTERED_ACCESS_CODE="your-access-code"
$env:CLIENT_ID="your-client-id"
$env:CLIENT_SECRET="your-client-secret"
node notification_app_be/priority_inbox.js
```

The API is protected. The script can request the bearer token from the auth API using the registration details above. If you already generated a bearer token, set `NOTIFICATION_API_TOKEN` instead.

The API response can be either an array of notifications or an object containing `notifications` or `data`. The script supports the provided field names: `ID`, `Type`, `Message`, and `Timestamp`.

## Ranking

Priority is calculated from notification type and recency:

- placement: highest weight
- result: medium weight
- event: base weight

The script keeps the best 10 notifications with a bounded min-heap, so it does not need to repeatedly sort all notifications as new items arrive.
