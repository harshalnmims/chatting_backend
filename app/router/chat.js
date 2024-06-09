const route = require("express").Router();
const chatCtrl = require("../controller/chatCtrl.js")

route.post('/getUserChats',chatCtrl.getUserChats);

module.exports = route;
