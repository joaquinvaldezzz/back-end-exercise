import express from 'express';

import type { Router } from 'express';

const employeesRoute: Router = express.Router();

employeesRoute.get('/', (_req, res) => {
  res.json({ message: 'Employees route' });
});

export default employeesRoute;
