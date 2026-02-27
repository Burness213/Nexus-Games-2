import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const news = db.prepare(`
      SELECT news.*, users.username as author_name 
      FROM news 
      JOIN users ON news.author_id = users.id 
      ORDER BY created_at DESC
    `).all();
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:slug', (req, res) => {
  try {
    const article = db.prepare(`
      SELECT news.*, users.username as author_name 
      FROM news 
      JOIN users ON news.author_id = users.id 
      WHERE slug = ?
    `).get(req.params.slug) as any;
    
    if (!article) return res.status(404).json({ error: 'Article not found' });
    
    // Get comments
    const comments = db.prepare(`
      SELECT comments.*, users.username, users.avatar 
      FROM comments 
      JOIN users ON comments.user_id = users.id 
      WHERE news_id = ? 
      ORDER BY created_at DESC
    `).all(article.id);
    
    res.json({ ...article, comments });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
