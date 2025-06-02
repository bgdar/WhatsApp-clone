// Hubungkan ke server perhatikan saat deployment

//  Di halaman /chat (JavaScript Client)
// const params = new URLSearchParams(window.location.search);
// const message = params.get("message");
// console.log(message);
const socket = io("http://127.0.0.1:5005");

const dataMessage = {
  // namaUser {
  // // nomorTujuan :'2323',
  // // message:[]
  // }
};

let NamaUser = "";

// Saat tombol "Chat" ditekan → registrasi pengguna target
document.querySelectorAll(".btn-open-chat").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const parent = e.target.closest(".user");
    const nomorTarget = parent
      .querySelector(".nomor-target")
      .textContent.trim();
    const namaTarget = parent.querySelector(".nama-target").textContent.trim();

    const namaUser = document.querySelector(".nama-user").value.trim(); //tangkap nama user yang di kirim oleh server

    if (!nomorTarget) {
      popupMessage("pilih tujuan jangan ksong", "error");
      return;
    }
    const nomorUser = document.querySelector(".nomor-user")?.value?.trim();
    if (nomorUser) {
      socket.emit("register", nomorUser);
    }
    //sisipkan nama target
    document.querySelector(".show-name-target").textContent = namaTarget;
    popupMessage(`Nomor Tujuan diregistrasi\n:  ${nomorTarget}`, "success");

    //tambahkan field baru
    if (!dataMessage[namaUser]) {
      dataMessage[namaUser] = {};
    } else if (!Array.isArray(dataMessage[namaUser].message)) {
      dataMessage[namaUser].message = []; //jiks tidak ada buat array kosong
    }
    NamaUser = namaUser;
  });
});

// Saat tombol "send" ditekan → kirim pesan
document.querySelector(".btn-send-message").addEventListener("click", () => {
  const message = document.querySelector(".messageChat").value;
  const nomorTarget = document
    .querySelector(".nomor-target")
    .textContent.trim();

  if (!message || !nomorTarget) {
    alert("Isi pesan dan nomor harus diisi");
    popupMessage("isi pesan dan nomor hasus di isi", "info");
    return;
  }

  socket.emit("userChat", {
    nomorTarget,
    namaUser: NamaUser,
    message,
  });

  // Tambahkan pesan ke UI pengirim
  const li = document.createElement("li");
  li.textContent = `You: ${message}`;
  document.querySelector(".chat").appendChild(li);
  document.querySelector(".messageChat").value = "";
  //simpan pesan degan membuat fild message baru
  console.log("nama user yang di dapat :", NamaUser);
  if (!dataMessage[NamaUser]) {
    dataMessage[NamaUser] = { message: [] };
  }
  if (!Array.isArray(dataMessage[NamaUser].message)) {
    dataMessage[NamaUser].message = [];
  }
  dataMessage[NamaUser].message.push(message);
});
// Terima pesan dari server
socket.on("receiveChat", (data) => {
  popupMessage(`Pesan masuk dari ${data.namaUser}`, "info");
  console.log("Isi pesan:", data.message);

  const li = document.createElement("li");
  li.textContent = `${data.namaUser}: ${data.message}`;
  document.querySelector(".chat").appendChild(li);
});

// Tangani error dari server
socket.on("error", (msg) => {
  console.error("Error:", msg);
  popupMessage(msg, "error");
});

//==========[another]=====

/** masukan message  popuo , berikan type (info,success,error) **/
const popupMessage = (message, type) => {
  const containerMessage = document.getElementById("container-message");

  // Hapus semua kelas dulu (jika sebelumnya ada)
  containerMessage.className = "popup-message";

  // Buat elemen pesan
  let p = document.createElement("p");
  p.textContent = message.trim();
  containerMessage.classList.add(type);
  containerMessage.appendChild(p);

  // Tampilkan, lalu hilangkan setelah 3 detik
  containerMessage.style.display = "block";
  setTimeout(() => {
    containerMessage.style.display = "none";
    containerMessage.classList.remove(type);
    containerMessage.innerHTML = "";
  }, 3500);
};
