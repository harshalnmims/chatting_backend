const route = require("express").Router();
const authRouter = require('../router/auth.js');
const chatRouter = require('../router/chat.js');

route.use('/',authRouter)
route.use('/',chatRouter)

module.exports = route;
