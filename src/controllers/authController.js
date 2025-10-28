

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models/index');
require('dotenv').config();


// =================== NORMAL LOGIN (bcrypt) ===================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("  Missing email or password");
      return res.status(400).json({ message: 'Email and password are required' });
    }

    console.log("\n=====  LOGIN ATTEMPT =====");
    console.log(" Email:", email);
    console.log(" Entered Password:", password);

    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log(" No user found with this email in database.");
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log(" User found:", user.email);
    console.log(" Stored Hash:", user.passwordHash);

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    console.log(" Password Match Result:", isMatch);

    if (!isMatch) {
      console.log(" Password does not match!");
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    console.log(" Login successful for:", email);
    console.log("==============================\n");

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error(" LOGIN ERROR:", err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const devLogin = async (req, res) => {
  console.log("\n=====  DEV LOGIN ATTEMPT =====");

  // Check if allowed from .env
  if (process.env.ENABLE_PLAIN_LOGIN !== 'true') {
    console.log(" Dev login is disabled! Set ENABLE_PLAIN_LOGIN=true in .env to use.");
    return res.status(403).json({ message: 'Dev login is disabled' });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    console.log("Missing email or password");
    return res.status(400).json({ message: 'Email and password required' });
  }

  console.log(" Email:", email);
  console.log(" Plain Password:", password);

  // Check email in DB
  const user = await User.findOne({ where: { email } });
  if (!user) {
    console.log(" No user found in DB");
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Compare plain password directly with env password
  const expected = process.env.DEV_ADMIN_PASSWORD;
  if (password !== expected) {
    console.log(" Password mismatch (plain check)");
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  console.log(" Plain password matched! Generating token...");

  const payload = { id: user.id, email: user.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  console.log(" Dev Login Successful:", email);
  console.log("==============================\n");

  return res.status(200).json({
    message: 'Dev login successful (no bcrypt)',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
};

module.exports = { login, devLogin };


