const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const ConversionRate = require('./models/conversionRateModel');
const { getDateRange, getPeriod } = require('./utils/time');
const { TIME_FRAME_OPTIONS } = require('./constants/timeFrames');
const { PERIOD_OPTIONS } = require('./constants/period');


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected to MongoDB')).catch(err => console.error('MongoDB connection error:', err));

const port = process.env.PORT || 5000;

app.get('/api/health', (req, res) => {
  res.json({ message: 'Service is up and running!' });
});

app.get('/api/conversion-rate', async (req, res) => {
    try {
      const { period = PERIOD_OPTIONS.FIVE_MINUTES, timeframe = TIME_FRAME_OPTIONS.ONE_HOUR } = req.query;
      const { startDate, endDate } = getDateRange(timeframe);
      const groupByPeriod = getPeriod(period);
  
      // Retrieving and grouping data points by period & timeFrame from the database
      const data = await ConversionRate.aggregate([
        {
          $match: {
            timestamp: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        },
        {
          $group: {
            _id: {
              $toDate: {
                $subtract: [
                  { $toLong: "$timestamp" },
                  { $mod: [{ $toLong: "$timestamp" }, groupByPeriod] },
                ],
              },
            },
            conversionRate: { $avg: "$conversionRate" },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      res.json(data);
    } catch (error) {
      console.error('Error fetching conversion rate:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

app.listen(port, () => {
  console.log(`Microservice running on http://localhost:${port}`);
});