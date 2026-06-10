"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");

const INBOX_LIMIT = Number.parseInt(process.env.PRIORITY_LIMIT || "10", 10);
const TYPE_WEIGHTS = {
  placement: 300,
  result: 200,
  event: 100,
};

class FixedTopHeap {
  constructor(limit, compare) {
    this.limit = limit;
    this.compare = compare;
    this.items = [];
  }

  push(candidate) {
    if (this.limit <= 0) {
      return;
    }

    if (this.items.length < this.limit) {
      this.items.push(candidate);
      this.moveUp(this.items.length - 1);
      return;
    }

    if (this.compare(candidate, this.items[0]) > 0) {
      this.items[0] = candidate;
      this.moveDown(0);
    }
  }

  toSortedDescending() {
    return [...this.items].sort((left, right) => this.compare(right, left));
  }

  moveUp(index) {
    let child = index;

    while (child > 0) {
      const parent = Math.floor((child - 1) / 2);

      if (this.compare(this.items[child], this.items[parent]) >= 0) {
        break;
      }

      this.swap(child, parent);
      child = parent;
    }
  }

  moveDown(index) {
    let parent = index;

    while (true) {
      const left = parent * 2 + 1;
      const right = left + 1;
      let smallest = parent;

      if (left < this.items.length && this.compare(this.items[left], this.items[smallest]) < 0) {
        smallest = left;
      }

      if (right < this.items.length && this.compare(this.items[right], this.items[smallest]) < 0) {
        smallest = right;
      }

      if (smallest === parent) {
        return;
      }

      this.swap(parent, smallest);
      parent = smallest;
    }
  }

  swap(left, right) {
    const temp = this.items[left];
    this.items[left] = this.items[right];
    this.items[right] = temp;
  }
}

function normalizeType(rawType) {
  const value = String(rawType || "event").trim().toLowerCase();
  return Object.hasOwn(TYPE_WEIGHTS, value) ? value : "event";
}

function parseCreatedAt(notification) {
  const rawDate =
    notification.createdAt ||
    notification.created_at ||
    notification.Timestamp ||
    notification.timestamp ||
    notification.time ||
    notification.date;

  const parsed = new Date(String(rawDate || "").replace(" ", "T"));
  return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
}

function readTimestamp(notification) {
  return (
    notification.Timestamp ||
    notification.createdAt ||
    notification.created_at ||
    notification.timestamp ||
    notification.time ||
    notification.date ||
    ""
  );
}

function normalizeNotification(notification, fallbackIndex) {
  const type = normalizeType(notification.Type || notification.type || notification.category || notification.kind);
  const createdAt = parseCreatedAt(notification);
  const message =
    notification.Message ||
    notification.message ||
    notification.content ||
    notification.description ||
    "";
  const title = notification.title || notification.heading || message || `Notification ${fallbackIndex + 1}`;

  return {
    id: String(notification.ID || notification.id || notification.notificationId || `generated-${fallbackIndex + 1}`),
    type,
    title: String(title),
    message: String(message),
    createdAt,
    timestampText: String(readTimestamp(notification)),
    original: notification,
  };
}

function scoreNotification(notification, newestTime) {
  const typeScore = TYPE_WEIGHTS[notification.type];
  const ageMinutes = Math.max(0, Math.floor((newestTime - notification.createdAt.getTime()) / 60000));
  const recencyScore = Math.max(0, 100 - Math.min(100, ageMinutes / 30));

  return Number((typeScore + recencyScore).toFixed(2));
}

function compareRank(left, right) {
  if (left.score !== right.score) {
    return left.score - right.score;
  }

  const leftTime = left.createdAt.getTime();
  const rightTime = right.createdAt.getTime();

  if (leftTime !== rightTime) {
    return leftTime - rightTime;
  }

  return right.id.localeCompare(left.id);
}

function findTopNotifications(rawNotifications, limit = INBOX_LIMIT) {
  const normalized = rawNotifications.map(normalizeNotification);
  const newestTime = normalized.reduce(
    (latest, notification) => Math.max(latest, notification.createdAt.getTime()),
    0
  );
  const heap = new FixedTopHeap(limit, compareRank);

  for (const notification of normalized) {
    heap.push({
      ...notification,
      score: scoreNotification(notification, newestTime),
    });
  }

  return heap.toSortedDescending();
}

async function loadNotifications() {
  if (process.env.NOTIFICATION_API_URL) {
    const headers = {};

    if (process.env.NOTIFICATION_API_TOKEN) {
      headers.authorization = `Bearer ${process.env.NOTIFICATION_API_TOKEN}`;
    }

    const response = await fetch(process.env.NOTIFICATION_API_URL, { headers });

    if (!response.ok) {
      throw new Error(`Notification API returned ${response.status} ${response.statusText}`);
    }

    const payload = await response.json();
    return Array.isArray(payload) ? payload : payload.notifications || payload.data || [];
  }

  const filePath = path.join(__dirname, "sample_notifications.json");
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

function printInbox(notifications) {
  console.log(`Priority Inbox - Top ${notifications.length}`);
  console.log("Rank | Score | Type      | Timestamp            | Message");
  console.log("-----|-------|-----------|----------------------|------------------------------");

  notifications.forEach((notification, index) => {
    const rank = String(index + 1).padStart(4, " ");
    const score = notification.score.toFixed(2).padStart(5, " ");
    const type = notification.type.padEnd(9, " ");
    const createdAt = notification.timestampText || notification.createdAt.toISOString().replace(".000Z", "Z");
    console.log(`${rank} | ${score} | ${type} | ${createdAt} | ${notification.message || notification.title}`);
  });
}

async function main() {
  const notifications = await loadNotifications();
  const topNotifications = findTopNotifications(notifications);
  printInbox(topNotifications);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

module.exports = {
  FixedTopHeap,
  findTopNotifications,
  normalizeNotification,
  scoreNotification,
};
