const idInput = document.getElementById("id-input");
const button = document.getElementById("qr-button");
let html5QrCode;
let cameraAtiva = false;

function onScanSuccess(decodedText) {
  idInput.value = decodedText;
  console.log("Código detectado:", decodedText);
}

async function iniciarCamera() {
  if (cameraAtiva) return;

  html5QrCode = new Html5Qrcode("qr-recon");
  try {
    await html5QrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      onScanSuccess
    );
    cameraAtiva = true;
    button.textContent = "Fechar Câmera";
  } catch (err) {
    console.error("Erro ao acessar câmera:", err);
    idInput.textContent = "Erro ao acessar câmera.";
  }
}

async function pararCamera() {
  if (!cameraAtiva || !html5QrCode) return;

  await html5QrCode.stop();
  await html5QrCode.clear();
  cameraAtiva = false;
  button.textContent = "Abrir Câmera";
}

button.addEventListener("click", () => {
  cameraAtiva ? pararCamera() : iniciarCamera();
});

