
import {IncomingMessage , Server, ServerResponse} from  "http"
import { render } from "ejs";
import { readDataBody } from "../model/readData";
import { SaveUserData , CekDataNomor } from "../config/dataFile";
import { readFile } from "../model/readFile";
export function UserDashboard(){
  
}

export function UserLogin(MainUrl : Record<string , string> , req :IncomingMessage ,res : ServerResponse){

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
}

export function UserRegister(MainUrl : Record<string , string > , req : IncomingMessage , res : ServerResponse){
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
}
