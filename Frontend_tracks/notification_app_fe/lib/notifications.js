const TYPE_WEIGHTS = {
  placement: 300,
  result: 200,
  event: 100,
};

export const notificationTypes = ["all", "Placement", "Result", "Event"];

export function normalizeNotification(notification, index = 0) {
  const message =
    notification.Message ||
    notification.message ||
    notification.content ||
    notification.description ||
    "";
  const timestamp =
    notification.Timestamp ||
    notification.createdAt ||
    notification.created_at ||
    notification.timestamp ||
    notification.time ||
    "";

  return {
    id: String(notification.ID || notification.id || notification.notificationId || `notification-${index}`),
    type: normalizeType(notification.Type || notification.type || notification.category),
    message: String(message),
    timestamp: String(timestamp),
    createdAt: parseTimestamp(timestamp),
  };
}

export function rankNotifications(notifications, limit) {
  const normalized = notifications.map(normalizeNotification);
  const newestTime = normalized.reduce((latest, item) => {
    return Math.max(latest, item.createdAt.getTime());
  }, 0);

  return normalized
    .map((item) => ({
      ...item,
      score: scoreNotification(item, newestTime),
    }))
    .sort(comparePriority)
    .slice(0, limit);
}

export function scoreNotification(notification, newestTime) {
  const typeScore = TYPE_WEIGHTS[notification.type.toLowerCase()] || TYPE_WEIGHTS.event;
  const ageMinutes = Math.max(0, Math.floor((newestTime - notification.createdAt.getTime()) / 60000));
  const recencyScore = Math.max(0, 100 - Math.min(100, ageMinutes / 30));

  return Number((typeScore + recencyScore).toFixed(2));
}

export function getTypeColor(type) {
  const value = type.toLowerCase();

  if (value === "placement") {
    return "success";
  }

  if (value === "result") {
    return "primary";
  }

  return "warning";
}

function comparePriority(left, right) {
  if (right.score !== left.score) {
    return right.score - left.score;
  }

  return right.createdAt.getTime() - left.createdAt.getTime();
}

function normalizeType(type) {
  const value = String(type || "Event").trim().toLowerCase();

  if (value === "placement") {
    return "Placement";
  }

  if (value === "result") {
    return "Result";
  }

  return "Event";
}

function parseTimestamp(timestamp) {
  const parsed = new Date(String(timestamp || "").replace(" ", "T"));
  return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
}
