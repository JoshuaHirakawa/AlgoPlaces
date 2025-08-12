import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import apiRoutes from './routes/apiRoutes.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port: number = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api', apiRoutes);

// Global Error Handler with proper types
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('There was an error processing the request!');
});

// MongoDB connection with proper error handling
mongoose
  .connect(
    'mongodb+srv://team:Algoplaces1@cluster0.ib3uz.mongodb.net/algoPlaceDataBase?retryWrites=true&w=majority&appName=Cluster0'
  )
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err: Error) => {
    console.error('MongoDB connection error:', err);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
