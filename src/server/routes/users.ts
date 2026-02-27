import { Router } from 'express';
import db from '../db.js';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

const authMiddleware = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Helper function to add XP
function addXp(userId: number, amount: number) {
  try {
    const user = db.prepare('SELECT xp, level FROM users WHERE id = ?').get(userId) as any;
    if (!user) return null;
    
    let newXp = (user.xp || 0) + amount;
    let newLevel = user.level || 1;
    
    // 100 XP per level
    const calculatedLevel = Math.floor(newXp / 100) + 1;
    
    if (calculatedLevel > newLevel) {
      newLevel = calculatedLevel;
    }
    
    db.prepare('UPDATE users SET xp = ?, level = ? WHERE id = ?').run(newXp, newLevel, userId);
    return { xp: newXp, level: newLevel, leveledUp: newLevel > user.level };
  } catch (e) {
    console.error('Error adding XP:', e);
    return null;
  }
}

router.post('/comments', authMiddleware, (req: any, res: any) => {
  const { game_id, news_id, content } = req.body;
  if (!content) return res.status(400).json({ error: 'Content is required' });
  if (!game_id && !news_id) return res.status(400).json({ error: 'Game or News ID is required' });

  try {
    const stmt = db.prepare('INSERT INTO comments (user_id, game_id, news_id, content) VALUES (?, ?, ?, ?)');
    const info = stmt.run(req.user.id, game_id || null, news_id || null, content);
    
    // Add 10 XP for commenting
    addXp(req.user.id, 10);
    
    const comment = db.prepare(`
      SELECT comments.*, users.username, users.avatar 
      FROM comments 
      JOIN users ON comments.user_id = users.id 
      WHERE comments.id = ?
    `).get(info.lastInsertRowid);
    
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/ratings', authMiddleware, (req: any, res: any) => {
  const { game_id, rating } = req.body;
  if (!game_id || !rating) return res.status(400).json({ error: 'Game ID and rating are required' });
  if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be between 1 and 5' });

  try {
    const stmt = db.prepare(`
      INSERT INTO ratings (user_id, game_id, rating) 
      VALUES (?, ?, ?) 
      ON CONFLICT(user_id, game_id) DO UPDATE SET rating=excluded.rating
    `);
    stmt.run(req.user.id, game_id, rating);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/favorites', authMiddleware, (req: any, res: any) => {
  const { game_id } = req.body;
  if (!game_id) return res.status(400).json({ error: 'Game ID is required' });

  try {
    const exists = db.prepare('SELECT id FROM favorites WHERE user_id = ? AND game_id = ?').get(req.user.id, game_id);
    if (exists) {
      db.prepare('DELETE FROM favorites WHERE user_id = ? AND game_id = ?').run(req.user.id, game_id);
      res.json({ isFavorite: false });
    } else {
      db.prepare('INSERT INTO favorites (user_id, game_id) VALUES (?, ?)').run(req.user.id, game_id);
      // Add 5 XP for favoriting
      addXp(req.user.id, 5);
      res.json({ isFavorite: true });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/favorites', authMiddleware, (req: any, res: any) => {
  try {
    const favorites = db.prepare(`
      SELECT games.* 
      FROM favorites 
      JOIN games ON favorites.game_id = games.id 
      WHERE favorites.user_id = ?
    `).all(req.user.id);
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/profile/:username', (req: any, res: any) => {
  try {
    const user = db.prepare('SELECT id, username, role, avatar, banner, bio, xp, level, created_at FROM users WHERE username = ?').get(req.params.username) as any;
    if (!user) return res.status(404).json({ error: 'User not found' });

    const badges = db.prepare(`
      SELECT badges.* 
      FROM user_badges 
      JOIN badges ON user_badges.badge_id = badges.id 
      WHERE user_badges.user_id = ?
    `).all(user.id);

    const favorites = db.prepare(`
      SELECT games.id, games.title, games.slug, games.cover_url 
      FROM favorites 
      JOIN games ON favorites.game_id = games.id 
      WHERE favorites.user_id = ?
    `).all(user.id);

    const recentComments = db.prepare(`
      SELECT 
        comments.id, 
        comments.content, 
        comments.created_at, 
        games.title as game_title, 
        games.slug as game_slug,
        news.title as news_title,
        news.slug as news_slug
      FROM comments
      LEFT JOIN games ON comments.game_id = games.id
      LEFT JOIN news ON comments.news_id = news.id
      WHERE comments.user_id = ?
      ORDER BY comments.created_at DESC
      LIMIT 10
    `).all(user.id);

    res.json({ ...user, badges, favorites, recentComments });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/profile', authMiddleware, (req: any, res: any) => {
  const { avatar, banner, bio } = req.body;
  try {
    db.prepare('UPDATE users SET avatar = ?, banner = ?, bio = ? WHERE id = ?').run(avatar || null, banner || null, bio || null, req.user.id);
    const updatedUser = db.prepare('SELECT id, username, email, role, avatar, banner, bio, xp, level FROM users WHERE id = ?').get(req.user.id);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
