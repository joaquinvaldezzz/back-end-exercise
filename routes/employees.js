const express = require("express");
const supabase = require("../db");
const employees = require("../seed").default;

const router = express.Router();

/**
 * Get all employees
 */
router.get("/", async (_req, res) => {
  const data = await supabase.from("employees").select("*");

  res.json(data);
});

/**
 * Seed the database with 10 random employees
 */
router.get("/seed", async (_req, res) => {
  const data = await supabase.from("employees").insert(employees);
  res.json(data);
});

module.exports = router;
