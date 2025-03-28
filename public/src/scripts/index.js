document.addEventListener("DOMContentLoaded", () => {
  const id = window.location.pathname.split("/").pop();

  if (id) {
    console.log(`Información de la mascota con ID: ${id}`);
  } else {
    console.log("No se encontró el ID.");
  }
  const allowButton = document.querySelector(".button.allow");
  const denyButton = document.querySelector(".button.deny");
  const content = document.querySelector("#content");
  const introView = document.querySelector("#intro-view");

  allowButton.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Ocultar la primera vista y mostrar la segunda
          introView.style.display = "none";
          content.style.display = "block";

          // Limpiar contenido anterior
          content.innerHTML = "";

          const title = document.createElement("h1");
          title.textContent = "Gracias por compartir tu ubicación";

          const ownerInfo = `
                                  <h2 style="color : #54787D;">Información del dueño</h2>
                                  <p style="color: #615145;">Rodrigo Flores</p>
                                  <p style="color: #615145;">961 233 4937</p>
                                  <p style="color: #615145;"><a href='mailto:923252@ids.upchiapas.edu.mx'>923252@ids.upchiapas.edu.mx</a></p>
                              `;

          const petInfo = `
                                  <h2 style="color : #54787D;">Información de la mascota</h2>
                                  <p style="color: #615145;">Marx (Macho)</p>
                                  <p style="color: #615145;">8 años</p>
                                  <p style="color: #615145;">Border Collie</p>
                              `;

          const locationTitle = document.createElement("h2");
          locationTitle.style.color = "#54787D";
          locationTitle.textContent = "Ubicación compartida";

          const mapContainer = document.createElement("div");
          mapContainer.id = "map";
          content.appendChild(title);
          content.innerHTML += ownerInfo + petInfo;
          content.appendChild(locationTitle);
          content.appendChild(mapContainer);

          // Geocodificación inversa para obtener la dirección
          const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

          fetch(geocodeUrl)
            .then((response) => response.json())
            .then((data) => {
              const address = data.display_name || "Dirección no disponible";

              // Crear el mapa con la ubicación
              const map = L.map("map").setView([latitude, longitude], 15);
              L.tileLayer(
                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                  attribution: "© OpenStreetMap contributors",
                }
              ).addTo(map);

              L.marker([latitude, longitude])
                .addTo(map)
                .bindPopup(address)
                .openPopup();
            })
            .catch(() => {
              alert("No se pudo obtener la dirección.");
            });
        },
        () => {
          alert("No se pudo obtener la ubicación. Verifica los permisos.");
        }
      );
    } else {
      alert("La geolocalización no es compatible con este navegador.");
    }
  });

  denyButton.addEventListener("click", () => {
    alert("Has negado el acceso a la ubicación.");
  });
});
