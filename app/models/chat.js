const { pgPool } = require("../config/db.js");

const chat = class Chat{

    static userChats(username){
      let sql = {
        text :`select u.id,u.firstname,u.lastname,u.contact from user_contacts uc inner join public.user u on uc.contact_lid = u.id where 
                uc.user_lid in (select id from public.user where contact = $1) and
                uc.active=true and u.active=true`,
        values : [username]        
      } 
      return pgPool.query(sql) 
    }

}

module.exports = chat;