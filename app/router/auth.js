const route = require("express").Router();
const userCtrl = require("../controller/userCtrl.js");
const auth = require("../middleware/request.js")

route.post("/login", userCtrl.checklogin);
route.post("/validateNumber", userCtrl.validateNumber);
route.post("/setToken",auth.setToken);

module.exports = route;
