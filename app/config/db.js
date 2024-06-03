const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

console.log("postgres ", process.env.DB_PASSWORD);

const pgPool = new Pool({
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

module.exports = { pgPool };
