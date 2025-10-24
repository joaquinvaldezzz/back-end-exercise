import express, { Router } from 'express';

const router: Router = express.Router();

router.get('/', (_req, res) => {
  res.json({ message: 'Employees route' });
});

export default router;
