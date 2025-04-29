import { createServer, IncomingMessage, ServerResponse } from "http";
import { Namespace, Server } from "socket.io";
import { render } from "ejs";

import { writeData } from "./config/connectDB";
import { readFile, readImageFile } from "./model/readFile";
import { readDataBody } from "./model/readData";

// Buat server HTTP
const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  //======Page Start=======
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    const htmlTemplate = render(readFile("dashboard.ejs", "html"));
    res.end(htmlTemplate);
  } else if (req.url === "/login") {
    res.writeHead(200, { "Content-Type": "text/html" });
    const htmlTemplate = render(readFile("auth/login.ejs", "html"));
    res.end(htmlTemplate);
  } else if (req.url === "/chat") {
    res.writeHead(200, { "Content-Type": "text/html" });
    const htmlTemplate = render(readFile("chat.ejs", "html"));
    res.end(htmlTemplate);
  } else if (req.url === "/sendLogin" && req.method == "POST") {
    readDataBody(req, res, writeData);

    //======Page End=======

    // pengelolaan file css
  } else if (req.url?.startsWith("/css/")) {
    const filename = req.url.split("/css/")[1]; // Ekstrak nama file CSS
    try {
      let contentCss = readFile(filename, "css");
      res.writeHead(200, { "Content-Type": "text/css" });
      res.end(contentCss);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("<h3> file css not found </h3>");
    }

    // pengelolaan file js
  } else if (req.url?.startsWith("/js/")) {
    const filename = req.url.split("/js/")[1]; // Ekstrak nama file JS
    try {
      let contentJs = readFile(filename, "js");
      res.writeHead(200, { "Content-Type": "application/javascript" });
      res.end(contentJs);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("<h3> file js not found </h3>");
    }
    // halman tidak di temukan
  } else if (req.url?.startsWith("/img/")) {
    const filename = req.url.split("/img/")[1]; // Ekstrak nama file JS

    try {
      let counternImg = readImageFile(filename);
      res.writeHead(200, { "Content-Type": "image/png" });
      res.end(counternImg);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("<h3> file img not found </h3>");
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
    return;
  }
});

// Integrasi Socket.IO dengan server HTTP
const io = new Server(server);

// Tangani event Socket.IO
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("chat", (msg) => {
    console.log("Message from client:", msg);
    socket.emit("response", msg);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Jalankan server HTTP
server.listen(5005, () => {
  console.log("Server running at http://127.0.0.1:5005");
});
