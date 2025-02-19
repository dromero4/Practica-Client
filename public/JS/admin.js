let socket = null; // No conectamos WebSocket de inmediato

function connectWebSocket() {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        socket = new WebSocket("ws://localhost:8180");

        socket.addEventListener("open", function () {
            console.log("✅ Connexió WebSocket establerta.");
        });

        socket.addEventListener("close", function () {
            alert("⚠️ Connexió tancada. Redirigint a la pàgina principal.");
            window.location.href = "index.html";
        });

        socket.addEventListener("error", function () {
            alert("❌ Error en la connexió WebSocket.");
            window.location.href = "index.html";
        });

        socket.addEventListener("message", function (event) {
            console.log("📩 Missatge rebut:", event.data);
            
            try {
                let data = JSON.parse(event.data);

                if (data.type === "configuració") {
                    document.getElementById("width").value = data.width;
                    document.getElementById("height").value = data.height;
                    document.getElementById("pisos").value = data.pisos;
                } else if (data.type === "estat_joc") {
                    document.getElementById("startStopBtn").innerText = data.running ? "Aturar" : "Engegar";
                } else {
                    console.log("ℹ️ Altres dades:", data);
                }
            } catch (error) {
                console.warn("⚠️ Missatge no JSON:", event.data);
            }
        });
    }
}

function enviarConfiguracio() {
    connectWebSocket(); // 🔹 Conectamos WebSocket solo si es necesario
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ action: "administrar" }));
    }

    let width = document.getElementById("width").value;
    let height = document.getElementById("height").value;
    let pisos = document.getElementById("pisos").value;

    fetch("http://localhost:3000/configurar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ width, height, pisos })
    })
    .then(response => response.json())
    .then(data => {
        alert("✅ Configuració enviada correctament!");
        console.log("📩 Resposta del servidor:", data);
    })
    .catch(error => {
        alert("❌ Error en enviar la configuració.");
        console.error("Error:", error);
    });
}

function iniciarAturarJoc() {
    connectWebSocket(); // 🔹 Conectamos WebSocket solo si es necesario

    let btn = document.getElementById("startStopBtn");
    let accio = btn.innerText === "Engegar" ? "engegar" : "aturar";

    fetch("http://localhost:8080/joc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: accio })
    })
    .then(response => response.json())
    .then(data => {
        btn.innerText = accio === "engegar" ? "Aturar" : "Engegar";
        alert(`✅ Joc ${accio === "engegar" ? "iniciat" : "aturat"} correctament!`);
    })
    .catch(error => {
        alert("❌ Error en canviar l'estat del joc.");
        console.error("Error:", error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("configurarBtn").addEventListener("click", enviarConfiguracio);
    document.getElementById("startStopBtn").addEventListener("click", iniciarAturarJoc);
});
document.addEventListener("DOMContentLoaded", () => {
    const widthInput = document.getElementById("width");
    const heightInput = document.getElementById("height");

    // Crear el recuadro
    const previewBox = document.createElement("div");
    previewBox.style.position = "relative";
    previewBox.style.backgroundColor = "lightblue";
    previewBox.style.border = "2px solid black";
    previewBox.style.marginTop = "10px";

    // Agregarlo al cuerpo
    document.body.appendChild(previewBox);

    function updateBoxSize() {
        const width = parseInt(widthInput.value) || 0;
        const height = parseInt(heightInput.value) || 0;

        previewBox.style.width = `${width}px`;
        previewBox.style.height = `${height}px`;
    }

    widthInput.addEventListener("input", updateBoxSize);
    heightInput.addEventListener("input", updateBoxSize);
});
