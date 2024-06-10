const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  verifyRequest: (req, res) => {
    console.log("verify request");
  },

  verifyCookie : async (req,res) => {
    try{

      let username = await req.headers['usertoken'];
      console.log('user token ',username)

      let token = process.env.JWT_SECRET;

      let verifyToken = jwt.verify(username,token);

      if(verifyToken == undefined){
        return res.json({status:401,message:'Invalid Token !'})
      }
      
      return res.json({status:200,message:verifyToken})

    }catch(error){
      return res.json({status:500,message:'Internal Server Error !'})
    }
  }

};
