const { pgPool } = require("../config/db.js");

const model = class Auth {
  static async checkPhoneNumber(phone) {
    let sql = {
      text: "select * from public.user where contact = $1",
      values: [phone],
    };

    return pgPool.query(sql);
  }

  static async insertOtp(phone, otp) {
    let sql = {
      text: `insert into user_login(otp,user_lid,otp_time,created_by)
      values($1,(select id from public.user where contact=$2),now(),$3)`,
      values: [otp, phone, phone],
    };

    return pgPool.query(sql);
  }

  static async checkOtpTime(username, otp) {
    let sql = {
      text: `SELECT *,
       CASE 
         WHEN EXTRACT(EPOCH FROM (NOW() - otp_time)) / 60 <= 15 THEN 'Valid'
         ELSE 'Invalid' 
       END AS otp_status 
        FROM user_login 
        WHERE user_lid=(select id from public.user where contact=$1)
          AND otp=$2
          AND DATE(created_date)=DATE(NOW()) 
        ORDER BY otp_time DESC 
        LIMIT 1 `,
      values: [username, otp],
    };

    return pgPool.query(sql);
  }

  static async checkUserOtp(username, otp) {
    let sql = {
      text: "select * from user_login where user_lid = (select id from public.user where contact=$1) and otp = $2",
      values: [username, otp],
    };
    return pgPool.query(sql);
  }
};

module.exports = model;
