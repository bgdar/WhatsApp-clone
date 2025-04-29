# WhastApp Clone

## Description **Api or Url**

- `/` = url Halaman utama WahtsApp
- `/chat` = halaman pesan bisa di kirimkan
  nantik setiap pesan berdasarkan ID atau nomorsetiap orang

## Description **Module**

- Websocket =

## Description **Folder**

- `config` = Menyimpan hasil data Untuk sementara ada 2 jenis penyimpanan
  - connectDb.ts => Menyimpan ke database **MonggoDB** _tidak di gunakan sementara_
  - saveDataFile.ts => gunakan untuk menyimpan file dalam bentuk JSON _ini di gunakan sementara untuk menhandle data_

## Konfigurasui

```bash
bun install
```

To run:

```bash
bun run main.ts
```

This project was created using `bun init` in bun v1.1.34. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
