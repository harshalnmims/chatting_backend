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

      let chatData = await chat.getParticularChats(userContactId, contact);
      await chat.changeMsgStatus(userContactId, contact);
      
      let messages = chatData.rowCount > 0 ? chatData.rows : [];

      socket.emit("userList", { messages });
    });

    socket.on("private message", async ({ inputMessage, contact, userId }) => {
      let message = await chat.sendMessage(inputMessage, contact, userId);

      let messageId = message.rows[0].message_id;
      console.log('message id ',messageId)

      let recivedContact = await chat.getPhoneNumber(contact)
      let receiverContact = recivedContact.rows[0].contact;

      if (users[receiverContact]) {

        socket.to(users[receiverContact]).emit("private message", {
          senderPhoneNumber: socket.userId,
          inputMessage : inputMessage,
          messageLid : messageId,
          // chatUsers : chatUsers
        });

      }

      let chatData = await chat.getParticularChats(userId, contact);
      let updateChat = chatData.rowCount > 0 ? chatData.rows : [];
      socket.emit("updatedChats", { updateChat });

      let userChats = await chat.userChats(userId);
      let chatUsers = userChats.rowCount > 0 ? userChats.rows : [];
      socket.emit("newUserChatList", { chatUsers });

    });

    socket.on("updateMsgStatus",async ({messageLid,status}) => {
      await chat.updateMsgStatus(messageLid,status);
    })

    socket.on('sender Chats',async ({userId}) => {
      let userChatMsg = await chat.userChats(userId);
      let chatUserMsg = userChatMsg.rowCount > 0 ? userChatMsg.rows : [];
      socket.emit('sender msg',{chatUserMsg});
    })

 
  });
};
module.exports = initializeSocket;
