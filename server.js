const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods ','GET,POST,PUT,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers','Content-Type','Authorization');
  next(); 
})


const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
      origin: "http://localhost:3000", // client address 
      //origin: "*"
  },
});

//const io = socketIo(server);

let interval;

io.on("connection", (socket) => {
  console.log("New client connected. ID ="+ socket.id);
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};



server.listen(port, () => console.log(`Listening on port ${port}`));