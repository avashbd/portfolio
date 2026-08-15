import { requireAdmin, setCors } from "../_lib/auth.js";
import { getProject, saveProject, deleteProject } from "../_lib/db.js";

export default async function handler(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(200).end();

  const { id } = req.query;

  if (req.method === "GET") {
    const project = await getProject(id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    return res.status(200).json({ project });
  }

  if (req.method === "PUT") {
    const session = requireAdmin(req, res);
    if (!session) return;

    const existing = await getProject(id);
    if (!existing) return res.status(404).json({ error: "Project not found" });

    const updated = { ...existing, ...req.body, id, updatedAt: Date.now() };
    await saveProject(updated);
    return res.status(200).json({ project: updated });
  }

  if (req.method === "DELETE") {
    const session = requireAdmin(req, res);
    if (!session) return;

    await deleteProject(id);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
