const validation = require("../validations/validation.js");
const auth = require("../models/auth.js");
const email = require("../email/email.js");

module.exports = {
  login: (req, res) => {
    console.log("request body json", JSON.stringify(req.body));

    try {
      return res.json({ status: 200, message: "hello world" });
    } catch (error) {
      return res.json({ status: 500, message: "hello world" });
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
