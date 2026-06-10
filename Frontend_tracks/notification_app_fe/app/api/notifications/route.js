import { NextResponse } from "next/server";
import { sampleNotifications } from "@/lib/sampleNotifications";
import { getAuthorizationToken } from "@/lib/serverAuth";

const API_URL =
  process.env.NOTIFICATION_API_URL ||
  "http://4.224.186.213/evaluation-service/notifications";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const upstream = new URL(API_URL);

  const limit = clampNumber(searchParams.get("limit"), 5, 50);
  const page = clampNumber(searchParams.get("page"), 1, 999);
  const type = searchParams.get("notification_type");

  upstream.searchParams.set("limit", String(limit));
  upstream.searchParams.set("page", String(page));

  if (type && type !== "all") {
    upstream.searchParams.set("notification_type", type);
  }

  try {
    const headers = {};
    const token = await getAuthorizationToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(upstream, {
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Notification API returned ${response.status}`);
    }

    const payload = await response.json();
    return NextResponse.json({
      source: "api",
      notifications: Array.isArray(payload) ? payload : payload.notifications || payload.data || [],
    });
  } catch (error) {
    const filtered = filterSampleNotifications(sampleNotifications, searchParams);
    return NextResponse.json(
      {
        source: "sample",
        warning: error.message,
        notifications: paginate(filtered, searchParams),
      },
      { status: 200 }
    );
  }
}

function filterSampleNotifications(notifications, searchParams) {
  const type = searchParams.get("notification_type");

  if (!type || type === "all") {
    return notifications;
  }

  return notifications.filter((notification) => {
    return String(notification.Type).toLowerCase() === type.toLowerCase();
  });
}

function paginate(notifications, searchParams) {
  const safeLimit = clampNumber(searchParams.get("limit"), 5, 50);
  const safePage = clampNumber(searchParams.get("page"), 1, 999);
  const start = (safePage - 1) * safeLimit;

  return notifications.slice(start, start + safeLimit);
}

function clampNumber(value, min, max) {
  const parsed = Number.parseInt(value || min, 10);
  return Math.min(max, Math.max(min, Number.isFinite(parsed) ? parsed : min));
}
