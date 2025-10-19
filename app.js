import { dirname } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import '@dotenvx/dotenvx';

import employeesRouter from './routes/employees.js';

const filename = fileURLToPath(import.meta.url);
const directory = dirname(filename);

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(`${directory}/public`));

app.use('/employees', employeesRouter);

export default app;
