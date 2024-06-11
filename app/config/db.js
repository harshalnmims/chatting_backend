const { Pool } = require("pg");
const { createClient } = require("redis");
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

const redisDb = createClient({
  host: "localhost",
  port: 6379,
  password: "",
});

module.exports = { pgPool, redisDb };
