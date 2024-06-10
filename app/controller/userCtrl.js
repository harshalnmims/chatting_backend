const validation = require("../validations/validation.js");
const auth = require("../models/auth.js");
const email = require("../email/email.js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  checklogin: async (req, res) => {
    let { username, otp } = req.body;
    console.log(JSON.stringify(req.body));

    try {
      let checkPhoneNumber = await validation.phoneNumberValidate(username);
      let checkOtp = validation.numberValidate(otp);

      console.log("validations ", checkPhoneNumber, checkOtp);

      if (!checkPhoneNumber || !checkOtp) {
        return res.json({ status: 400, message: "Invalid Credentials !" });
      }

      let validateOtp = await auth.checkUserOtp(username, otp);

      if (validateOtp.rowCount == 0) {
        return res.json({ status: 400, message: "Invalid Otp !" });
      }

      let checkOtpTime = await auth.checkOtpTime(username, otp);
      console.log("Otp Time ", JSON.stringify(checkOtpTime.rows[0]));

      if (checkOtpTime.rows[0].otp_status === "Invalid") {
        return res.json({ status: 400, message: "Otp Expired !" });
      }

      let token = process.env.JWT_SECRET;
      let payload = { username };
      let jwtResponse = jwt.sign(payload, token, { expiresIn: "1 day" });
      console.log("jwt response ", jwtResponse);

      return res.json({ status: 200, token: jwtResponse});

      
    } catch (error) {
      console.log(error);
      return res.json({ status: 500, message: "Internal Server Error !" });
    }
  },

  validateNumber: async (req, res) => {
    try {
      let { phone } = req.body;
      let phoneValidation = await validation.phoneNumberValidate(phone);
      console.log("phone number validation ", phoneValidation);

      if (!phoneValidation) {
        return res
          .status(400)
          .json({ status: 400, message: "Invalid Phone No. !" });
      }

      let userData = await auth.checkPhoneNumber(phone);

      if (userData.rowCount > 0) {
        let otp = Math.floor(10000 + Math.random() * 90000);
        const mail = email.usermail(userData.rows[0].email, otp);

        if (mail == false) {
          return res
            .status(400)
            .json({ status: 400, message: "Failed To Send Otp !" });
        }

        await auth.insertOtp(phone, otp);
        return res.status(200).json({ status: 200, message: userData.rows });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error !" });
    }
  },

};
