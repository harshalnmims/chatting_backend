const route = require("express").Router();
const userCtrl = require("../controller/userCtrl.js");
const auth = require("../middleware/request.js")

route.post("/login", userCtrl.checklogin);
route.post("/validateNumber", userCtrl.validateNumber);
route.get('/verifyCookie',auth.verifyCookie);

module.exports = route;
