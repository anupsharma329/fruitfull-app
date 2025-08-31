const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const promClient = require('prom-client');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Prometheus metrics
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics();

// Create custom metrics
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'db',
  database: process.env.DB_NAME || 'fruits_db',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// Initialize database table
const initializeDatabase = async () => {
  let retries = 5;
  while (retries > 0) {
    try {
      const client = await pool.connect();
      await client.query(`
        CREATE TABLE IF NOT EXISTS fruits (
          id SERIAL PRIMARY KEY,
          fruit_name VARCHAR(100) NOT NULL,
          fruit_count INT NOT NULL
        )
      `);
      client.release();
      console.log('Database initialized successfully');
      return;
    } catch (error) {
      console.error(`Error initializing database (attempt ${6-retries}/5):`, error.message);
      retries--;
      if (retries === 0) {
        console.error('Failed to initialize database after 5 attempts');
        return;
      }
      // Wait 2 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
};

// Metrics endpoint for Prometheus
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
  } catch (error) {
    res.status(500).end(error);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get all fruits
app.get('/fruits', async (req, res) => {
  const start = Date.now();
  try {
    const result = await pool.query('SELECT * FROM fruits ORDER BY id DESC');
    const duration = (Date.now() - start) / 1000;

    httpRequestDurationMicroseconds.observe({ method: 'GET', route: '/fruits', status_code: 200 }, duration);
    httpRequestsTotal.inc({ method: 'GET', route: '/fruits', status_code: 200 });

    res.json(result.rows);
  } catch (error) {
    const duration = (Date.now() - start) / 1000;
    httpRequestDurationMicroseconds.observe({ method: 'GET', route: '/fruits', status_code: 500 }, duration);
    httpRequestsTotal.inc({ method: 'GET', route: '/fruits', status_code: 500 });

    console.error('Error fetching fruits:', error);
    res.status(500).json({ error: 'Failed to fetch fruits' });
  }
});

// Add new fruit
app.post('/fruits', async (req, res) => {
  const start = Date.now();
  try {
    const { fruit_name, fruit_count } = req.body;

    if (!fruit_name || fruit_count === undefined) {
      const duration = (Date.now() - start) / 1000;
      httpRequestDurationMicroseconds.observe({ method: 'POST', route: '/fruits', status_code: 400 }, duration);
      httpRequestsTotal.inc({ method: 'POST', route: '/fruits', status_code: 400 });
      return res.status(400).json({ error: 'fruit_name and fruit_count are required' });
    }

    const result = await pool.query(
      'INSERT INTO fruits (fruit_name, fruit_count) VALUES ($1, $2) RETURNING *',
      [fruit_name, fruit_count]
    );

    const duration = (Date.now() - start) / 1000;
    httpRequestDurationMicroseconds.observe({ method: 'POST', route: '/fruits', status_code: 201 }, duration);
    httpRequestsTotal.inc({ method: 'POST', route: '/fruits', status_code: 201 });

    res.status(201).json(result.rows[0]);
  } catch (error) {
    const duration = (Date.now() - start) / 1000;
    httpRequestDurationMicroseconds.observe({ method: 'POST', route: '/fruits', status_code: 500 }, duration);
    httpRequestsTotal.inc({ method: 'POST', route: '/fruits', status_code: 500 });

    console.error('Error adding fruit:', error);
    res.status(500).json({ error: 'Failed to add fruit' });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeDatabase();
});
