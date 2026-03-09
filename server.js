require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const rateLimit = require('express-rate-limit');
const path      = require('path');

const app  = express();
const PORT = process.env.PORT || 5000;

/* ── Middleware ── */
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST'],
}));

/* ── Rate limiter: max 5 contact requests per 15 min per IP ── */
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many requests. Please try again later.' },
});

/* ── API: Contact form → proxied to Formspree (form ID stays server-side) ── */
app.post('/api/contact', contactLimiter, async (req, res) => {
  const { name, email, message } = req.body;

  // server-side validation
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }
  if (message.length > 2000) {
    return res.status(400).json({ error: 'Message too long (max 2000 chars).' });
  }

  // FORMSPREE_ID lives in .env — never exposed to browser
  const formId = process.env.FORMSPREE_ID;
  if (!formId) {
    return res.status(500).json({ error: 'Contact form not configured.' });
  }

  try {
    const fsRes = await fetch(`https://formspree.io/f/${formId}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body:    JSON.stringify({ name, email, message }),
    });
    const data = await fsRes.json();
    if (fsRes.ok) {
      res.json({ success: true });
    } else {
      res.status(fsRes.status).json({ error: data?.errors?.[0]?.message || 'Formspree error.' });
    }
  } catch (err) {
    console.error('Contact error:', err.message);
    res.status(500).json({ error: 'Network error. Please email directly.' });
  }
});

/* ── API: GitHub repos (server fetches, no token needed for public) ── */
app.get('/api/repos', async (req, res) => {
  try {
    const response = await fetch(
      'https://api.github.com/users/akash2600707/repos?sort=updated&per_page=20',
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          // Add GITHUB_TOKEN to .env if you hit rate limits
          ...(process.env.GITHUB_TOKEN && {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
          }),
        },
      }
    );
    const data = await response.json();
    // Strip only what the client needs — no private data
    const repos = data
      .filter(r => !r.fork && !r.private)
      .map(r => ({
        id:          r.id,
        name:        r.name,
        description: r.description,
        html_url:    r.html_url,
        language:    r.language,
        stargazers:  r.stargazers_count,
        updated_at:  r.updated_at,
        topics:      r.topics,
      }));
    res.json(repos);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch repos.' });
  }
});

/* ── Serve React build in production ── */
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`   ENV: ${process.env.NODE_ENV || 'development'}\n`);
});
