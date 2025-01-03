// Hubungkan ke server perhatikan saat deployment
const socket = io("http://localhost:3002");

// Tampilkan pesan selamat datang

// Kirim pesan ke server
document.getElementById("sendMessage").addEventListener("click", () => {
  const message = document.getElementById("messageInput").value;
  socket.emit("chat", message);
});

// Tampilkan balasan dari server
socket.on("response", (msg) => {
  document.getElementsByClassName(
    "chat"
  )[0].innerHTML += ` <p >${msg} </p> <button class='messageClose 'type="button">X</button>`;
});
socket.on("testDB", (msg) => {
  document.getElementsByClassName("chat")[0].innerHTML += ` <p >${msg} </p>`;
  console.log(msg);
});
