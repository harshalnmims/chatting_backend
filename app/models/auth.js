const {pgPool} = require('../config/db.js');

const model = class Auth {

   static async checkPhoneNumber(phone){
    let sql = {
     text : 'select * from public.user where phone = $1',
     values:[phone]
    }

    return pgPool.query(sql);
   } 

}

module.exports = model;