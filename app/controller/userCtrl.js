const validation = require("../validations/validation.js");
const auth = require("../models/auth.js");
const email = require("../email/email.js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  login: async (req, res) => {
    try {
      let { username, otp } = req.body;
      let checkPhoneNumber = validation.phoneNumberValidate(username);
      let checkOtp = validation.numberValidate(otp);

      if (!checkPhoneNumber || !checkOtp) {
        return res
          .status(304)
          .json({ status: 304, message: "Invalid Credentials !" });
      }

      let checkOtpTime = await auth.checkOtpTime(username, otp);

      if (!checkOtpTime.otp_status) {
        return res.status(304).json({ status: 304, message: "Invalid Otp" });
      }

      let checkUserOtp = await auth.checkUserOtp(username, otp);

      if (checkUserOtp.rowCount > 0) {
        return res.status(200).json({ status: 200, message: "Valid" });
      } else {
        return res.status(304).json({ status: 304, message: "Invalid Otp !" });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }
  },

  validateNumber: async (req, res) => {
    try {
      let { phone } = req.body;
      let phoneValidation = validation.phoneNumberValidate(phone);

      if (!phoneValidation) {
        return res
          .status(304)
          .json({ status: 304, message: "Invalid Phone No." });
      }

      let userData = await auth.checkPhoneNumber(phone);

      if (userData.rowCount > 0) {
        let otp = Math.floor(10000 + Math.random() * 90000);
        const mail = email.usermail(userData.rows[0].email, otp);

        if (mail == false) {
          return res
            .status(304)
            .json({ status: 304, message: "Failed To Send Otp!" });
        }

        await auth.insertOtp(phone, otp);
        return res.status(200).json({ status: 200, message: userData.rows });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }
  },
};
