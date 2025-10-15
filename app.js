import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import employeesRouter from './routes/employees.js';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('./public'));

app.use('/employees', employeesRouter);

export default app;
