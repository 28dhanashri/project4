const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // serve index.html

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin1234",
  database: "employee"
});

db.connect(err => {
  if (err) console.log("DB Connection Error:", err);
  else console.log("Connected to MySQL");
});

/* =============================
   CREATE / ADD EMPLOYEE
============================= */
app.post("/employees", (req, res) => {
  const { name, email, salary, department } = req.body;
  const sql = "INSERT INTO employees (name, email, salary, department) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, email, salary, department], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Employee added successfully", id: result.insertId });
  });
});

/* =============================
   GET ALL EMPLOYEES
============================= */
app.get("/employees", (req, res) => {
  db.query("SELECT * FROM employees", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

/* =============================
   DELETE EMPLOYEE
============================= */
app.delete("/employees/:id", (req, res) => {
  const sql = "DELETE FROM employees WHERE id = ?";
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Employee deleted successfully" });
  });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));