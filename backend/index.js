const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors()); 


const pool = new Pool({
  user: 'postgres',           
  host: 'localhost',          
  database: 'notes_db',     
  password: '123456',        
  port: 5432,                 
});

// API สำหรับเพิ่มโน้ต
app.post('/add-note', async (req, res) => {
  const { title, content, category, userId } = req.body;

  try {
    const query = 'INSERT INTO notes (title, content, category, user_id, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *';
    const values = [title, content, category, userId];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]); 
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ error: 'Database error' });
  }
});


app.get('/notes', async (req, res) => {
  const { userId } = req.query;

  try {
    const query = 'SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC'; 
    const result = await pool.query(query, [userId]);
    res.status(200).json(result.rows); 
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Database error' });
  }
});




const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
