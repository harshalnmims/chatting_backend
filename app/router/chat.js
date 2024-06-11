const route = require("express").Router();
const chatCtrl = require("../controller/chatCtrl.js");

route.post("/getUserChats", chatCtrl.getUserChats);
route.post("/getParticularChats", chatCtrl.getParticularChats);
route.get("/getModules", chatCtrl.getModules);

module.exports = route;
