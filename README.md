# Student Tracker (Offline, Multi‑User)

This is a **fully offline, local‑first** tracking app for college students:

- **Finance tracking**: income/expense transactions, monthly summary, budget status
- **Study tracking**: timer sessions + manual sessions, weekly totals
- **Exam tracking**: upcoming exams list + next-exam dashboard
- **Task tracking**: to-dos with due date + priority
- **Multi-user login**: create multiple local users, each protected by password
- **Offline storage**: data is stored locally in **IndexedDB**
- **Backups**: export/import JSON files (recommended regularly)

## Security model (local device)

- Passwords are stored as **PBKDF2 hashes**.
- Each user’s data is stored as an **AES‑GCM encrypted blob** in IndexedDB.
- Nothing is sent to any server (there is no server).

## Run it

You can open `index.html` directly, but to enable install/offline caching (service worker),
you should run it from a local server.

### Option A: VS Code / Cursor “Live Server”

- Install/run a Live Server extension
- Open `index.html`

### Option B: Python (if installed)

From this folder:

```bash
python -m http.server 5173
```

Then open `http://localhost:5173/`.

## Install (PWA)

When opened via `http://localhost/...`, most browsers will allow “Install app”.

## Backup tips

- Use **Export all data** on the login screen to back up every user on the device (encrypted).
- Use **Export my data** while logged in to export your account data (decrypted).

## Share with friends (as an “app”)

Because this project is a **PWA** (web app that can be installed), you have a few options:

### Option 1: Share the folder (offline only)

- Zip the whole project folder and send it.
- Your friend runs it with a local server (example):

```bash
python -m http.server 5173
```

- They open `http://localhost:5173/` and can “Install” it.

### Option 2: Host it online (recommended for easy sharing)

- Upload these files to a static host (GitHub Pages / Netlify / any static hosting):
  - `index.html`, `styles.css`, `sw.js`, `manifest.webmanifest`
  - `icons/` and `src/`
- Share the hosted link.
- Friends open the link and choose **Install** (Chrome/Edge: install icon in address bar).

### Option 3: Make it a real desktop/mobile app

- Wrap as a desktop app using **Tauri** or **Electron**
- Or package for Android using a WebView wrapper

Note: This app stores data locally **on each device**. Sharing the app does not automatically share your data.

