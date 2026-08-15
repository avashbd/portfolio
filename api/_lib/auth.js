import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { parse, serialize } from "cookie";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "").toLowerCase();
const SESSION_SECRET = process.env.SESSION_SECRET; // long random string
const SESSION_COOKIE = "avash_session";

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Verify the One Tap / Sign-In With Google ID token sent from the frontend.
// Returns { email, name, picture } if valid, throws otherwise.
export async function verifyGoogleIdToken(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload || !payload.email_verified) {
    throw new Error("Google account email not verified");
  }
  return {
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
  };
}

export function isAdminEmail(email) {
  return !!email && email.toLowerCase() === ADMIN_EMAIL;
}

// Issue our own short-lived session cookie once we've confirmed the Google
// account matches ADMIN_EMAIL. Frontend never needs to know the JWT secret.
export function createSessionCookie(email) {
  const token = jwt.sign({ email, role: "admin" }, SESSION_SECRET, {
    expiresIn: "12h",
  });
  return serialize(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "none", // frontend (GitHub Pages) and backend (Vercel) are different domains
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export function clearSessionCookie() {
  return serialize(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 0,
  });
}

// Use inside any API route that should be admin-only.
// Returns the decoded session ({ email, role }) or null.
export function getSession(req) {
  const cookies = parse(req.headers.cookie || "");
  const token = cookies[SESSION_COOKIE];
  if (!token) return null;
  try {
    return jwt.verify(token, SESSION_SECRET);
  } catch {
    return null;
  }
}

export function requireAdmin(req, res) {
  const session = getSession(req);
  if (!session || session.role !== "admin") {
    res.status(401).json({ error: "Not authenticated" });
    return null;
  }
  return session;
}

// Shared CORS headers so the GitHub Pages frontend can call this API
// with credentials (cookies) included.
export function setCors(req, res) {
  const allowedOrigin = process.env.FRONTEND_ORIGIN || "*";
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}
