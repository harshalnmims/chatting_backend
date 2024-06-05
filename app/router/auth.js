const route = require("express").Router();
const userCtrl = require("../controller/userCtrl.js");

route.post("/login", userCtrl.checklogin);
route.post("/validateNumber", userCtrl.validateNumber);

module.exports = route;
