import { createServer, IncomingMessage, ServerResponse } from "http";
import { Server } from "socket.io";
import { render } from "ejs";
import * as url from "url";
import { writeData } from "./config/connectDB";
import { readFile, readImageFile } from "./model/readFile";
import { readDataBody } from "./model/readData";

import { SaveUserData, CekDataNomor, GetAllData } from "./config/dataFile";

const MainUrl: Record<string, string> = {
  dashboard: "/",
  login: "/user/login",
  register: "/user/register",
  chat: "/chat",
};

const ISLOGIN: boolean = false;

// Buat server HTTP
const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  const parsedUrl = url.parse(req.url || "", true); // `req.url` bisa undefined
  const path = parsedUrl.pathname;
  //======Page Start=======
  if (path === MainUrl.dashboard) {
    res.writeHead(200, { "Content-Type": "text/html" });
    const htmlTemplate = render(readFile("dashboard.ejs", "html"));
    res.end(htmlTemplate);
  } else if (path === MainUrl.login) {
    if (req.method == "GET") {
      res.writeHead(200, { "Content-Type": "text/html" });
      const htmlTemplate = render(readFile("auth/login.ejs", "html"));
      res.end(htmlTemplate);
    } else if (req.method == "POST") {
      console.log("method post di login di jalankan");
      readDataBody(req, res, (username, password, number) => {
        CekDataNomor(parseInt(number)).then((result) => {
          if (result) {
            res.writeHead(303, {
              location:
                MainUrl.chat + "?nomorUser=" + number + "&namaUser=" + username,
            });
            res.end();
          } else {
            res.writeHead(401, { "Content-Type": "text/plain" });
            res.end("Nomor tidak ditemukan"); //errro sementara saat ini
          }
        });
      });
    }
  } else if (path === MainUrl.register) {
    if (req.method == "GET") {
      res.writeHead(200, { "Content-Type": "text/html" });

      const htmlTemplate = render(readFile("auth/register.ejs", "html"));

      res.end(htmlTemplate);
    } else if (req.method == "POST") {
      console.log("bagina post register jalan");
      readDataBody(req, res, (username, password, phone) => {
        console.log("Data received:", username, password, phone);
        //  writeData(username, password, number);
        const numberInt: number = parseInt(phone);
        const data = { username, password, numberInt };
        SaveUserData(data);
        //Redirect ke halaman login setelah data berhasil di register
        res.writeHead(303, { location: "/user/login" });
        res.end();
      });
    }
  } else if (path === MainUrl.chat) {
    res.writeHead(200, { "Content-Type": "text/html" });
    const query = parsedUrl.query as { [key: string]: string | undefined };
    const nomorUser = query.nomorUser;
    const namaUser = query.namaUser;

    //sekarang dapatkan data user dari login
    const dataTarget = GetAllData(); //data target yang di kirimkan
    //filterkan datanya yang nomornya bukan user saat ini maka data tersebut yang di kirimkan

    const htmlTemplate = render(readFile("mainUserWa.ejs", "html"), {
      dataTarget: dataTarget,
      nomorUser,
      namaUser,
    });

    res.end(htmlTemplate);

    //======Page End=======
  } else if (path?.startsWith("/css/")) {
    const filename = path.split("/css/")[1]; // Ekstrak nama file CSS
    try {
      let contentCss = readFile(filename, "css");
      res.writeHead(200, { "Content-Type": "text/css" });
      res.end(contentCss);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("<h3> file css not found </h3>");
    }

    // pengelolaan file js
  } else if (path?.startsWith("/js/")) {
    const filename = path.split("/js/")[1]; // Ekstrak nama file JS
    try {
      let contentJs = readFile(filename, "js");
      res.writeHead(200, { "Content-Type": "application/javascript" });
      res.end(contentJs);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("<h3> file js not found </h3>");
    }
    // halman tidak di temukan
  } else if (path?.startsWith("/img/")) {
    const filename = path.split("/img/")[1]; // Ekstrak nama file JS

    try {
      let counternImg = readImageFile(filename);
      res.writeHead(200, { "Content-Type": "image/png" });
      res.end(counternImg);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("<h3> file img not found </h3>");
    }
  } else {
    const htmlTempplateErr = render(readFile("error/not-found.ejs", "html"));
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end(htmlTempplateErr);
    return;
  }
});

// Integrasi Socket.IO dengan server HTTP
const io = new Server(server);
const targetSockets = new Map(); // simpajn dalam object map nomor => socket.id

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Registrasi nomor user
  socket.on("register", (nomorTarget) => {
    targetSockets.set(nomorTarget, socket.id);
  });

  // Kirim pesan ke user lain
  socket.on("userChat", async ({ nomorTarget, namaUser, message }) => {
    if (!nomorTarget || !message) {
      return socket.emit(
        "error",
        "Nomor atau pesan kosong",
        "nomor dan pesan yang di dapat dari targe :",
        nomorTarget,
        namaUser,
        "messsage",
        message
      );
    }

    const targetSocketId = targetSockets.get(nomorTarget);

    if (targetSocketId) {
      io.to(targetSocketId).emit("receiveChat", {
        nomorTarget,
        message,
        namaUser,
      });
    } else {
      socket.emit(
        "error",
        "Penerima sedang offline atau belum registrasi",
        "nomor target yg tersimpan di server:",
        targetSocketId,
        "nomor target yang di dapat saat di kirim dari clicnt :",
        nomorTarget
      );
    }
  });

  // Hapus dari map saat disconnect
  socket.on("disconnect", () => {
    for (let [nomor, id] of targetSockets.entries()) {
      if (id === socket.id) {
        targetSockets.delete(nomor);
        break;
      }
    }
  });
});

// Jalankan server HTTP
server.listen(5005, () => {
  console.log("Server running at http://127.0.0.1:5005");
});
