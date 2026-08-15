import { getOAuthClient, saveDriveRefreshToken } from "../_lib/drive.js";
import { setCors } from "../_lib/auth.js";

export default async function handler(req, res) {
  setCors(req, res);
  const { code } = req.query;
  if (!code) return res.status(400).send("Missing code from Google redirect");

  try {
    const oauth2Client = getOAuthClient();
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.refresh_token) {
      // Happens if the admin already granted consent before and Google skipped
      // showing the refresh_token again. Re-run /api/drive/connect - it forces
      // prompt=consent so this should not normally happen.
      return res
        .status(400)
        .send("No refresh token returned. Revoke app access in your Google Account and try /api/drive/connect again.");
    }

    await saveDriveRefreshToken(tokens.refresh_token);

    const adminPanelUrl = process.env.FRONTEND_ORIGIN
      ? `${process.env.FRONTEND_ORIGIN}/admin?drive=connected`
      : "/";
    res.writeHead(302, { Location: adminPanelUrl });
    res.end();
  } catch (err) {
    console.error("Drive OAuth callback failed:", err.message);
    res.status(500).send("Failed to connect Google Drive: " + err.message);
  }
}
