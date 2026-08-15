import { google } from "googleapis";
import { kv } from "@vercel/kv";

const REFRESH_TOKEN_KEY = "avash:drive:refresh_token";

export function getOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_DRIVE_REDIRECT_URI // e.g. https://your-backend.vercel.app/api/drive/callback
  );
}

export async function saveDriveRefreshToken(refreshToken) {
  await kv.set(REFRESH_TOKEN_KEY, refreshToken);
}

export async function getDriveClient() {
  const refreshToken = await kv.get(REFRESH_TOKEN_KEY);
  if (!refreshToken) {
    throw new Error("Google Drive not connected yet. Visit /api/drive/connect while logged in as admin.");
  }
  const oauth2Client = getOAuthClient();
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return google.drive({ version: "v3", auth: oauth2Client });
}
