import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  const { search, category, platform, sort } = req.query;
  let query = 'SELECT games.*, categories.name as category_name FROM games LEFT JOIN categories ON games.category_id = categories.id WHERE 1=1';
  const params: any[] = [];

  if (search) {
    query += ' AND games.title LIKE ?';
    params.push(`%${search}%`);
  }
  if (category) {
    query += ' AND categories.slug = ?';
    params.push(category);
  }
  if (platform) {
    query += ' AND games.platform LIKE ?';
    params.push(`%${platform}%`);
  }

  if (sort === 'recent') {
    query += ' ORDER BY games.release_date DESC';
  } else if (sort === 'popular') {
    query += ' ORDER BY games.views DESC';
  } else if (sort === 'updated') {
    query += ' ORDER BY games.updated_at DESC';
  } else {
    query += ' ORDER BY games.id DESC';
  }

  try {
    const games = db.prepare(query).all(...params);
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/featured', (req, res) => {
  try {
    const games = db.prepare('SELECT * FROM games WHERE is_featured = 1 ORDER BY id DESC LIMIT 5').all();
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/categories', (req, res) => {
  try {
    const categories = db.prepare('SELECT * FROM categories ORDER BY name ASC').all();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:slug', (req, res) => {
  try {
    const game = db.prepare('SELECT games.*, categories.name as category_name FROM games LEFT JOIN categories ON games.category_id = categories.id WHERE games.slug = ?').get(req.params.slug) as any;
    if (!game) return res.status(404).json({ error: 'Game not found' });
    
    // Increment views
    db.prepare('UPDATE games SET views = views + 1 WHERE id = ?').run(game.id);
    
    // Get comments
    const comments = db.prepare(`
      SELECT comments.*, users.username, users.avatar 
      FROM comments 
      JOIN users ON comments.user_id = users.id 
      WHERE game_id = ? 
      ORDER BY created_at DESC
    `).all(game.id);
    
    // Get rating
    const ratingData = db.prepare('SELECT AVG(rating) as avg_rating, COUNT(rating) as total_ratings FROM ratings WHERE game_id = ?').get(game.id) as any;
    
    res.json({ ...game, comments, rating: ratingData });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
