import { requireAdmin, setCors } from "../_lib/auth.js";
import { getDriveClient } from "../_lib/drive.js";

export default async function handler(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(200).end();

  const session = requireAdmin(req, res);
  if (!session) return;

  const folderId = req.query.folderId || process.env.DRIVE_FOLDER_ID;
  if (!folderId) {
    return res.status(400).json({ error: "No folderId provided and DRIVE_FOLDER_ID env var not set" });
  }

  try {
    const drive = await getDriveClient();
    const result = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: "files(id, name, mimeType, thumbnailLink, webViewLink, webContentLink)",
      pageSize: 100,
    });

    return res.status(200).json({ files: result.data.files || [] });
  } catch (err) {
    console.error("Drive list failed:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
