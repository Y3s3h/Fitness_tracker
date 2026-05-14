const express = require("express");
const router = express.Router();
const pool = require("../db");

// ─────────────────────────────────────────────
// POST /api/progress/update
// Upsert a metric for a specific user + program
// ─────────────────────────────────────────────
router.post("/update", async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: "Request body is required" });
  }

  const { user_id, program_type, program_id, metric_name, value } = req.body;

  // Validate all fields present
  if (
    !user_id ||
    !program_type ||
    !program_id ||
    !metric_name ||
    value === undefined
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO progress_records 
         (user_id, program_type, program_id, metric_name, value)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, program_type, program_id, metric_name)
       DO UPDATE SET 
         value = EXCLUDED.value,
         updated_at = NOW()
       RETURNING *`,
      [user_id, program_type, program_id, metric_name, value],
    );

    res.status(200).json({ success: true, record: result.rows[0] });
  } catch (err) {
    console.error("POST error:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// ─────────────────────────────────────────────
// GET /api/progress/:user_id?program_type=X&program_id=Y
// Fetch ONLY records for this user + program combo
// ─────────────────────────────────────────────
router.get("/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const { program_type, program_id } = req.query;

  if (!program_type || !program_id) {
    return res
      .status(400)
      .json({ error: "program_type and program_id are required" });
  }

  try {
    const result = await pool.query(
      `SELECT metric_name, value, updated_at
       FROM progress_records
       WHERE user_id = $1
         AND program_type = $2
         AND program_id = $3
       ORDER BY updated_at DESC`,
      [user_id, program_type, program_id],
    );

    res.status(200).json({ records: result.rows });
  } catch (err) {
    console.error("GET error:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
