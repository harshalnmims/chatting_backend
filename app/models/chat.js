const { pgPool } = require("../config/db.js");

const chat = class Chat {
  static userChats(username) {
    let sql = {
      text: `select u.id,u.firstname,u.lastname,u.contact from user_contacts uc inner join public.user u on uc.contact_lid = u.id where 
                uc.user_lid in (select id from public.user where contact = $1) and
                uc.active=true and u.active=true`,
      values: [username],
    };
    return pgPool.query(sql);
  }

  static getParticularChats(userPhone, phone) {
    let sql = {
      text: `select m.id,m.message from messages m where user_lid in (select id from public.user where contact=$1) 
              and contact_lid =$2 or user_lid =$3
              and contact_lid in (select id from public.user where contact=$4) and m.active=true`,
      values: [userPhone, phone, phone, userPhone],
    };
    return pgPool.query(sql);
  }

  static sendMessage(inputMessage, contact, userId) {
    let sql = {
      text: ` insert into messages(message,user_lid,contact_lid,created_by,modified_by,message_time)
              values($1,(select id from public.user where contact=$2),$3,$4,$5,now())
              returning (select contact from public.user where id = $6) as contact`,
      values: [inputMessage, userId, contact, userId, userId, contact],
    };
    return pgPool.query(sql);
  }

  static getModules() {
    let sql = {
      text: `select id,module_name from modules where active=true`,
    };
    return pgPool.query(sql);
  }
};

module.exports = chat;
