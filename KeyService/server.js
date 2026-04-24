import express from 'express';
import mysql from 'mysql2/promise';
import { nanoid } from 'nanoid';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  database: process.env.MYSQL_DATABASE || 'keys_db',
  port: parseInt(process.env.MYSQL_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

async function initDB() {
  pool = mysql.createPool(dbConfig);
  // Create table if not exists
  const connection = await pool.getConnection();
  await connection.query(`
    CREATE TABLE IF NOT EXISTS generated_keys (
      id VARCHAR(7) PRIMARY KEY,
      is_used BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  connection.release();
  console.log('MySQL Database initialized.');
  generateKeysBackground();
}

async function generateKeysBackground() {
  const BATCH_SIZE = 100;
  setInterval(async () => {
    try {
      const [rows] = await pool.query('SELECT COUNT(*) as count FROM generated_keys WHERE is_used = FALSE');
      if (rows[0].count < 1000) {
        // Need more keys
        for (let i = 0; i < BATCH_SIZE; i++) {
          const newKey = nanoid(7);
          await pool.query('INSERT IGNORE INTO generated_keys (id) VALUES (?)', [newKey]);
        }
        console.log(`Generated ${BATCH_SIZE} new keys`);
      }
    } catch (err) {
      console.error('Error generating keys:', err);
    }
  }, 5000); // Check every 5 seconds
}

app.get('/api/keys', async (req, res) => {
  try {
    // Get an unused key and mark it as used in a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    const [rows] = await connection.query('SELECT id FROM generated_keys WHERE is_used = FALSE LIMIT 1 FOR UPDATE SKIP LOCKED');
    
    if (rows.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(503).json({ error: 'No available keys' });
    }

    const key = rows[0].id;
    await connection.query('UPDATE generated_keys SET is_used = TRUE WHERE id = ?', [key]);
    await connection.commit();
    connection.release();

    res.json({ key });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch key' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  try {
    await initDB();
    console.log(`Key Service listening on port ${PORT}`);
  } catch (err) {
    console.error("Failed to connect to MySQL database", err);
    process.exit(1);
  }
});
