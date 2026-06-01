import express from 'express';
import { connectDB } from './config/database.js';
import dotenv from 'dotenv';

dotenv.config({path: '../.env'});
await connectDB();

const app = express();

app.get('/', (req, res) => {
  res.send('Hello, World!');
})

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});