// scripts/seedAdmin.js
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });

    const email = 'admin@codesfortomorrow.com';
    const plain = 'Admin123!@#';

    // generate hash
    const hash = await bcrypt.hash(plain, 10);
    console.log('Generated hash:', hash);

    // check if user exists
    const [rows] = await conn.execute('SELECT id, email FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      // insert user
      await conn.execute(
        'INSERT INTO users (name, email, passwordHash) VALUES (?, ?, ?)',
        ['Admin', email, hash]
      );
      console.log('Inserted admin user');
    } else {
      // update passwordHash
      await conn.execute(
        'UPDATE users SET passwordHash = ? WHERE email = ?',
        [hash, email]
      );
      console.log('Updated admin passwordHash for', email);
    }

    // verify by fetching row and comparing
    const [urows] = await conn.execute('SELECT passwordHash FROM users WHERE email = ?', [email]);
    const stored = urows[0].passwordHash;
    const ok = await bcrypt.compare(plain, stored);
    console.log('Password verify result (should be true):', ok);

    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
