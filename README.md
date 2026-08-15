# ArchViz by Avash — Portfolio (Frontend + Backend)

> **Update:** Frontend theme ekhon "Structure / Visualized" version (purple strip, bold Anton typography, live BD clock, marquee) — same backend/architecture, notun UI. Admin panel theke Profile Settings (name, photo, tagline, phone, socials, stats) edit kora jay.

Structure:
- `frontend/` → React (Vite). GitHub Pages e deploy hobe.
- `api/` + root `package.json` → Vercel serverless functions (backend). Vercel e deploy hobe.

Full site kaj korte 3 ta jinis lagbe: **Google Cloud OAuth**, **Vercel KV (database)**, **Google Drive folder**.

---

## Step 1 — Google Cloud Console (OAuth setup)

1. https://console.cloud.google.com e jan, notun project banan (e.g. "Avash Portfolio").
2. **APIs & Services > Library** e jan, "Google Drive API" search kore **Enable** korun.
3. **APIs & Services > OAuth consent screen**:
   - User type: **External**
   - App name, support email diye save korun.
   - Test users e apnar Gmail add korun (jotokkhon app "in production" na hocche).
4. **APIs & Services > Credentials > Create Credentials > OAuth client ID**:
   - Application type: **Web application**
   - Authorized JavaScript origins: `https://yourusername.github.io`
   - Authorized redirect URIs: `https://your-backend.vercel.app/api/drive/callback`
   - Create korle **Client ID** ar **Client Secret** paben — eta copy kore rakhun, pore lagbe.

---

## Step 2 — GitHub Repository

1. Notun GitHub repo banan (e.g. `avash-portfolio`).
2. Ei pura folder (`frontend/`, `api/`, `package.json`, `.github/`) repo te push korun.
3. `frontend/vite.config.js` e `base: "/avash-portfolio/"` — apnar repo naam onujayi change korun. (Jodi repo naam `yourusername.github.io` hoy, tahole `base: "/"` korun.)

---

## Step 3 — Backend Deploy (Vercel)

1. https://vercel.com e jan, GitHub repo import korun.
2. **Root Directory** hishebe root e `/` rakhun (api folder root e ache), ba jodi Vercel confuse hoy, "Root Directory" hishebe repo root select korun.
3. **Storage tab > Create Database > KV (Upstash Redis)** — connect korun ei project e. Vercel automatic env variables set kore dibe (`KV_REST_API_URL` etc).
4. **Settings > Environment Variables** e `.env.example` (root er) file dekhe shob variable add korun:
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_DRIVE_REDIRECT_URI`
   - `ADMIN_EMAIL` — apnar Gmail (eta diyei admin panel e login korte parben)
   - `SESSION_SECRET` — random string (terminal e `openssl rand -hex 32` diye generate korte paren)
   - `FRONTEND_ORIGIN` — apnar GitHub Pages URL
   - `DRIVE_FOLDER_ID` — (Step 5 e bola ache)
5. Deploy korun. Deploy hoye gele URL paben, e.g. `https://avash-portfolio-api.vercel.app` — eta copy rakhun.
6. `GOOGLE_DRIVE_REDIRECT_URI` env variable ta ei URL diye update korun (`.../api/drive/callback`), ar Google Cloud Console er redirect URI o same rakhun.

---

## Step 4 — Frontend Deploy (GitHub Pages)

1. Repo te **Settings > Secrets and variables > Actions** e giye 2 ta secret add korun:
   - `VITE_API_BASE` = apnar Vercel backend URL (Step 3.5)
   - `VITE_GOOGLE_CLIENT_ID` = Step 1 er Client ID
2. Repo te kono push korle (`main` branch e), GitHub Action automatic build kore **GitHub Pages** e deploy kore dibe. (Settings > Pages e "gh-pages" branch select korte hote pare first time.)
3. Apnar site live hobe: `https://yourusername.github.io/avash-portfolio/`

---

## Step 5 — Google Drive folder setup

1. Google Drive e ekta folder banan (e.g. "Avash Portfolio Assets"), shob project image/PDF ekhane rakhben.
2. Folder open kore URL theke ID copy korun: `drive.google.com/drive/folders/`**`THIS_PART`**
3. Eta Vercel er `DRIVE_FOLDER_ID` env variable e boshan.
4. **Important**: Drive er file gula "Anyone with the link can view" kore share korte hobe, tahole website e image dekha jabe (kaeno na website public visitor der jonno, tader Google login nai).

---

## Step 6 — First login (Admin)

1. `https://yourusername.github.io/avash-portfolio/admin` e jan (eta kothao link kora nai, direct URL diye jete hobe — eta e apnar "hidden" login).
2. Google diye login korun (`ADMIN_EMAIL` e ja disen, shei account diye).
3. Login hoye gele, **"Connect / Reconnect"** button e click kore Google Drive access dite hobe (ekbar-i lagbe).
4. **"Load files"** button e click korle apnar Drive folder er shob file dekhabe — shekhan theke select kore project banate parben.

---

## Daily use (apni ki korben)

- Project add: Admin panel e form fill up kore "Add project" — image Drive theke select korun, segment (3D / Architecture / Structural) select korun, "Featured" tik dile homepage slideshow e dekhabe.
- Project edit/delete: list theke pencil/trash icon.
- Language: public site e "English / বাংলা" toggle already ache.

---

## Note

- `.env` file kokhono GitHub e push korben na (`.gitignore` e already ache).
- Admin route (`/admin`) kono public nav e link kora nai, kintu URL janle jekeu login screen dekhbe — shudhu apnar `ADMIN_EMAIL` diye login korle-i data change korte parbe. Onno keu login korle "not admin" message dekhabe, kono access pabe na.
