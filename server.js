require("dotenv").config();
const app = require("./src/app");
const { createServer } = require("http");
const { Server } = require("socket.io"); //ye socket io ka ek tarah se boiler plate hai ek tarah ka samjho
const generateResponse = require("./src/service/ai.service");

const httpServer = createServer(app);
const io = new Server(httpServer, {
  
  cors: {
    origin: "http://localhost:5173", // ye origin hai jaha se humara frontend chal raha hai
  },

});

const chatHistory = [];

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  // ye ai-message event ko listen kar raha hai mtlb jab bhi client se ai-message event aayega to ye function chalega
  socket.on("ai-message", async (data) => {
    console.log("Message received");
    console.log("Received AI message", data);

// jo question user ne pucha hai use hum chatHistory me add kar rahe hai
    chatHistory.push({
      role: "user",
      parts: [{ text: data }],
    });
// ab hum ai se response generate kar rahe hai 
    const response = await generateResponse(chatHistory);

// jo response ai ne diya hai use bhi chatHistory me add kar rahe hai
    chatHistory.push({
      role: "model",
      parts: [{ text: response }],
    });
// ab hum console me ai ka response dekh rahe hai
    console.log("Ai-Response:", response);
    // ab hum response ko wapas client ko bhej rahe hai
    socket.emit("ai-message-response", { response });
  });
});

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
