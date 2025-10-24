import express from 'express';
import { body, param, validationResult } from 'express-validator';

import supabase from '@/config/supabase.js';

import type { Request, Response, Router } from 'express';

const employeesRoute: Router = express.Router();

/** Creates a new employee */
async function createEmployee(req: Request, res: Response) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const query = await supabase.from('employees').insert(req.body).select();

    if (query.error) {
      return res.status(500).json({ error: query.error.message || 'Database error' });
    }

    return res.status(201).json({
      message: 'Employee created successfully',
      employee: query.data[0],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ error: message || 'Database error' });
  }
}

/** Retrieves all employees */
async function getAllEmployees(_req: Request, res: Response) {
  try {
    const query = await supabase.from('employees').select('*');

    if (query.error) {
      return res.status(500).json({ error: query.error.message || 'Database error' });
    }

    return res.json({
      message: 'Employees retrieved successfully',
      employees: query.data,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ error: message || 'Database error' });
  }
}

/** Retrieves an employee by ID */
async function getEmployeeById(req: Request, res: Response) {
  const { id } = req.params;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const query = await supabase.from('employees').select('*').eq('id', id);

    if (query.error) {
      return res.status(500).json({ error: query.error.message || 'Database error' });
    }

    if (query.data == null || query.data.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    return res.json({
      message: 'Employee retrieved successfully',
      employee: query.data[0],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ error: message || 'Database error' });
  }
}

/** Updates an employee by ID */
async function updateEmployeeById(req: Request, res: Response) {
  const { id } = req.params;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const query = await supabase
      .from('employees')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(); // Translates to `UPDATE employees SET ... WHERE id = {id} RETURNING *;`

    if (query.error) {
      return res.status(500).json({ error: query.error.message || 'Database error' });
    }

    if (query.data == null || query.data.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    return res.json({
      message: 'Employee updated successfully',
      employee: query.data[0],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ error: message || 'Database error' });
  }
}

/** Deletes an employee by ID */
async function deleteEmployeeById(req: Request, res: Response) {
  const { id } = req.params;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const query = await supabase.from('employees').delete().eq('id', id).select(); // Translates to `DELETE FROM employees WHERE id = {id} RETURNING *;`

    if (query.error) {
      return res.status(500).json({ error: query.error.message || 'Database error' });
    }

    if (query.data == null || query.data.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    return res.json({ message: 'Employee deleted successfully', employee: query.data[0] });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ error: message || 'Database error' });
  }
}

/** Routes definitions for /employees endpoint */

employeesRoute.post(
  '/',
  [
    body('first_name').isString().notEmpty(),
    body('middle_name').optional().isString(),
    body('last_name').isString().notEmpty(),
    body('employee_type').isIn(['FULL_TIME', 'PART_TIME', 'CONTRACTOR']),
    body('salary').isInt({ min: 0 }),
  ],
  createEmployee,
);
employeesRoute.get('/', getAllEmployees);
employeesRoute.get('/:id', [param('id').isInt({ min: 1 })], getEmployeeById);
employeesRoute.patch(
  '/:id',
  [
    body('first_name').optional().isString(),
    body('middle_name').optional().isString(),
    body('last_name').optional().isString(),
    body('employee_type').optional().isIn(['FULL_TIME', 'PART_TIME', 'CONTRACTOR']),
    body('salary').optional().isInt({ min: 0 }),
  ],
  updateEmployeeById,
);
employeesRoute.delete('/:id', [body('id').isInt({ min: 1 })], deleteEmployeeById);

export default employeesRoute;
