const express = require("express");
const app = express();

const server = require("http").Server(app);
const initializeSocket = require("./app/socket/socket.js");
initializeSocket(server);

// const io = require('socket.io')(server,{
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"]
//   }
// });

const router = require("./app/router/route.js");
const cors = require("cors");

require("dotenv").config();

const { pgPool, redisDb } = require("./app/config/db.js");
pgPool.connect();
redisDb.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use("/chat", router);

// io.on('connection', (socket) => {
//   socket.on('message',(userMessage) => {
//    console.log('message received ',userMessage);
//   })
//   socket.emit('user-message','Hello Harsh');

//   socket.on('join',({userId}) => {
//     socket.userId = userId;
//     socket.join(userId);
//     console.log(`${userId} , with socket id `,socket.id);
//   })
// });

server.listen("9000", () => {
  console.log("Server is running on port 9000");
});
