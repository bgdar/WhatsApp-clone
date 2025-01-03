const form = document.getElementById("sendLoginForm"); // myForm merujuk ke <form>
const response = document.getElementsByClassName("response")[0];

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries()); //Data kemudian diubah menjadi objek JSON
  fetch("/sendLogin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        console.log(response.statusText);
      }
      return response.json();
    })
    .then((result) => {
      // Tampilkan respons di halaman
      response.textContent = `Server Response: ${result.message}`;
    })
    .catch((error) => {
      console.error("Error:", error);
      response.textContent = "Error occurred while submitting the form.";
    });
});
