import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';

import employeesRoute from '@/routes/employees.js';

import type { Express } from 'express';

const filename = fileURLToPath(import.meta.url);
const directory = dirname(filename);
const publicDirectory = resolve(directory, '..', 'public');

const app: Express = express();
const PORT = process.env.PORT ?? 3000;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(publicDirectory));

app.use('/employees', employeesRoute);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
