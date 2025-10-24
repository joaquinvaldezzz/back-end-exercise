import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import express, { type Express } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import employeesRoute from '@/routes/employees.js';

import '@dotenvx/dotenvx';

const filename = fileURLToPath(import.meta.url);
const directory = dirname(filename);
const publicDirectory = resolve(directory, '..', 'public');

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(publicDirectory));

app.use('/employees', employeesRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
