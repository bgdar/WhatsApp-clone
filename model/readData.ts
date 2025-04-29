import { ServerResponse, IncomingMessage } from "http";

export const readDataBody = (
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
