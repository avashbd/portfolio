import { kv } from "@vercel/kv";

const INDEX_KEY = "avash:projects:index"; // set of project ids
const projectKey = (id) => `avash:project:${id}`;

export async function listProjects() {
  const ids = (await kv.smembers(INDEX_KEY)) || [];
  if (ids.length === 0) return [];
  const projects = await Promise.all(ids.map((id) => kv.get(projectKey(id))));
  return projects
    .filter(Boolean)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

export async function getProject(id) {
  return kv.get(projectKey(id));
}

export async function saveProject(project) {
  await kv.set(projectKey(project.id), project);
  await kv.sadd(INDEX_KEY, project.id);
  return project;
}

export async function deleteProject(id) {
  await kv.del(projectKey(id));
  await kv.srem(INDEX_KEY, id);
}

const SETTINGS_KEY = "avash:settings";

const DEFAULT_SETTINGS = {
  name: "Avash",
  tagline:
    "Structural engineer & 3D visualizer from Dhaka. I design structures under BNBC 2020 & ACI, then visualize them so you can see them before they're built.",
  profilePhoto: null, // Drive image URL, transparent PNG cutout recommended
  phone: "",
  email: "hello@archvizbyavash.com",
  socials: { facebook: "", linkedin: "", instagram: "", github: "", dribbble: "" },
  stats: { projectsCount: "170+", rating: "4.8", ratingsCount: "" },
  marqueeText: "ETABS MODELING * 3D VISUALIZATION * BNBC COMPLIANCE * ARCHITECTURAL DESIGN * AUTOCAD DRAFTING",
};

export async function getSettings() {
  const saved = await kv.get(SETTINGS_KEY);
  return { ...DEFAULT_SETTINGS, ...(saved || {}) };
}

export async function saveSettings(patch) {
  const current = await getSettings();
  const updated = { ...current, ...patch };
  await kv.set(SETTINGS_KEY, updated);
  return updated;
}
