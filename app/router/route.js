const route = require("express").Router();
const authRouter = require('../router/auth.js');

route.use('/',authRouter)

module.exports = route;
