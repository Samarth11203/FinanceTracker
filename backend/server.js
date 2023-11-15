const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// ROUTES

// Add User
app.post("/users", async (req, res) => {
  try {
    const { username, password, email} = req.body;

    const newUser = await pool.query(
      "INSERT INTO users (name, password, email, isHead) VALUES($1, $2, $3, $4) RETURNING *",
      [username, password, email, 1]
    );

    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Add Family Member
app.post("/family-members", async (req, res) => {
  try {
    const { member_name, relationship, user_id, member_password, member_email } = req.body;

    // Step 1: Add a new user
    const newUser = await pool.query(
      "INSERT INTO users (name, password, email, isHead) VALUES($1, $2, $3, $4) RETURNING user_id",
      [member_name, member_password, member_email, 0]
    );

    const member_id = newUser.rows[0].user_id;

    // Step 2: Add a new family member
    const newFamilyMember = await pool.query(
      "INSERT INTO family_members (member_id, user_id, relationship, member_name) VALUES($1, $2, $3, $4) RETURNING *",
      [member_id, user_id, relationship, member_name]
    );

    res.json(newFamilyMember.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Add Budget
app.post("/budgets", async (req, res) => {
    try {
      const { user_id, budget_name, budget_amount } = req.body;
  
      const newBudget = await pool.query(
        "INSERT INTO budgets (user_id, budget_name, budget_amount) VALUES($1, $2, $3) RETURNING *",
        [user_id, budget_name, budget_amount]
      );
  
      res.json(newBudget.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });
  
// Add Expense
app.post("/expenses", async (req, res) => {
    try {
      const { user_id, budget_id, expense_name, expense_amount } = req.body;
  
      const newExpense = await pool.query(
        "INSERT INTO expenses (user_id, budget_id, expense_name, expense_amount) VALUES($1, $2, $3, $4) RETURNING *",
        [user_id, budget_id, expense_name, expense_amount]
      );
  
      res.json(newExpense.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });
  
app.listen(5000, () => {
  console.log("server has started on port 5000");
});
