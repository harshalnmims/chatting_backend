const chat = require("../models/chat.js");

const initializeSocket = async (server) => {
  const users = {};

  const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    // socket.on("message", (userMessage) => {
    //   console.log("message received ", userMessage);
    // });
    // socket.emit("user-message", "Hello Harsh");

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
      let receiverContact = message.rows[0].contact;

      if (users[receiverContact]) {
        socket.to(users[receiverContact]).emit("private message", {
          senderPhoneNumber: socket.userId,
          inputMessage,
        });
      }

      let chatData = await chat.getParticularChats(userId, contact);
      console.log("user message ", chatData.rows);
      let updateChat = chatData.rowCount > 0 ? chatData.rows : [];
      socket.emit("updatedChats", { updateChat });
    });
  });
};
module.exports = initializeSocket;
