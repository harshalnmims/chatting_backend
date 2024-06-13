const { pgPool } = require("../config/db.js");

const chat = class Chat {
  static userChats(username) {
    let sql = {
      text: `SELECT DISTINCT ON(u.id) u.id, u.firstname, u.lastname,u.contact,m.message_time
      FROM messages m
      INNER JOIN public.user u ON (u.id = m.contact_lid OR u.id = m.user_lid)
      WHERE m.active = true
        AND u.active = true
        AND u.contact <> $1
        AND (
          m.contact_lid IN (SELECT id FROM public.user WHERE contact = $2 AND active = true)
          OR m.user_lid IN (SELECT id FROM public.user WHERE contact = $3 AND active = true)
        )
        group by m.id,u.id, u.firstname, u.lastname,u.contact,m.message_time order by u.id,m.message_time desc `,
            values: [username, username, username],
    };
    return pgPool.query(sql);
  }

  static getParticularChats(userPhone, phone) {
    let sql = {
      text: `select m.id,m.message,m.created_by,m.message_time from messages m where user_lid in (select id from public.user where contact=$1) 
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
