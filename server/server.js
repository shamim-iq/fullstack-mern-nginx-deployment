const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'node-project-db.crc1sypefuli.us-east-1.rds.amazonaws.com',
  port: '3306',
  user: 'admin',
  password: 'password',
  database: 'my_sql_db',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    throw err; // You may want to consider removing this line to avoid crashing the app on a database connection error.
  }
  console.log('Connected to the database');
});

app.get('/', (req, res) => {
  // Your code to generate the response goes here
  res.send('Backend connection successful!'); // Sending a simple text response
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', username, (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      res.json({ message: 'Account exists, please login with proper credentials.' });
    } else {
      db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
        if (err) throw err;
        res.json({ message: 'Your registration is successful!' });
      });
    }
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      res.json({ message: `Welcome, ${username}. You have Logged in successfully!` });
    } else {
      res.json({ message: 'Incorrect username/password. Please check before entering.' });
    }
  });
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
