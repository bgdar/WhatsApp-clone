import { readFileSync } from "fs";
import path from "path";

//Note : setiap file yang di baca tergantung foldernya dalam hal ini folder public
// jikaa folder beruba maka filePath harus di sesuaikan ke foldernya

export function readFile(fileName: string, folderName: string): string {
  const filePath = path.join(__dirname, "../", "public", folderName, fileName);
  try {
    return readFileSync(filePath, "utf-8");
  } catch (error) {
    return `<h1>File ${fileName} not found</h1>`;
  }
}
// export function readCssFile(filename: string) {
//   const filePath = path.join(__dirname, "../", "public", "css", filename);
//   try {
//     return readFileSync(filePath, "utf-8");
//   } catch (error) {
//     return "kenapa mau tau ya file css nya ";
//   }
// }
// export function readFileJs(filename: string) {
//   const filePath = path.join(__dirname, "../", "public", "js", filename);
//   try {
//     return readFileSync(filePath, "utf-8");
//   } catch (error) {
//     return "kenapa mau tau ya file js nya";
//   }
// }
export function readImageFile(filename: string) {
  const filePath = path.join(__dirname, "../", "public", "img", filename);

  return readFileSync(filePath);
}
