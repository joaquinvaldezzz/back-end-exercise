const express = require('express');
const { body, validationResult } = require('express-validator');

const supabase = require('../lib/db');
const employees = require('../lib/seed');

const router = express.Router();

/**
 * @param {number} min Minimum integer value
 * @param {number} max Maximum integer value
 * @returns {number} A random integer between min and max (inclusive)
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + min;
}

getRandomInt(1, 10);

router.post(
  '/',
  [
    body('first_name').isString().notEmpty(),
    body('middle_name').optional().isString(),
    body('last_name').isString().notEmpty(),
    body('employee_type').isIn(['FULL_TIME', 'PART_TIME', 'CONTRACTOR']),
    body('salary').isInt({ min: 0 }),
  ],

  /**
   * @param {express.Request} request This parameter is used to get the request data
   * @param {express.Response} response This parameter is used to send the response
   * @returns {Promise<express.Response>} The response object
   */
  async (request, response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    try {
      const query = await supabase.from('employees').insert(request.body).select(); // Translates to `INSERT INTO employees ... VALUES ... RETURNING *;`

      if (query.error) {
        return response.status(500).json({ error: query.error.message || 'Database error' });
      }

      return response.status(201).json({
        message: 'Employee created successfully',
        employee: query.data[0],
      });
    } catch (error) {
      return response.status(500).json({ error: error.message || 'Database error' });
    }
  },
);

/** Get all employees */
router.get('/', async (_req, res) => {
  try {
    const query = await supabase.from('employees').select('*'); // Translates to `SELECT * FROM employees;`

    if (query.error) {
      return res.status(500).json({ error: query.error.message || 'Database error' });
    }

    return res.json({
      message: 'Employees retrieved successfully',
      employees: query.data,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Database error' });
  }
});

/** Get a single employee by ID */
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const query = await supabase.from('employees').select('*').eq('id', id); // Translates to `SELECT * FROM employees WHERE id = {id};`

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
    return res.status(500).json({ error: error.message || 'Database error' });
  }
});

/** Update an employee by ID */
router.patch(
  '/:id',
  [
    body('first_name').optional().isString(),
    body('middle_name').optional().isString(),
    body('last_name').optional().isString(),
    body('employee_type').optional().isIn(['FULL_TIME', 'PART_TIME', 'CONTRACTOR']),
    body('salary').optional().isInt({ min: 0 }),
  ],

  /**
   * @param {express.Request} request
   * @param {express.Response} response
   * @returns {Promise<express.Response>}
   */
  async (request, response) => {
    const id = parseInt(request.params.id, 10);
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    try {
      const query = await supabase
        .from('employees')
        .update({ ...request.body, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select(); // Translates to `UPDATE employees SET ... WHERE id = {id} RETURNING *;`

      if (query.error) {
        return response.status(500).json({ error: query.error.message || 'Database error' });
      }

      if (query.data == null || query.data.length === 0) {
        return response.status(404).json({ message: 'Employee not found' });
      }

      return response.json({
        message: 'Employee updated successfully',
        employee: query.data[0],
      });
    } catch (error) {
      return response.status(500).json({ error: error.message || 'Database error' });
    }
  },
);

/** Delete an employee by ID */
router.delete(
  '/:id',
  body('id').isInt({ min: 1 }),

  /**
   * @param {express.Request} request
   * @param {express.Response} response
   * @returns {Promise<express.Response>}
   */
  async (request, response) => {
    const id = parseInt(request.params.id, 10);

    try {
      const query = await supabase.from('employees').delete().eq('id', id).select(); // Translates to `DELETE FROM employees WHERE id = {id} RETURNING *;`

      if (query.error) {
        return response.status(500).json({ error: query.error.message || 'Database error' });
      }

      if (query.data == null || query.data.length === 0) {
        return response.status(404).json({ message: 'Employee not found' });
      }

      return response.json({ message: 'Employee deleted successfully', employee: query.data[0] });
    } catch (error) {
      return response.status(500).json({ error: error.message || 'Database error' });
    }
  },
);

module.exports = router;
