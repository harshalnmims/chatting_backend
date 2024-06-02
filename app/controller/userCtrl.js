const validation = require('../validations/validation.js')
const auth = require('../models/auth.js')

module.exports = {
  login: (req, res) => {
    console.log("request body json", JSON.stringify(req.body));

    return res.status(200).json({ message: "hello world" });
  },

  validateNumber : async(req,res) => {
   
   let {phone} = req.body
   let phoneValidation = validation.phoneNumberValidate(phone);

   if(!phoneValidation){
    return res.status(500).json({message: 'Invalid Phone No.'})
   }




  }
};
