import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

export function dbInit() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      avatar TEXT,
      banner TEXT,
      bio TEXT,
      xp INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      developer TEXT,
      platform TEXT,
      release_date DATE,
      min_requirements TEXT,
      rec_requirements TEXT,
      banner_url TEXT,
      cover_url TEXT,
      trailer_url TEXT,
      store_url TEXT,
      download_url TEXT,
      link_mega TEXT,
      link_mediafire TEXT,
      link_drive TEXT,
      file_size TEXT,
      version TEXT,
      language TEXT,
      format TEXT,
      installation_instructions TEXT,
      category_id INTEGER,
      is_featured BOOLEAN DEFAULT 0,
      views INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS game_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id INTEGER NOT NULL,
      url TEXT NOT NULL,
      FOREIGN KEY (game_id) REFERENCES games(id)
    );

    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL,
      image_url TEXT,
      author_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      game_id INTEGER,
      news_id INTEGER,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (game_id) REFERENCES games(id),
      FOREIGN KEY (news_id) REFERENCES news(id)
    );

    CREATE TABLE IF NOT EXISTS ratings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      game_id INTEGER NOT NULL,
      rating INTEGER CHECK(rating >= 1 AND rating <= 5),
      UNIQUE(user_id, game_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (game_id) REFERENCES games(id)
    );

    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      game_id INTEGER NOT NULL,
      UNIQUE(user_id, game_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (game_id) REFERENCES games(id)
    );

    CREATE TABLE IF NOT EXISTS badges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      icon TEXT NOT NULL,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS user_badges (
      user_id INTEGER NOT NULL,
      badge_id INTEGER NOT NULL,
      granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, badge_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      setting_key TEXT UNIQUE NOT NULL,
      setting_value TEXT
    );
  `);

  // Migrations for existing DB
  try { db.exec("ALTER TABLE users ADD COLUMN banner TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE users ADD COLUMN bio TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE users ADD COLUMN xp INTEGER DEFAULT 0;"); } catch (e) {}
  try { db.exec("ALTER TABLE users ADD COLUMN level INTEGER DEFAULT 1;"); } catch (e) {}
  try { db.exec("ALTER TABLE games ADD COLUMN download_url TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE games ADD COLUMN file_size TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE games ADD COLUMN version TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE games ADD COLUMN language TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE games ADD COLUMN format TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE games ADD COLUMN installation_instructions TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE games ADD COLUMN link_mega TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE games ADD COLUMN link_mediafire TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE games ADD COLUMN link_drive TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE games ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP;"); } catch (e) {}
  try { db.exec("ALTER TABLE games ADD COLUMN cover_url TEXT;"); } catch (e) {}

  // Seed initial admin user if not exists
  const adminExists = db.prepare('SELECT id FROM users WHERE role = ?').get('admin');
  if (!adminExists) {
    const hash = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)').run('admin', 'admin@nexogames.com', hash, 'admin');
  }

  // Seed site settings
  const settingsCount = db.prepare('SELECT count(*) as count FROM site_settings').get() as {count: number};
  if (settingsCount.count === 0) {
    const insertSetting = db.prepare('INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?)');
    insertSetting.run('site_name', 'Nexus Games');
    insertSetting.run('site_description', 'Tu portal de videojuegos');
    insertSetting.run('discord_link', 'https://discord.gg/nexusgames');
    insertSetting.run('twitter_link', 'https://twitter.com/nexusgames');
    insertSetting.run('youtube_link', 'https://youtube.com/nexusgames');
    insertSetting.run('nav_links', JSON.stringify([
      { title: 'Inicio', url: '/' },
      { title: 'Juegos', url: '/search' },
      { title: 'Noticias', url: '/news' }
    ]));
    insertSetting.run('footer_explore', JSON.stringify([
      { title: 'Todos los Juegos', url: '/search' },
      { title: 'Noticias', url: '/news' },
      { title: 'Reseñas', url: '/reviews' },
      { title: 'Próximos Lanzamientos', url: '/upcoming' }
    ]));
    insertSetting.run('footer_community', JSON.stringify([
      { title: 'Reglas de la Comunidad', url: '/guidelines' },
      { title: 'Discord Oficial', url: '/discord' },
      { title: 'Soporte', url: '/support' }
    ]));
    insertSetting.run('footer_legal', JSON.stringify([
      { title: 'Política de Privacidad', url: '/privacy' },
      { title: 'Términos de Servicio', url: '/terms' },
      { title: 'Política de Cookies', url: '/cookies' },
      { title: 'Contacto', url: '/contact' }
    ]));
  }

  // Seed categories
  const catCount = db.prepare('SELECT count(*) as count FROM categories').get() as {count: number};
  if (catCount.count === 0) {
    const categories = ['Action', 'RPG', 'Shooter', 'Strategy', 'Sports', 'Racing', 'Indie', 'Programas', 'Pocos Requisitos', 'Medios Requisitos', 'Altos Requisitos'];
    const insertCat = db.prepare('INSERT INTO categories (name, slug) VALUES (?, ?)');
    categories.forEach(cat => insertCat.run(cat, cat.toLowerCase().replace(/ /g, '-')));
  } else {
    // Ensure 'Programas' and requirements categories exist if DB was already created
    const ensureCat = (name: string, slug: string) => {
      try {
        db.prepare('INSERT INTO categories (name, slug) VALUES (?, ?)').run(name, slug);
      } catch (e) {}
    };
    ensureCat('Programas', 'programas');
    ensureCat('Pocos Requisitos', 'pocos-requisitos');
    ensureCat('Medios Requisitos', 'medios-requisitos');
    ensureCat('Altos Requisitos', 'altos-requisitos');
  }

  // Seed some games if empty
  const gameCount = db.prepare('SELECT count(*) as count FROM games').get() as {count: number};
  if (gameCount.count === 0) {
    const insertGame = db.prepare(`
      INSERT INTO games (title, slug, description, developer, platform, release_date, category_id, banner_url, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertGame.run(
      'Cyber Neon 2077', 'cyber-neon-2077', 'A futuristic RPG set in a dystopian metropolis.', 'Neon Studios', 'PC, PS5, Xbox Series X', '2025-10-12', 2, 'https://picsum.photos/seed/cyber/1920/1080?blur=2', 1
    );
    insertGame.run(
      'Galactic Warfare', 'galactic-warfare', 'Intense multiplayer space shooter.', 'StarForge', 'PC', '2024-05-20', 3, 'https://picsum.photos/seed/space/1920/1080?blur=2', 1
    );
    insertGame.run(
      'Fantasy Quest', 'fantasy-quest', 'Epic open-world adventure.', 'Mythic Games', 'Switch, PC', '2024-11-01', 2, 'https://picsum.photos/seed/fantasy/1920/1080?blur=2', 0
    );
  }
}

export default db;
