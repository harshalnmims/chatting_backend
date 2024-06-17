const { pgPool } = require("../config/db.js");

const chat = class Chat {
  static userChats(username) {
    let sql = {
      text: `SELECT DISTINCT ON(u.id) u.id, u.firstname, u.lastname,u.contact,m.message_time,
      JSON_AGG(json_build_object(
        'message', m.message,
        'status',(select abbr from message_status where id=m.status and active=true),
        'created',m.created_by 
        ) ORDER BY m.message_time DESC) AS latest_messages,
      (select count(id) from messages where contact_lid=(select id from public.user where contact=$4)
       and user_lid=u.id and 
      status in (select id from message_status where abbr = 'dv' and active=true) and active=true) as message_count
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
            values: [username, username, username,username],
    };
    return pgPool.query(sql);
  }

  static getParticularChats(userPhone, phone) {
    let sql = {
      text: `select m.id,m.message,m.created_by,m.message_time from messages m 
             where user_lid in (select id from public.user where contact=$1) 
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
              returning id as message_id`,
      values: [inputMessage, userId, contact, userId, userId],
    };
    return pgPool.query(sql);
  }

  static getModules() {
    let sql = {
      text: `select id,module_name from modules where active=true`,
    };
    return pgPool.query(sql);
  }

  static getPhoneNumber(id){
    let sql ={
      text : `select contact from public.user where id = $1`,
      values : [id]
    }

    return pgPool.query(sql);
  }

  static updateMsgStatus(messageLid,status){
    let sql ={
      text : `update messages set status = (select id from message_status where abbr=$1) where id =$2`,
      values :[status,messageLid]
    }
    return pgPool.query(sql)
  }

  static getLastMessage(contactId,userId){
    let sql ={
      text : `select id,message,created_by,status from messages where 
              (user_lid = (select id from public.user where contact=$1) 
              and contact_lid = (select id from public.user where contact=$2))
              or (user_lid = (select id from public.user where contact=$3) 
              and contact_lid = (select id from public.user where contact=$4))
              and active=true
              order by message_time desc limit 1`,
      values : [parseInt(contactId),parseInt(userId),parseInt(contactId),parseInt(userId)]
    }
    return pgPool.query(sql);
  }

  static changeMsgStatus(userContactId, contact){
    let sql ={
      text  : `update messages set status=(select id from message_status where abbr='rd' and active=true) where 
      user_lid = $1 and contact_lid = (select id from public.user where contact=$2 and active=true)
      and status = (select id from message_status where abbr = 'dv' and active=true)`,
      values : [contact,userContactId]
    }
    return pgPool.query(sql);
  }

};

module.exports = chat;
