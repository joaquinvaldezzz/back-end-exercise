import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';

import '@dotenvx/dotenvx';

import employeesRouter from './routes/employees';

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
