const chat = require("../models/chat.js");

const initializeSocket = async (server) => {
  const users = {};
  const userStatus = {};

  const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {

    socket.on("getUserChats", async ({ username }) => {
      let userChats = await chat.userChats(username);
      let chatData = userChats.rowCount > 0 ? userChats.rows : [];
      console.log("user chats ", JSON.stringify(chatData));
      socket.emit("userChatList", { chatData });
    });

    socket.on("join", ({ userId }) => {
      socket.userId = userId;
      socket.join(userId);
      users[userId] = socket.id;
      console.log(`${userId} , with socket id `, socket.id);
    });

    socket.on("fetchMessage", async ({ userContactId, contact }) => {
      console.log("user contact ", userContactId, contact);

      let chatData = await chat.getParticularChats(userContactId, contact);
      let messages = chatData.rowCount > 0 ? chatData.rows : [];

      socket.emit("userList", { messages });
    });

    socket.on("private message", async ({ inputMessage, contact, userId }) => {
      console.log("inside private message ");
      let message = await chat.sendMessage(inputMessage, contact, userId);

      let messageId = message.rows[0].message_id;
      console.log('message id ',messageId)

      let recivedContact = await chat.getPhoneNumber(contact)
      let receiverContact = recivedContact.rows[0].contact;

      if (users[receiverContact]) {
        socket.to(users[receiverContact]).emit("private message", {
          senderPhoneNumber: socket.userId,
          inputMessage : inputMessage,
          messageLid : messageId
        });
      }

      let chatData = await chat.getParticularChats(userId, contact);
      // console.log("user message ", chatData.rows);
      let updateChat = chatData.rowCount > 0 ? chatData.rows : [];
      socket.emit("updatedChats", { updateChat });
    });

    socket.on("updateMsgStatus",async ({messageLid,status}) => {
     let updateStatus = await chat.updateMsgStatus(messageLid,status);
    //  socket.messageLid = messageLid;
    //  socket.join(messageLid)
    //  userStatus[messageLid] = socket.id;

    //  console.log('socket message Id ',socket.messageLid)
    //  socket.to(userStatus[messageLid]).emit('updatedMsgStatus',{
    //   messageLid : socket.messageLid,
    //   status : status  
    //  })
    })

  });
};
module.exports = initializeSocket;
