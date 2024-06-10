const chat = require("../models/chat.js")

module.exports = {
 
  getUserChats : async (req,res) => {
    try {
     let {userId} = req.body ;
     let userChats = await chat.userChats(userId);
     let chatData = userChats.rowCount > 0 ? userChats.rows : [];
     
     return res.json({status : 200, message : chatData})
        
    } catch (error) {
      console.log(error)  
      return res.json({ status: 500, message: 'Internal Server Error !' });
    }
  }


}