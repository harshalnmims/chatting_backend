const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  verifyRequest: (req, res) => {
    console.log("verify request");
  },

};
