const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ message: 'Service is up and running!' });
});


app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the microservice v2!' });
});

app.listen(port, () => {
  console.log(`Microservice running on http://localhost:${port}`);
});