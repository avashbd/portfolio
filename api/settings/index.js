import { requireAdmin, setCors } from "../_lib/auth.js";
import { getSettings, saveSettings } from "../_lib/db.js";

export default async function handler(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    // Public - the site's name, photo, contact info, socials, stats.
    const settings = await getSettings();
    return res.status(200).json({ settings });
  }

  if (req.method === "PUT") {
    const session = requireAdmin(req, res);
    if (!session) return;

    const updated = await saveSettings(req.body || {});
    return res.status(200).json({ settings: updated });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
