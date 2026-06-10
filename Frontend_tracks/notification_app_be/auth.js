"use strict";

const AUTH_URL =
  process.env.NOTIFICATION_AUTH_URL ||
  "http://4.224.186.213/evaluation-service/auth";

async function getAuthorizationToken() {
  const credentials = readCredentials();

  if (credentials) {
    const response = await fetch(AUTH_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error(`Auth API returned ${response.status} ${response.statusText}`);
    }

    const payload = await response.json();
    return payload.access_token || payload.accessToken || payload.token || "";
  }

  return process.env.NOTIFICATION_API_TOKEN || "";
}

function readCredentials() {
  const credentials = {
    email: process.env.REGISTERED_EMAIL,
    name: process.env.REGISTERED_NAME,
    rollNo: process.env.REGISTERED_ROLL_NO,
    accessCode: process.env.REGISTERED_ACCESS_CODE,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  };

  if (Object.values(credentials).some((value) => !value)) {
    return null;
  }

  return credentials;
}

module.exports = {
  getAuthorizationToken,
};
