import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Pencil, LogOut, FolderSync, Check } from "lucide-react";
import { api } from "../lib/api.js";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SEGMENTS = [
  { id: "3d", label: "3D Visualization" },
  { id: "other", label: "Structural & Other Work" },
];

const EMPTY_FORM = { title: "", description: "", segment: "3d", year: "", tags: "", images: "", pdfUrl: "", featured: false };

function GoogleLoginButton({ onToken }) {
  const btnRef = useRef(null);

  useEffect(() => {
    if (!window.google || !GOOGLE_CLIENT_ID) return;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => onToken(response.credential),
    });
    window.google.accounts.id.renderButton(btnRef.current, {
      theme: "filled_black",
      size: "large",
      shape: "pill",
    });
  }, [onToken]);

  return <div ref={btnRef} />;
}

export default function AdminPanel() {
  const [session, setSession] = useState(null);
  const [notAdminEmail, setNotAdminEmail] = useState(null);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [driveFiles, setDriveFiles] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [status, setStatus] = useState("");
  const [settingsForm, setSettingsForm] = useState(null);
  const [pickingProfilePhoto, setPickingProfilePhoto] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    api.session().then(setSession).catch(() => setSession({ isAdmin: false }));
  }, []);

  useEffect(() => {
    if (session?.isAdmin) {
      refreshProjects();
      api.getSettings().then((d) => setSettingsForm({
        ...d.settings,
        defaultTheme: d.settings?.defaultTheme || "dark" // ডিফল্ট থিম হ্যান্ডেল করার জন্য
      }));
    }
  }, [session]);

  function refreshProjects() {
    api.listProjects().then((d) => setProjects(d.projects || []));
  }

  async function handleGoogleToken(idToken) {
    const result = await api.loginWithGoogle(idToken);
    if (result.isAdmin) {
      setSession({ isAdmin: true, email: result.email });
    } else {
      setNotAdminEmail(result.email);
    }
  }

  async function handleLogout() {
    await api.logout();
    setSession({ isAdmin: false });
  }

  function loadDriveFiles() {
    setStatus("Loading Drive files…");
    api
      .listDriveFiles()
      .then((d) => {
        setDriveFiles(d.files || []);
        setStatus("");
      })
      .catch((err) => setStatus("Drive error: " + err.message));
  }

  function toggleImage(file) {
    const url = file.thumbnailLink
      ? file.thumbnailLink.replace(/=s\d+$/, "=s1600")
      : file.webContentLink || file.webViewLink;
    setSelectedImages((prev) => (prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      images: selectedImages.length ? selectedImages : form.images.split(",").map((s) => s.trim()).filter(Boolean),
    };
    if (editingId) {
      await api.updateProject(editingId, payload);
    } else {
      await api.createProject(payload);
    }
    setForm(EMPTY_FORM);
    setSelectedImages([]);
    setEditingId(null);
    refreshProjects();
  }

  function startEdit(p) {
    setEditingId(p.id);
    setForm({
      title: p.title,
      description: p.description,
      segment: p.segment,
      year: p.year,
      tags: (p.tags || []).join(", "),
      images: (p.images || []).join(", "),
      pdfUrl: p.pdfUrl || "",
      featured: !!p.featured,
    });
    setSelectedImages(p.images || []);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    await api.deleteProject(id);
    refreshProjects();
  }

  async function handleSaveSettings(e) {
    e.preventDefault();
    const updated = await api.updateSettings(settingsForm);
    setSettingsForm(updated.settings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  }

  function pickProfilePhoto(file) {
    const url = file.thumbnailLink
      ? file.thumbnailLink.replace(/=s\d+$/, "=s1600")
      : file.webContentLink || file.webViewLink;
    setSettingsForm({ ...settingsForm, profilePhoto: url });
    setPickingProfilePhoto(false);
  }

  if (!session) return <div style={{ color: "#eef0f4", background: "#0a0b0f", minHeight: "100vh" }} className="p-8">Loading…</div>;

  if (!session.isAdmin) {
    return (
      <div style={{ color: "#eef0f4", background: "#0a0b0f", minHeight: "100vh" }} className="flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <h1 className="text-xl mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Admin Login</h1>
          <GoogleLoginButton onToken={handleGoogleToken} />
          {notAdminEmail && (
            <p className="text-sm mt-4" style={{ color: "#e07a3f" }}>
              {notAdminEmail} is not the admin account.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ color: "#eef0f4", background: "#0a0b0f", minHeight: "100vh" }} className="p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Admin Panel</h1>
          <div className="flex items-center gap-3 text-sm" style={{ color: "#8b8f9c" }}>
            <span>{session.email}</span>
            <button onClick={handleLogout} className="flex items-center gap-1 hover:text-white">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>

        {/* Profile settings */}
        {settingsForm && (
          <form onSubmit={handleSaveSettings} className="mb-8 p-5 rounded-xl border grid grid-cols-1 md:grid-cols-2 gap-4" style={{ borderColor: "#232733" }}>
            <p className="text-sm font-medium md:col-span-2" style={{ color: "#8b8f9c" }}>Profile Settings & Default Theme</p>
            <input
              placeholder="Your name"
              value={settingsForm.name || ""}
              onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
              className="bg-transparent border rounded-lg px-3 py-2 text-sm"
              style={{ borderColor: "#2a2f3d" }}
            />
            <input
              placeholder="Phone"
              value={settingsForm.phone || ""}
              onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
              className="bg-transparent border rounded-lg px-3 py-2 text-sm"
              style={{ borderColor: "#2a2f3d" }}
            />
            <textarea
              placeholder="Tagline / short bio"
              value={settingsForm.tagline || ""}
              onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
              className="bg-transparent border rounded-lg px-3 py-2 text-sm md:col-span-2"
              rows={2}
              style={{ borderColor: "#2a2f3d" }}
            />
            <input
              placeholder="Contact email"
              value={settingsForm.email || ""}
              onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
              className="bg-transparent border rounded-lg px-3 py-2 text-sm md:col-span-2"
              style={{ borderColor: "#2a2f3d" }}
            />
            <input
              placeholder="Projects count (e.g. 170+)"
              value={settingsForm.stats?.projectsCount || ""}
              onChange={(e) => setSettingsForm({ ...settingsForm, stats: { ...settingsForm.stats, projectsCount: e.target.value } })}
              className="bg-transparent border rounded-lg px-3 py-2 text-sm"
              style={{ borderColor: "#2a2f3d" }}
            />
            
            {/* ডিফল্ট থিম সিলেক্ট করার অপশন */}
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: "#8b8f9c" }}>Default Theme for Website:</label>
              <select
                value={settingsForm.defaultTheme || "dark"}
                onChange={(e) => setSettingsForm({ ...settingsForm, defaultTheme: e.target.value })}
                className="bg-transparent border rounded-lg px-3 py-2 text-sm"
                style={{ borderColor: "#2a2f3d" }}
              >
                <option value="dark" style={{ background: "#14161d" }}>Dark Theme</option>
                <option value="light" style={{ background: "#14161d" }}>Light Theme</option>
              </select>
            </div>

            <input
              placeholder="Marquee text"
              value={settingsForm.marqueeText || ""}
              onChange={(e) => setSettingsForm({ ...settingsForm, marqueeText: e.target.value })}
              className="bg-transparent border rounded-lg px-3 py-2 text-sm md:col-span-2"
              style={{ borderColor: "#2a2f3d" }}
            />
            {["facebook", "linkedin", "instagram", "github", "dribbble"].map((key) => (
              <input
                key={key}
                placeholder={`${key[0].toUpperCase() + key.slice(1)} URL`}
                value={settingsForm.socials?.[key] || ""}
                onChange={(e) => setSettingsForm({ ...settingsForm, socials: { ...settingsForm.socials, [key]: e.target.value } })}
                className="bg-transparent border rounded-lg px-3 py-2 text-sm"
                style={{ borderColor: "#2a2f3d" }}
              />
            ))}

            <div className="md:col-span-2 flex items-center gap-3">
              {settingsForm.profilePhoto && (
                <img src={settingsForm.profilePhoto} alt="Profile" className="h-14 rounded-lg border" style={{ borderColor: "#2a2f3d" }} />
              )}
              <button
                type="button"
                onClick={() => { setPickingProfilePhoto(true); loadDriveFiles(); }}
                className="text-xs px-3 py-1.5 rounded-full border hover:bg-white hover:text-black transition-colors"
                style={{ borderColor: "#2a2f3d" }}
              >
                Pick profile photo from Drive
              </button>
            </div>

            <div className="md:col-span-2 flex items-center gap-3">
              <button type="submit" className="px-4 py-2 text-sm rounded-full" style={{ background: "#6b21a8", color: "#fff", fontWeight: 600 }}>
                Save profile settings
              </button>
              {settingsSaved && <span className="text-xs" style={{ color: "#6b21a8" }}>Saved ✓</span>}
            </div>
          </form>
        )}

        {/* Drive connect */}
        <div className="mb-8 p-4 rounded-xl border flex items-center justify-between" style={{ borderColor: "#232733" }}>
          <div>
            <p className="text-sm font-medium">Google Drive</p>
            <p className="text-xs" style={{ color: "#5a5f6e" }}>Connect once so you can pick images/PDFs from your Drive.</p>
          </div>
          <div className="flex gap-2">
            <a
              href={api.connectDriveUrl()}
              className="text-xs px-3 py-1.5 rounded-full border hover:bg-white hover:text-black transition-colors"
              style={{ borderColor: "#2a2f3d" }}
            >
              Connect / Reconnect
            </a>
            <button
              onClick={() => { setPickingProfilePhoto(false); loadDriveFiles(); }}
              className="text-xs px-3 py-1.5 rounded-full border flex items-center gap-1 hover:bg-white hover:text-black transition-colors"
              style={{ borderColor: "#2a2f3d" }}
            >
              <FolderSync size={12} /> Load files
            </button>
          </div>
        </div>

        {status && <p className="text-xs mb-4" style={{ color: "#e07a3f" }}>{status}</p>}

        {driveFiles.length > 0 && (
          <div className="mb-8">
            <p className="text-xs mb-2" style={{ color: "#8b8f9c" }}>
              {pickingProfilePhoto ? "Tap to set as your profile photo:" : "Tap to select images/PDFs for the project below:"}
            </p>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {driveFiles.map((f) => {
                const url = f.thumbnailLink
                  ? f.thumbnailLink.replace(/=s\d+$/, "=s1600")
                  : f.webContentLink || f.webViewLink;
                const selected = pickingProfilePhoto ? settingsForm?.profilePhoto === url : selectedImages.includes(url);
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => (pickingProfilePhoto ? pickProfilePhoto(f) : toggleImage(f))}
                    className="relative rounded-lg overflow-hidden border aspect-square flex items-center justify-center text-[10px] p-1 text-center"
                    style={{ borderColor: selected ? "#e07a3f" : "#232733", background: "#14161d" }}
                  >
                    {f.thumbnailLink ? (
                      <img src={f.thumbnailLink} alt={f.name} className="w-full h-full object-cover" />
                    ) : (
                      <span style={{ color: "#5a5f6e" }}>{f.name}</span>
                    )}
                    {selected && (
                      <span className="absolute top-1 right-1 rounded-full p-0.5" style={{ background: "#e07a3f" }}>
                        <Check size={10} color="#0a0b0f" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Project form */}
        <form onSubmit={handleSubmit} className="mb-10 p-5 rounded-xl border grid grid-cols-1 md:grid-cols-2 gap-4" style={{ borderColor: "#232733" }}>
          <input
            required
            placeholder="Project title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="bg-transparent border rounded-lg px-3 py-2 text-sm md:col-span-2"
            style={{ borderColor: "#2a2f3d" }}
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="bg-transparent border rounded-lg px-3 py-2 text-sm md:col-span-2"
            style={{ borderColor: "#2a2f3d" }}
            rows={3}
          />
          <select
            value={form.segment}
            onChange={(e) => setForm({ ...form, segment: e.target.value })}
            className="bg-transparent border rounded-lg px-3 py-2 text-sm"
            style={{ borderColor: "#2a2f3d" }}
          >
            {SEGMENTS.map((s) => (
              <option key={s.id} value={s.id} style={{ background: "#14161d" }}>{s.label}</option>
            ))}
          </select>
          <input
            placeholder="Year (e.g. 2026)"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
            className="bg-transparent border rounded-lg px-3 py-2 text-sm"
            style={{ borderColor: "#2a2f3d" }}
          />
          <input
            placeholder="Tags, comma separated (e.g. Lumion, 3ds Max)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="bg-transparent border rounded-lg px-3 py-2 text-sm md:col-span-2"
            style={{ borderColor: "#2a2f3d" }}
          />
          <input
            placeholder="Or paste image URLs, comma separated (if not using Drive picker above)"
            value={form.images}
            onChange={(e) => setForm({ ...form, images: e.target.value })}
            className="bg-transparent border rounded-lg px-3 py-2 text-sm md:col-span-2"
            style={{ borderColor: "#2a2f3d" }}
          />
          <input
            placeholder="PDF URL (optional)"
            value={form.pdfUrl}
            onChange={(e) => setForm({ ...form, pdfUrl: e.target.value })}
            className="bg-transparent border rounded-lg px-3 py-2 text-sm md:col-span-2"
            style={{ borderColor: "#2a2f3d" }}
          />
          <label className="flex items-center gap-2 text-sm md:col-span-2" style={{ color: "#8b8f9c" }}>
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            Show in homepage slideshow (featured)
          </label>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="px-4 py-2 text-sm rounded-full flex items-center gap-1.5" style={{ background: "#e07a3f", color: "#0a0b0f", fontWeight: 600 }}>
              <Plus size={14} /> {editingId ? "Update project" : "Add project"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => { setEditingId(null); setForm(EMPTY_FORM); setSelectedImages([]); }}
                className="px-4 py-2 text-sm rounded-full border"
                style={{ borderColor: "#2a2f3d" }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Project list */}
        <div className="space-y-3">
          {projects.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-4 rounded-xl border" style={{ borderColor: "#232733" }}>
              <div>
                <p className="text-sm font-medium">{p.title}</p>
                <p className="text-xs" style={{ color: "#5a5f6e" }}>
                  {SEGMENTS.find((s) => s.id === p.segment)?.label} · {p.year} {p.featured ? "· Featured" : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(p)} className="p-2 rounded-full border hover:bg-white hover:text-black" style={{ borderColor: "#2a2f3d" }}>
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(p.id)} className="p-2 rounded-full border hover:bg-white hover:text-black" style={{ borderColor: "#2a2f3d" }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
