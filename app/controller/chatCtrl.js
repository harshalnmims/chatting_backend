const chat = require("../models/chat.js");

module.exports = {
  getUserChats: async (req, res) => {
    try {
      let { username } = req.body;
      console.log("inside chat ctrl ", username);
      let userChats = await chat.userChats(username);
      let chatData = userChats.rowCount > 0 ? userChats.rows : [];

      return res.json({ status: 200, message: chatData });
    } catch (error) {
      console.log(error);
      return res.json({ status: 500, message: "Internal Server Error !" });
    }
  },

  getParticularChats: async (req, res) => {
    try {
      let { userPhone, phoneNumber } = req.body;
      let particularChats = await chat.getParticularChats(
        userPhone,
        phoneNumber
      );
      let chatData = particularChats.rowCount > 0 ? particularChats.rows : [];

      return res.json({ status: 200, messge: chatData });
    } catch (error) {
      console.log(error);
      return res.json({ status: 500, message: "Internal Server Error !" });
    }
  },

  getModules: async (req, res) => {
    try {
      let getUserModules = await chat.getModules();
      let modules = getUserModules.rowCount > 0 ? getUserModules.rows : [];

      return res.json({ status: 200, message: modules });
    } catch (error) {
      console.log(error);
      return res.json({ status: 500, message: "Internal Server Error !" });
    }
  },
};
