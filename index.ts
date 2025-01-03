import { createServer, IncomingMessage, ServerResponse } from "http";
import { Namespace, Server } from "socket.io";
import { readFileSync } from "fs";
import path from "path";
import { writeData, createColllections } from "./connectDB";

//fungsi
function readHtmlFile(fileName: string): string {
  const filePath = path.join(__dirname, "public", "html", fileName);
  try {
    return readFileSync(filePath, "utf-8");
  } catch (error) {
    return `<h1>File ${fileName} not found</h1>`;
  }
}
function readCssFile(filename: string) {
  const filePath = path.join(__dirname, "public", "css", filename);
  try {
    return readFileSync(filePath, "utf-8");
  } catch (error) {
    return "kenapa mau tau ya file css nya ";
  }
}
function readFileJs(filename: string) {
  const filePath = path.join(__dirname, "public", "js", filename);
  try {
    return readFileSync(filePath, "utf-8");
  } catch (error) {
    return "kenapa mau tau ya file js nya";
  }
}

const readDataBody = (
  req: IncomingMessage,
  res: ServerResponse,
  callback: (username: string, password: string, number: string) => void
) => {
  let body = "";
  console.log("data bosy", body);
  // Menerima data secara bertahap
  req.on("data", (chunk) => {
    body += chunk.toString(); // Tambahkan data ke body
  });
  req.on("end", () => {
    try {
      const parsedData = JSON.parse(body);
      const { username, password, number } = parsedData;
      console.log("Data received:", parsedData);
      callback(username, password, number);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Form submitted successfully!" }));
    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid JSON data!" }));
    }
  });
};

// Buat server HTTP
const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  //======Halaman Dashbord start =======
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(readHtmlFile("dashboard.html"));
    //=========halaman Dasbord end =============

    // ========= Halaman Login start ==========
  } else if (req.url === "/login") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(readHtmlFile("login.html"));
  } else if (req.url === "/sendLogin" && req.method == "POST") {
    readDataBody(req, res, writeData);
    //=========halaman Login end =========

    // ========= Halaman chat start ==========
  } else if (req.url === "/chat") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(readHtmlFile("chat.html"));
    // =========== Halama chat end =========

    // pengelolaan file css
  } else if (req.url?.startsWith("/css/")) {
    const filename = req.url.split("/css/")[1]; // Ekstrak nama file CSS
    let contentCss = readCssFile(filename);
    try {
      res.writeHead(200, { "Content-Type": "text/css" });
      res.end(contentCss);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("<h3> file css not found </h3>");
    }

    // pengelolaan file js
  } else if (req.url?.startsWith("/js/")) {
    const filename = req.url.split("/js/")[1]; // Ekstrak nama file JS
    let contentJs = readFileJs(filename);
    try {
      res.writeHead(200, { "Content-Type": "application/javascript" });
      res.end(contentJs);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("<h3> file js not found </h3>");
    }
    // halman tidak di temukan
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
server.listen(3002, () => {
  console.log("Server running at http://localhost:3002");
});
