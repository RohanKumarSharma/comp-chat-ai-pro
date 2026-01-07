require('dotenv').config();
const app = require('./src/app');
const { createServer } = require("http");
const { Server } = require("socket.io"); //ye socket io ka ek tarah se boiler plate hai ek tarah ka samjho 
const generateResponse = require('./src/service/ai.service');

const httpServer = createServer(app);
const io = new Server(httpServer);


io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect",() => {
    console.log("A user disconnected");
  });

  socket.on("ai-message", async (data) => {
    console.log("Message received");
    console.log("Received AI message",data.prompt);
    const response = await generateResponse(data.prompt);
    console.log("Ai-Response:", response);
    socket.emit("ai-message-response", { response });
  });
});

httpServer.listen(3000, () => {
    console.log('Server is running on port 3000');
})