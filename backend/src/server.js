import express from 'express';
import { connectDB } from './config/database.js';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import employeeRoutes from './routes/employee.routes.js';

dotenv.config({path: '../.env'});
await connectDB();

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});