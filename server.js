const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const ConversionRate = require('./models/conversionRateModel');
const conversionRateSchema = new mongoose.Schema({
    conversionRate: { type: mongoose.Schema.Types.Decimal128, required: true },
    supply: { type: String, required: true },
    assets: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, required: true },
  });
  
const { getDateRange, getPeriod } = require('./utils/time');
const { TimeFrameOptions } = require('./constants/timeFrames');
const { PeriodOptions } = require('./constants/period');
const { TIME_FORMAT_OPTIONS } = require('./constants/timeFormat');

mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected to MongoDB')).catch(err => console.error('MongoDB connection error:', err));
dotenv.config();

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ message: 'Service is up and running!' });
});

app.get('/api/conversion-rate', async (req, res) => {
    try {
      const { period = PeriodOptions.FIVE_MINUTES, timeframe = TimeFrameOptions.ONE_HOUR, format = TIME_FORMAT_OPTIONS.LOCAL } = req.query;
  
      await connectToDatabase();
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