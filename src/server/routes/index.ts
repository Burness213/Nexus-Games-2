import { Router } from 'express';
import authRoutes from './auth.js';
import gamesRoutes from './games.js';
import newsRoutes from './news.js';
import usersRoutes from './users.js';
import adminRoutes from './admin.js';
import db from '../db.js';

const router = Router();

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

router.use('/auth', authRoutes);
router.use('/games', gamesRoutes);
router.use('/news', newsRoutes);
router.use('/users', usersRoutes);
router.use('/admin', adminRoutes);

export default router;
