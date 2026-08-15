import { verifyGoogleIdToken, isAdminEmail, createSessionCookie, setCors } from "../_lib/auth.js";

export default async function handler(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { idToken } = req.body || {};
  if (!idToken) return res.status(400).json({ error: "Missing idToken" });

  try {
    const profile = await verifyGoogleIdToken(idToken);

    if (!isAdminEmail(profile.email)) {
      // Logged in with Google, but not the admin account.
      // We simply don't grant a session -- this is not an error, just "not admin".
      return res.status(200).json({ isAdmin: false, email: profile.email });
    }

    res.setHeader("Set-Cookie", createSessionCookie(profile.email));
    return res.status(200).json({
      isAdmin: true,
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
    });
  } catch (err) {
    console.error("Login verification failed:", err.message);
    return res.status(401).json({ error: "Invalid Google token" });
  }
}
