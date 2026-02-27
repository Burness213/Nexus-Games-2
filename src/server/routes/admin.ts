import { Router } from 'express';
import db from '../db.js';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

const adminMiddleware = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin' && decoded.role !== 'moderator') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.use(adminMiddleware);

router.get('/stats', (req, res) => {
  try {
    const usersCount = db.prepare('SELECT count(*) as count FROM users').get() as any;
    const gamesCount = db.prepare('SELECT count(*) as count FROM games').get() as any;
    const commentsCount = db.prepare('SELECT count(*) as count FROM comments').get() as any;
    const topGames = db.prepare('SELECT title, views FROM games ORDER BY views DESC LIMIT 5').all();
    
    res.json({
      users: usersCount.count,
      games: gamesCount.count,
      comments: commentsCount.count,
      topGames
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/games', (req: any, res: any) => {
  const { title, description, developer, platform, release_date, category_id, banner_url, cover_url, trailer_url, is_featured, download_url, link_mega, link_mediafire, link_drive, file_size, version, language, format, installation_instructions } = req.body;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  try {
    const stmt = db.prepare(`
      INSERT INTO games (title, slug, description, developer, platform, release_date, category_id, banner_url, cover_url, trailer_url, is_featured, download_url, link_mega, link_mediafire, link_drive, file_size, version, language, format, installation_instructions)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(title, slug, description, developer, platform, release_date, category_id, banner_url, cover_url, trailer_url, is_featured ? 1 : 0, download_url, link_mega, link_mediafire, link_drive, file_size, version, language, format, installation_instructions);
    const newGame = db.prepare('SELECT games.*, categories.name as category_name FROM games LEFT JOIN categories ON games.category_id = categories.id WHERE games.id = ?').get(info.lastInsertRowid);
    res.json(newGame);
  } catch (err: any) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/games/:id', (req: any, res: any) => {
  const { title, description, developer, platform, release_date, category_id, banner_url, cover_url, trailer_url, is_featured, download_url, link_mega, link_mediafire, link_drive, file_size, version, language, format, installation_instructions } = req.body;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  try {
    const stmt = db.prepare(`
      UPDATE games SET 
        title = ?, slug = ?, description = ?, developer = ?, platform = ?, release_date = ?, category_id = ?, 
        banner_url = ?, cover_url = ?, trailer_url = ?, is_featured = ?, download_url = ?, link_mega = ?, 
        link_mediafire = ?, link_drive = ?, file_size = ?, version = ?, language = ?, format = ?, 
        installation_instructions = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(title, slug, description, developer, platform, release_date, category_id, banner_url, cover_url, trailer_url, is_featured ? 1 : 0, download_url, link_mega, link_mediafire, link_drive, file_size, version, language, format, installation_instructions, req.params.id);
    const updatedGame = db.prepare('SELECT games.*, categories.name as category_name FROM games LEFT JOIN categories ON games.category_id = categories.id WHERE games.id = ?').get(req.params.id);
    res.json(updatedGame);
  } catch (err: any) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/games/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM games WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/news', (req: any, res: any) => {
  const { title, content, image_url } = req.body;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  try {
    const stmt = db.prepare(`
      INSERT INTO news (title, slug, content, image_url, author_id)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(title, slug, content, image_url, req.user.id);
    const newArticle = db.prepare('SELECT news.*, users.username as author_name FROM news JOIN users ON news.author_id = users.id WHERE news.id = ?').get(info.lastInsertRowid);
    res.json(newArticle);
  } catch (err: any) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/news/:id', (req: any, res: any) => {
  const { title, content, image_url } = req.body;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  try {
    const stmt = db.prepare(`
      UPDATE news SET title = ?, slug = ?, content = ?, image_url = ?
      WHERE id = ?
    `);
    stmt.run(title, slug, content, image_url, req.params.id);
    const updatedArticle = db.prepare('SELECT news.*, users.username as author_name FROM news JOIN users ON news.author_id = users.id WHERE news.id = ?').get(req.params.id);
    res.json(updatedArticle);
  } catch (err: any) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/news/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM news WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/users', (req, res) => {
  try {
    const users = db.prepare('SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC').all();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/users/:id/role', (req, res) => {
  const { role } = req.body;
  if (!['user', 'moderator', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  try {
    db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/users/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/categories', (req, res) => {
  try {
    const categories = db.prepare('SELECT * FROM categories').all();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/categories', (req, res) => {
  const { name, slug } = req.body;
  try {
    const info = db.prepare('INSERT INTO categories (name, slug) VALUES (?, ?)').run(name, slug);
    res.json({ id: info.lastInsertRowid, name, slug });
  } catch (err: any) {
    res.status(400).json({ error: 'Category already exists' });
  }
});

router.delete('/categories/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/badges', (req, res) => {
  try {
    const badges = db.prepare('SELECT * FROM badges').all();
    res.json(badges);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/badges', (req, res) => {
  const { name, icon, description } = req.body;
  try {
    const info = db.prepare('INSERT INTO badges (name, icon, description) VALUES (?, ?, ?)').run(name, icon, description);
    res.json({ id: info.lastInsertRowid, name, icon, description });
  } catch (err) {
    res.status(400).json({ error: 'Badge already exists' });
  }
});

router.post('/users/:id/badges', (req, res) => {
  const { badge_id } = req.body;
  try {
    db.prepare('INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)').run(req.params.id, badge_id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'User already has this badge' });
  }
});

router.get('/settings', (req, res) => {
  try {
    const settings = db.prepare('SELECT setting_key, setting_value FROM site_settings').all();
    const settingsObj = settings.reduce((acc: any, curr: any) => {
      acc[curr.setting_key] = curr.setting_value;
      return acc;
    }, {});
    
    // Parse JSON fields if they exist
    ['nav_links', 'footer_explore', 'footer_community', 'footer_legal'].forEach(field => {
      if (settingsObj[field]) {
        try {
          settingsObj[field] = JSON.parse(settingsObj[field]);
        } catch (e) {
          settingsObj[field] = [];
        }
      }
    });
    
    res.json(settingsObj);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/settings', (req, res) => {
  const settings = req.body;
  try {
    const updateStmt = db.prepare('UPDATE site_settings SET setting_value = ? WHERE setting_key = ?');
    const insertStmt = db.prepare('INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?)');
    
    db.transaction(() => {
      for (const [key, value] of Object.entries(settings)) {
        const valStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
        const result = updateStmt.run(valStr, key);
        if (result.changes === 0) {
          insertStmt.run(key, valStr);
        }
      }
    })();
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/comments', (req, res) => {
  try {
    const comments = db.prepare(`
      SELECT comments.id, comments.content, comments.created_at, 
             users.username as author_name, games.title as game_title
      FROM comments
      JOIN users ON comments.user_id = users.id
      JOIN games ON comments.game_id = games.id
      ORDER BY comments.created_at DESC
    `).all();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/comments/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM comments WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
