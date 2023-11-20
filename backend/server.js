const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = "secret";

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// ROUTES

// Fetch User Information by user_id
app.get("/user/:user_id", async (req, res) => {
  try {
    const user_id = req.params.user_id;

    // Step 1: Check if the user with the provided user_id exists
    const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      user_id,
    ]);

    if (user.rows.length === 0) {
      return res.status(404).json("User not found");
    }

    // Only send necessary information, not the sensitive ones like password
    const { user_id_, name, email, isHead } = user.rows[0];

    res.json({ user_id_, name, email, isHead });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// User Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 1: Check if the user with the provided email exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("Invalid Credentials");
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!validPassword) {
      return res.status(401).json("Invalid Credentials");
    }

    // Step 2: Generate a JWT token for authentication
    const token = jwt.sign(
      { user_id: user.rows[0].user_id, email: user.rows[0].email },
      secret,
      { expiresIn: "1h" }
    );

    // Include user_id in the response
    res.json({ user_id: user.rows[0].user_id, token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// User Signup
app.post("/signup", async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // Step 1: Check if the user with the provided email already exists
      const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
  
      if (existingUser.rows.length > 0) {
        return res.status(400).json("User already exists with this email");
      }
  
      // Step 2: Encrypt the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Step 3: Add the user with encrypted password to the database
      const newUser = await pool.query(
        "INSERT INTO users (name, email, password, isHead) VALUES($1, $2, $3, $4) RETURNING *",
        [username, email, hashedPassword, 1]
      );
  
      res.json(newUser.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });

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
  
      // Step 1: Check if the family member with the provided email already exists
      const existingMember = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [member_email]
      );
  
      if (existingMember.rows.length > 0) {
        return res.status(400).json("Family member already exists with this email");
      }
  
      // Step 2: Encrypt the family member's password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(member_password, saltRounds);
  
      // Step 3: Add a new user (family member)
      const newUser = await pool.query(
        "INSERT INTO users (name, password, email, isHead) VALUES($1, $2, $3, $4) RETURNING user_id",
        [member_name, hashedPassword, member_email, 0]
      );
  
      const member_id = newUser.rows[0].user_id;
  
      // Step 4: Add a new family member
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
