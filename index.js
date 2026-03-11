const express = require('express');
const { Pool } = require('pg');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// Database connection
const pool = new Pool({
  connectionString: process.env.postgresql://devops_todo_db_71k7_user:gfe3QShl4UVgYPX84YVQ0z6lqNQItkKV@dpg-d6og6frh46gs73ak2tjg-a/devops_todo_db_71k7,
  ssl: { rejectUnauthorized: false }
});

// Create table if not exists
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      text TEXT NOT NULL,
      done BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('Database ready!');
}

// Get all todos
app.get('/api/todos', async (req, res) => {
  const result = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
  res.json(result.rows);
});

// Add todo
app.post('/api/todos', async (req, res) => {
  if (!req.body.text || req.body.text.trim() === '') {
    return res.status(400).json({ error: 'Text required' });
  }
  const result = await pool.query(
    'INSERT INTO todos (text) VALUES ($1) RETURNING *',
    [req.body.text.trim()]
  );
  res.json(result.rows[0]);
});

// Toggle done
app.patch('/api/todos/:id', async (req, res) => {
  const result = await pool.query(
    'UPDATE todos SET done = NOT done WHERE id = $1 RETURNING *',
    [req.params.id]
  );
  res.json(result.rows[0]);
});

// Delete todo
app.delete('/api/todos/:id', async (req, res) => {
  await pool.query('DELETE FROM todos WHERE id = $1', [req.params.id]);
  res.json({ message: 'Deleted' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await initDB();
  console.log(`App running on port ${PORT}`);
});