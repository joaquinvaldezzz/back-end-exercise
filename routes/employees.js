const express = require("express");
const supabase = require("../db");
const employees = require("../seed").default;

const router = express.Router();

/**
 * Get all employees
 */
router.get("/", async (_req, res) => {
  const request = await supabase.from("employees").select("*"); // Translates to `SELECT * FROM employees;`
  res.json(request);
});

/**
 * Get a single employee by ID
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const request = await supabase
    .from("employees")
    .select("*")
    .eq("id", id)
    .single(); // Translates to `SELECT * FROM employees WHERE id = {id};`

  if (request.data === null) {
    return res.status(404).json({ error: "Employee not found" });
  }

  res.json(request.data);
});

/**
 * Seed the database with 10 random employees
 */
router.get("/seed", async (_req, res) => {
  const data = await supabase.from("employees").insert(employees); // Translates to `INSERT INTO employees ... VALUES ...;`
  res.json(data);
});

module.exports = router;
