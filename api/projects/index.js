import { requireAdmin, setCors } from "../_lib/auth.js";
import { listProjects, saveProject } from "../_lib/db.js";
import { randomUUID } from "crypto";

export default async function handler(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    // Public - anyone visiting the site can see the project list.
    const segment = req.query.segment; // optional filter: "3d" | "arch" | "structural"
    const projects = await listProjects();
    const filtered = segment ? projects.filter((p) => p.segment === segment) : projects;
    return res.status(200).json({ projects: filtered });
  }

  if (req.method === "POST") {
    const session = requireAdmin(req, res);
    if (!session) return; // requireAdmin already sent 401

    const { title, description, segment, year, tags, images, pdfUrl, driveFileId, featured } = req.body || {};
    if (!title || !segment) {
      return res.status(400).json({ error: "title and segment are required" });
    }

    const project = {
      id: randomUUID(),
      title,
      description: description || "",
      segment, // "3d" | "other" (structural design, architectural drafting, misc)
      year: year || new Date().getFullYear().toString(),
      tags: tags || [],
      images: images || [], // array of Google Drive file URLs/ids
      pdfUrl: pdfUrl || null,
      driveFileId: driveFileId || null,
      featured: !!featured, // shows in homepage slideshow
      createdAt: Date.now(),
    };

    await saveProject(project);
    return res.status(201).json({ project });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
