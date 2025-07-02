import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors'; // Import cors
import apiRoutes from './routes/apiRoutes.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(cors()); // Use cors middleware
app.use(bodyParser.json());
app.use('/api', apiRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('There was an error processing the request!');
});

mongoose
  .connect(
    'mongodb+srv://team:Algoplaces1@cluster0.ib3uz.mongodb.net/algoPlaceDataBase?retryWrites=true&w=majority&appName=Cluster0',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
