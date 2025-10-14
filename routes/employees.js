const express = require("express");
const { body, validationResult } = require("express-validator");

const supabase = require("../db");
const employees = require("../seed").default;

const router = express.Router();

/**
 * Get all employees
 */
router.get("/", async (_req, res) => {
  const query = await supabase.from("employees").select("*"); // Translates to `SELECT * FROM employees;`
  res.json(query);
});

/**
 * Get a single employee by ID
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const query = await supabase.from("employees").select("*").eq("id", id).single(); // Translates to `SELECT * FROM employees WHERE id = {id};`

  if (query.data === null) {
    return res.status(404).json({ error: "Employee not found" });
  }

  res.json(query.data);
});

/**
 * Update an employee by ID
 */
router.post(
  "/:id",
  [
    body("first_name").optional().isString(),
    body("middle_name").optional().isString(),
    body("last_name").optional().isString(),
    body("employee_type").optional().isIn(["FULL_TIME", "PART_TIME", "CONTRACTOR"]),
    body("salary").optional().isInt({ min: 0 }),
  ],
  async (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const query = await supabase
      .from("employees")
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select(); // Translates to `UPDATE employees SET ... WHERE id = {id} RETURNING *;`

    if (query.error) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json(query.data);
  },
);

/**
 * Seed the database with 10 random employees
 */
router.get("/seed", async (_req, res) => {
  const query = await supabase.from("employees").insert(employees); // Translates to `INSERT INTO employees ... VALUES ...;`
  res.json(query);
});

module.exports = router;
