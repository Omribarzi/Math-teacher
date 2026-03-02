import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

import { authMiddleware, parentOnly, signToken } from './auth.js';
import {
  createAccount,
  getAccountByUsername,
  getAccountById,
  getKidsByParentId,
  getAllKids,
  getKidState,
  setKidFullState,
  closeAll,
} from './db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// === Auth Routes ===

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, name, avatarId, role } = req.body;

    if (!username || !password || !name) {
      return res.status(400).json({ error: 'Username, password, and name are required' });
    }
    if (username.length < 2 || password.length < 3) {
      return res.status(400).json({ error: 'Username must be 2+ chars, password 3+ chars' });
    }

    const existing = getAccountByUsername(username);
    if (existing) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const accountId = createAccount({
      username,
      passwordHash,
      role: role === 'parent' ? 'parent' : 'kid',
      name,
      avatarId: avatarId || 'wizard',
      parentId: null,
    });

    const token = signToken({ id: Number(accountId), username, role: role === 'parent' ? 'parent' : 'kid' });

    res.json({
      token,
      user: { id: Number(accountId), username, name, role: role === 'parent' ? 'parent' : 'kid', avatarId: avatarId || 'wizard' },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const account = getAccountByUsername(username);
    if (!account) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const valid = await bcrypt.compare(password, account.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = signToken({ id: account.id, username: account.username, role: account.role });

    res.json({
      token,
      user: {
        id: account.id,
        username: account.username,
        name: account.name,
        role: account.role,
        avatarId: account.avatar_id,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// === Kid State Routes ===

app.get('/api/state', authMiddleware, (req, res) => {
  try {
    const state = getKidState(req.user.id);
    res.json(state);
  } catch (err) {
    console.error('Get state error:', err);
    res.status(500).json({ error: 'Failed to get state' });
  }
});

app.put('/api/state', authMiddleware, (req, res) => {
  try {
    const { player, progress, settings } = req.body;
    const state = {};
    if (player) state.player = player;
    if (progress) state.progress = progress;
    if (settings) state.settings = settings;

    setKidFullState(req.user.id, state);
    res.json({ ok: true });
  } catch (err) {
    console.error('Save state error:', err);
    res.status(500).json({ error: 'Failed to save state' });
  }
});

// === Parent/Admin Routes ===

app.get('/api/admin/kids', authMiddleware, parentOnly, (req, res) => {
  try {
    const kids = getKidsByParentId(req.user.id);
    // Also include unparented kids if this is the first parent
    const allKids = getAllKids();
    const kidList = allKids.map((kid) => {
      const state = getKidState(kid.id);
      return {
        ...kid,
        player: state.player || null,
        progress: state.progress || null,
      };
    });
    res.json(kidList);
  } catch (err) {
    console.error('List kids error:', err);
    res.status(500).json({ error: 'Failed to list kids' });
  }
});

app.post('/api/admin/kids', authMiddleware, parentOnly, async (req, res) => {
  try {
    const { username, password, name, avatarId } = req.body;

    if (!username || !password || !name) {
      return res.status(400).json({ error: 'Username, password, and name are required' });
    }

    const existing = getAccountByUsername(username);
    if (existing) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const accountId = createAccount({
      username,
      passwordHash,
      role: 'kid',
      name,
      avatarId: avatarId || 'wizard',
      parentId: req.user.id,
    });

    res.json({
      id: Number(accountId),
      username,
      name,
      avatarId: avatarId || 'wizard',
    });
  } catch (err) {
    console.error('Create kid error:', err);
    res.status(500).json({ error: 'Failed to create kid account' });
  }
});

app.get('/api/admin/kid/:kidId/state', authMiddleware, parentOnly, (req, res) => {
  try {
    const state = getKidState(parseInt(req.params.kidId));
    res.json(state);
  } catch (err) {
    console.error('Get kid state error:', err);
    res.status(500).json({ error: 'Failed to get kid state' });
  }
});

// === Serve Static Frontend ===

const distPath = join(__dirname, '..', 'dist');
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(join(distPath, 'index.html'));
    }
  });
}

// === Start Server ===

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Math Teacher server running on http://0.0.0.0:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => { closeAll(); process.exit(0); });
process.on('SIGTERM', () => { closeAll(); process.exit(0); });
