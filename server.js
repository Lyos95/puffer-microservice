const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ message: 'Service is up and running!' });
});

app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the microservice!' });
});

app.listen(port, () => {
  console.log(`Microservice running on http://localhost:${port}`);
});