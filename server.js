const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');
const logger = require('./logger');
const SysTray = require('systray2').default;

const app = express();
const port = 3000;

// Initialize System Tray
const tray = new SysTray({
  menu: {
    icon: path.join(__dirname, 'icon.ico'),
    title: 'Yadegar Kanban',
    tooltip: 'Manage your Kanban board',
    items: [
      {
        title: 'Open Board',
        tooltip: 'Open the board in your browser',
        click: () => {
          const { exec } = require('child_process');
          exec('start http://localhost:3000');
        }
      },
      SysTray.separator,
      {
        title: 'Exit',
        tooltip: 'Close the server',
        click: () => {
          logger.info('Server shutting down via tray...');
          process.exit(0);
        }
      }
    ]
  }
});

tray.onClick(action => {
  if (action.item.click != null) {
    action.item.click();
  }
});

tray.ready()
  .then(() => logger.info('System tray is now active!'))
  .catch(err => logger.error(`Failed to start system tray: ${err}`));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

logger.info('Initializing database...');
let db;
try {
  db = new Database('kanban.db');
  logger.info('Database connected successfully.');
} catch (err) {
  logger.error(`FATAL ERROR: Could not connect to SQLite database: ${err}`);
  process.exit(1);
}

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    column TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL
  );
`);

// Migrations for new features
try {
  db.exec('ALTER TABLE cards ADD COLUMN color TEXT');
} catch (e) {
  // Column already exists
}

try {
  db.exec('ALTER TABLE cards ADD COLUMN archived INTEGER DEFAULT 0');
} catch (e) {
  // Column already exists
}

// Seed quotes if empty
const quotesCount = db.prepare('SELECT count(*) as count FROM quotes').get().count;
if (quotesCount === 0) {
  const quotes = [
    "Believe in yourself! (Or just believe in coffee, it works too)",
    "The best way to get started is to quit talking and start doing.",
    "Dream big. Sleep late.",
    "Your potential is endless. Go do something awesome!",
    "Mistakes are proof that you are trying.",
    "Do what you love, and you'll never work a day in your life (unless you love working).",
    "Stay positive, work hard, make it happen.",
    "The only way to do great work is to love what you do.",
    "Everything you've ever wanted is on the other side of fear.",
    "Hard work beats talent when talent doesn't work hard.",
    "Don't stop until you're proud.",
    "Success is a journey, not a destination.",
    "Push yourself, because no one else is going to do it for you.",
    "Sometimes you win, sometimes you learn.",
    "Wake up with determination. Go to bed with satisfaction.",
    "Do something today that your future self will thank you for.",
    "Little things make big days.",
    "Dream it. Wish it. Do it.",
    "Make each day your masterpiece.",
    "Your only limit is your mind.",
    "Stay hungry, stay foolish.",
    "Believe you can and you're halfway there.",
    "Focus on being productive instead of busy.",
    "The secret of getting ahead is getting started.",
    "Great things never come from comfort zones.",
    "Consistency is key.",
    "Keep going. Everything you need will come to you at the perfect time.",
    "One day or day one. You decide.",
    "Action is the foundational key to all success.",
    "Don't wait for opportunity. Create it.",
    "Small progress is still progress.",
    "Be a voice, not an echo.",
    "If you can dream it, you can do it.",
    "Difficult roads often lead to beautiful destinations.",
    "Your time is limited, so don't waste it living someone else's life.",
    "The expert in anything was once a beginner.",
    "Work hard in silence, let your success be your noise.",
    "It always seems impossible until it's done.",
    "Be the change you wish to see in the world.",
    "The only limit to our realization of tomorrow will be our doubts of today.",
    "Dream big, work hard, stay humble.",
    "Success doesn't just happen. It's earned.",
    "Believe in the magic of new beginnings.",
    "Stay focused and never give up.",
    "The journey of a thousand miles begins with one step.",
    "A goal without a plan is just a wish.",
    "You are stronger than you think.",
    "Don't let yesterday take up too much of today.",
    "Courage is not the absence of fear, but the triumph over it.",
    "Tough times don't last, tough people do.",
    "Every accomplishment starts with the decision to try.",
    "Whatever you are, be a good one.",
    "Success is walking from failure to failure with no loss of enthusiasm.",
    "The way to get started is to quit talking and start doing.",
    "The only place where success comes before work is in the dictionary.",
    "Don't count the days, make the days count.",
    "Believe in yourself and all that you are.",
    "Change your thoughts and you change your world.",
    "The best revenge is massive success.",
    "Stay hungry, stay humble.",
    "A river cuts through rock, not because of its power, but because of its persistence.",
    "Failure is the opportunity to begin again more intelligently.",
    "If you want to fly, give up everything that weighs you down.",
    "The only way to do it is to do it.",
    "Your vibration attracts your tribe.",
    "Be your own kind of beautiful.",
    "Do it now. Sometimes 'later' becomes 'never'.",
    "Life is short. Smile while you still have teeth.",
    "If you think you can, you can.",
    "Happiness depends upon ourselves.",
    "Be happy for this very moment. This is the only moment you know.",
    "I can't change the direction of the wind, but I can adjust my sails.",
    "Everything has beauty, but not everyone sees it.",
    "The only real mistake is the one from which we learn nothing.",
    "Whatever you do, do it with all your heart.",
    "Keep your face always toward the sunshine—and shadows will fall behind you.",
    "The more you praise and admire your life, the more there is in life to praise.",
    "Life is 10% what happens to us and 90% how we react to it.",
    "Turn your wounds into wisdom.",
    "Act as if what you do makes a difference. It does.",
    "The only thing standing between you and your goal is the story you keep telling yourself.",
    "Stop doubting yourself. Work hard and make it happen.",
    "You don't have to be great to start, but you have to start to be great.",
    "Whatever happens, keep moving forward.",
    "The best is yet to come.",
    "Stay positive and keep swimming.",
    "Do not let what you cannot do interfere with what you can do.",
    "The only person you should try to be better than is the person you were yesterday.",
    "Every day is a second chance.",
    "Dream it. Believe it. Achieve it.",
    "Focus on the good.",
    "Good things come to those who hustle.",
    "Confidence is not 'they will like me', confidence is 'I'll be fine if they don't'.",
    "Silence is a source of great strength.",
    "You are enough.",
    "Be a warrior, not a worrier.",
    "The power of consistency is underestimated.",
    "Invest in yourself.",
    "Your energy introduces you before you even speak.",
    "Create the life you can't wait to wake up to.",
    "Believe in the process.",
    "One small positive thought in the morning can change your whole day.",
    "Radiate positive vibes.",
    "The grind doesn't stop.",
    "Make it happen.",
    "Success is the sum of small efforts repeated day in and day out."
  ];

  const insert = db.prepare('INSERT INTO quotes (text) VALUES (?)');
  const transaction = db.transaction((quotes) => {
    for (const quote of quotes) insert.run(quote);
  });
  transaction(quotes);
  logger.info('Seeded 100 quotes into database.');
}

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is alive and kicking!' });
});

// API Endpoints

// Get all cards
app.get('/api/cards', (req, res) => {
  logger.info('API Request: GET /api/cards');
  try {
    const cards = db.prepare('SELECT * FROM cards WHERE archived = 0').all();
    res.json(cards);
  } catch (err) {
    logger.error(`Error in GET /api/cards: ${err}`);
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
});

// Create a new card
app.post('/api/cards', (req, res) => {
  logger.info(`API Request: POST /api/cards ${JSON.stringify(req.body)}`);
  const { title, description, column, color } = req.body;
  if (!title || !column) {
    return res.status(400).json({ error: 'Title and column are required' });
  }
  try {
    const info = db.prepare('INSERT INTO cards (title, description, column, color) VALUES (?, ?, ?, ?)')
                  .run(title, description, column, color || '#757575');
    res.status(201).json({ id: info.lastInsertRowid, title, description, column, color: color || '#757575' });
  } catch (err) {
    logger.error(`Error in POST /api/cards: ${err}`);
    res.status(500).json({ error: 'Failed to save card' });
  }
});

// Update card (Move, Edit Title/Desc/Color)
app.put('/api/cards/:id', (req, res) => {
  logger.info(`API Request: PUT /api/cards/${req.params.id} ${JSON.stringify(req.body)}`);
  const { id } = req.params;
  const { title, description, column, color } = req.body;

  if (!title && !column && !description && !color) {
    return res.status(400).json({ error: 'At least one field to update is required' });
  }

  try {
    const updates = [];
    const values = [];

    if (title !== undefined) { updates.push('title = ?'); values.push(title); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    if (column !== undefined) { updates.push('column = ?'); values.push(column); }
    if (color !== undefined) { updates.push('color = ?'); values.push(color); }

    values.push(id);
    const sql = `UPDATE cards SET ${updates.join(', ')} WHERE id = ?`;

    const result = db.prepare(sql).run(...values);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.json({ success: true });
  } catch (err) {
    logger.error(`Error in PUT /api/cards: ${err}`);
    res.status(500).json({ error: 'Failed to update card' });
  }
});

// Archive/Unarchive card
app.patch('/api/cards/:id/archive', (req, res) => {
  const { id } = req.params;
  try {
    const result = db.prepare('UPDATE cards SET archived = 1 - archived WHERE id = ?')
                    .run(id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.json({ success: true });
  } catch (err) {
    logger.error(`Error in PATCH /api/cards/${id}/archive: ${err}`);
    res.status(500).json({ error: 'Failed to toggle archive status' });
  }
});

// Delete card
app.delete('/api/cards/:id', (req, res) => {
  const { id } = req.params;
  try {
    const result = db.prepare('DELETE FROM cards WHERE id = ?').run(id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.json({ success: true });
  } catch (err) {
    logger.error(`Error in DELETE /api/cards/${id}: ${err}`);
    res.status(500).json({ error: 'Failed to delete card' });
  }
});

// Get a random quote
app.get('/api/quote', (req, res) => launchQuote(res));

async function launchQuote(res) {
  try {
    const quote = db.prepare('SELECT text FROM quotes ORDER BY RANDOM() LIMIT 1').get();
    res.json(quote);
  } catch (err) {
    logger.error(`Error in GET /api/quote: ${err}`);
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
}

// Start server
app.listen(port, () => {
  logger.info('--------------------------------------------------');
  logger.info(`🚀 Kanban server running at http://localhost:${port}`);
  logger.info(`✅ Health Check: http://localhost:${port}/health`);
  logger.info('--------------------------------------------------');
});