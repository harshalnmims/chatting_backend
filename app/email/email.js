const nodemailer = require("nodemailer");

module.exports = {
  usermail: (userEmail, otp) => {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "harshnanekar25@gmail.com",
        pass: "jhifbrbkrknmgffl",
      },
    });

    let mailOptions = {
      from: "harshnanekar25@gmail.com",
      to: userEmail,
      subject: "Otp To Login",
      text: `Your Otp To Login Is ${otp}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return false;
      } else {
        console.log("Email Sent");
        return true;
      }
    });
  },
};
