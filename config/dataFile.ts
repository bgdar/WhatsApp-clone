import path from "path";
import fs from "fs";
import type { promises } from "dns";

interface typeDataUser {
  numberInt: number;
  username: string;
  password?: string;
}

export const SaveUserData = (data: typeDataUser) => {
  const dirPath = path.join(__dirname, "./saveDataJson");
  const filePath = path.join(dirPath, "dataUser.json");

  // Pastikan direktori ada
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log("Directory created:", dirPath);
  }

  let existingData: typeDataUser[] = [];

  if (fs.existsSync(filePath)) {
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      existingData = JSON.parse(fileContent);

      if (!Array.isArray(existingData)) {
        console.warn("File content is not a valid array. Resetting.");
        existingData = [];
      }
    } catch (err) {
      console.error("Error reading or parsing JSON:", err);
      existingData = [];
    }
  } else {
    console.log("File does not exist, will be created.");
  }
  existingData.push(data);
  try {
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), "utf8");
    console.log("User data saved successfully.");
  } catch (err) {
    console.error("Error writing JSON file:", err);
  }
};

export const CekDataNomor = async (nomor: number): Promise<boolean> => {
  const dirPath = path.join(__dirname, "./saveDataJson");
  const filePath = path.join(dirPath, "dataUser.json");

  // Pastikan direktori ada
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log("Directory created:", dirPath);
    return false;
  }
  if (fs.existsSync(filePath)) {
    try {
      const data = await fs.promises.readFile(filePath, "utf-8");
      const parseData: typeDataUser[] = JSON.parse(data);

      if (!Array.isArray(parseData)) {
        console.warn("File content is not a valid array.");
        return false;
      }
      const isRegistered = parseData.some((item) => item.numberInt === nomor);
      if (isRegistered) {
        console.log("nomor sudah terdaftar");
      }
      return isRegistered;
    } catch (err) {
      console.error("Error reading file:", err);
      return false;
    }
  } else {
    console.log("File does not exist, will be created.");
    return false;
  }
};

/** mengembalikan semua data user dalam bentuk Object **/
export const GetAllData = (): typeDataUser[] => {
  const dirPath = path.join(__dirname, "./saveDataJson");
  const filePath = path.join(dirPath, "dataUser.json");

  // Buat direktori jika belum ada
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log("Directory created:", dirPath);
  }

  // Baca file jika ada
  if (fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, "utf-8");
      const parseData: typeDataUser[] = JSON.parse(data);
      return parseData;
    } catch (err) {
      console.error("Terjadi kesalahan saat membaca user:", err);
      return [];
    }
  }

  // Jika file tidak ditemukan, kembalikan array kosong
  return [];
};
