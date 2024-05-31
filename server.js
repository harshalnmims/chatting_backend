const express = require("express");
const app = express();
const router = require("./app/router/route.js");
const cors = require("cors");

require("dotenv").config();

const { pgPool } = require("./app/config/db.js");
pgPool.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/chat", router);
app.listen("9000", () => {
  console.log("Server is running on port 9000");
});
