import { ServerResponse, IncomingMessage } from "http";

/**Fn untuk mendapatkan data dari client dalam bentuk Fetch atau from */
export const readDataBody = (
  req: IncomingMessage,
  res: ServerResponse,
  callback: (username: string, password: string, number: string) => void
) => {
  let body = "";

  // Menerima data secara bertahap
  req.on("data", (chunk) => {
    body += chunk.toString(); // Tambahkan data ke body
  });
  req.on("end", () => {
    const contentType = req.headers["content-type"];

    // jika Data form dikirim dalam format JSON, misalnya via JavaScript fetch() atau axios, bukan dari form HTML biasa.
    if (contentType === "application/json") {
      console.log("data body di kirim lewat fetch", body);
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
      // Jika data form dikirim dalam format URL-encoded, misalnya dari form HTML biasa.
      // Ini adalah format yang umum digunakan untuk mengirim data form dari browser.
    } else if (contentType === "application/x-www-form-urlencoded") {
      const params = new URLSearchParams(body);

      callback(
        params.get("username") || "",
        params.get("password") || "",
        params.get("phone") || ""
      );
      console.log("data yang di dapat :", params);
      //Lasung redirect di bawah fuction ini
    } else {
      res.writeHead(415);
      res.end("Unsupported content type");
    }
  });
  req.on("error", (err) => {
    console.log("reguest errror :", err);
  });
};
