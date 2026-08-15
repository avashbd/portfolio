import { requireAdmin, setCors } from "../_lib/auth.js";
import { getOAuthClient } from "../_lib/drive.js";

const SCOPES = ["https://www.googleapis.com/auth/drive.readonly"];

export default async function handler(req, res) {
  setCors(req, res);
  const session = requireAdmin(req, res);
  if (!session) return;

  const oauth2Client = getOAuthClient();
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline", // needed to get a refresh_token
    prompt: "consent", // force consent so we always get a refresh_token, even on repeat logins
    scope: SCOPES,
  });

  res.writeHead(302, { Location: url });
  res.end();
}
