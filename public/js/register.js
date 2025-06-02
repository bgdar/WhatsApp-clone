const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get("message");
console.log(message); // Menampilkan pesan yang diterima dari URL parameter
console.log("windows locate", window.location.search);
