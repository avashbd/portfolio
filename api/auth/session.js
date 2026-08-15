import { getSession, setCors } from "../_lib/auth.js";

export default async function handler(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(200).end();

  const session = getSession(req);
  if (!session) return res.status(200).json({ isAdmin: false });

  return res.status(200).json({ isAdmin: true, email: session.email });
}
