# Akash Ramesh — Personal Portfolio

> **Live:** [akashr.is-a.dev](https://akashr.is-a.dev)

A production-grade MERN stack portfolio with server-side environment variable protection, Three.js 3D animations, and a fully functional contact form.

---

## Why MERN Stack?

The previous version was a single `index.html` file. Any API keys, email credentials, or tokens placed inside it would be **visible in the browser's page source** — anyone could steal them.

This version uses a **Node.js + Express backend** as a secure middleware layer:

```
Browser  →  React (Vite)  →  Express API  →  Gmail / GitHub API
                                ↑
                        .env (never sent to browser)
```

Sensitive values (`GMAIL_USER`, `GMAIL_PASS`, `GITHUB_TOKEN`) live only on the server and are never included in the JavaScript bundle that browsers download.

---

## Project Structure

```
akash-portfolio/
├── server.js              ← Express server (API + static serve)
├── package.json           ← Server dependencies
├── .env.example           ← Environment variable template
├── .gitignore
├── README.md
└── client/                ← React + Vite frontend
    ├── index.html
    ├── vite.config.js     ← Proxies /api to Express in dev
    ├── package.json
    └── src/
        ├── main.jsx
        ├── index.css
        ├── App.jsx        ← All portfolio sections
        └── components/
            ├── HeroGL.jsx ← Three.js 3D WebGL scene
            └── Cursor.jsx ← Custom cursor
```

---

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React 18, Vite, Framer Motion       |
| 3D / WebGL  | Three.js (vanilla, lazy-loaded)     |
| Backend     | Node.js, Express                    |
| Email       | Nodemailer + Gmail App Password     |
| Rate limit  | express-rate-limit                  |
| Styling     | CSS-in-JS + CSS variables           |
| Fonts       | Syne + IBM Plex Mono (Google Fonts) |

---

## Features

- **3D WebGL hero** — rotating icosahedron, orbiting rings, particle field, mouse parallax
- **Framer Motion** — scroll-reveal animations, hover effects, page transitions
- **3D tilt cards** — perspective mouse-reactive project cards
- **Protected contact form** — email credentials never reach the browser
- **Live GitHub repos** — fetched server-side from `/api/repos`
- **Rate limiting** — 5 contact requests / 15 min per IP
- **Custom cursor** — glowing neon dot with ring follower
- **Fast loading** — Vite code splitting (Three.js and Framer Motion in separate chunks)
- **Fully responsive** — desktop + mobile

---

## Local Development

### 1. Clone & install

```bash
git clone https://github.com/akash2600707/AKASH_Portfolio.git
cd AKASH_Portfolio

# Install server deps
npm install

# Install client deps
cd client && npm install && cd ..
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173

# Gmail App Password (NOT your real Gmail password)
# Google Account → Security → 2-Step Verification → App passwords
GMAIL_USER=akash2600707@gmail.com
GMAIL_PASS=your_16_char_app_password

# Optional: avoids GitHub API rate limits
GITHUB_TOKEN=
```

### 3. Run both servers

**Terminal 1 — Express backend:**
```bash
npm run dev
# → http://localhost:5000
```

**Terminal 2 — React frontend:**
```bash
cd client
npm run dev
# → http://localhost:5173
```

Vite automatically proxies all `/api` requests to Express, so there's no CORS issue in development.

---

## Production Build

```bash
# Build React app into client/dist
npm run build:client

# Start Express (serves API + static React build)
NODE_ENV=production npm start
```

Everything runs on a single port (`5000`). No separate frontend server needed.

---

## Deployment Options

### Render (recommended — free tier)

1. Push to GitHub
2. New Web Service → connect repo
3. Build command: `npm install && npm run build:client`
4. Start command: `node server.js`
5. Add environment variables in Render dashboard

### Railway

```bash
railway init
railway add
railway up
```
Set env vars in Railway dashboard.

### VPS / DigitalOcean

```bash
# Install Node, clone repo, set up .env
pm2 start server.js --name portfolio
nginx reverse proxy → port 5000
```

---

## Environment Variables Reference

| Variable        | Required | Description                                         |
|-----------------|----------|-----------------------------------------------------|
| `PORT`          | No       | Server port (default: 5000)                         |
| `NODE_ENV`      | No       | `development` or `production`                       |
| `CLIENT_ORIGIN` | Yes      | Your frontend URL (for CORS)                        |
| `GMAIL_USER`    | Yes      | Gmail address for sending contact emails            |
| `GMAIL_PASS`    | Yes      | Gmail App Password (16-char, not your real password)|
| `GITHUB_TOKEN`  | No       | GitHub PAT for higher API rate limits               |

**Getting a Gmail App Password:**
1. Enable 2-Factor Authentication on your Google account
2. Go to: Google Account → Security → 2-Step Verification → App passwords
3. Generate a password for "Mail" → "Other (custom name)"
4. Paste the 16-character password into `GMAIL_PASS`

---

## API Endpoints

| Method | Endpoint       | Description                              |
|--------|----------------|------------------------------------------|
| POST   | `/api/contact` | Send contact form email (rate-limited)   |
| GET    | `/api/repos`   | Fetch public GitHub repos (cached route) |

---

## Security Notes

- `.env` is in `.gitignore` — never committed to Git
- Email credentials are only accessed in `server.js` — never bundled into React
- Vite's production build has `sourcemap: false` — no source maps exposed
- Rate limiting prevents contact form spam
- Input validation on both client and server

---

## Contact

| Platform  | Link                                                     |
|-----------|----------------------------------------------------------|
| Portfolio | [akashr.is-a.dev](https://akashr.is-a.dev)              |
| LinkedIn  | [linkedin.com/in/akashr26](https://linkedin.com/in/akashr26) |
| GitHub    | [github.com/akash2600707](https://github.com/akash2600707) |
| Email     | [akash2600707@gmail.com](mailto:akash2600707@gmail.com) |

---

<p align="center">Designed & Engineered by <strong>Akash Ramesh</strong> · Chennai, India</p>
