const API_ENDPOINT = "http://54.145.242.237:3000/api/";

document.addEventListener("DOMContentLoaded", () => {
  const id = window.location.pathname.split("/").pop();
  let ownerData;
  let petData;
  let userId;

  if (id) {
    fetch(`${API_ENDPOINT}pets/pet/info/user/${id}`)
      .then((response) => response.json())
      .then((data) => {
        ownerData = data.userInfo;
        petData = data.pet;
        userId = data.pet.userId;
      })
      .catch(() => {
        console.log("No se pudo obtener la información de la mascota.");
      });
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

          // Elementos para el dueño
          const title = document.createElement("h1");
          title.textContent = "Gracias por compartir tu ubicación";
          const ownerInfoDiv = document.createElement("div");
          const h2Dueño = document.createElement("h2");
          h2Dueño.textContent = "Información del dueño";
          h2Dueño.style.color = "#54787D";
          ownerData.forEach((element) => {
            const infoElement = document.createElement("h2");
            infoElement.style.color = "#54787D";
            infoElement.textContent = element.field;
            const pElement = document.createElement("p");
            pElement.style.color = "#615145";
            pElement.textContent = element.value;
            ownerInfoDiv.appendChild(infoElement);
            ownerInfoDiv.appendChild(pElement);
          });

          const petInfo = `
                                  <h2 style="color : #54787D;">Información de la mascota</h2>
                                  <p style="color: #615145;">${petData.name} (${
            petData.petProfile.sex == "M" ? "Macho" : "Hembra"
          })</p>
                                  <p style="color: #615145;">${
                                    petData.petProfile.age
                                  } años</p>
                                  <p style="color: #615145;">${
                                    petData.petProfile.race
                                  }</p>
                                  <p style="color: #615145;">${
                                    petData.petProfile.color
                                  }</p>
                              `;

          const locationTitle = document.createElement("h2");
          locationTitle.style.color = "#54787D";
          locationTitle.textContent = "Ubicación compartida";

          const mapContainer = document.createElement("div");
          mapContainer.id = "map";
          content.appendChild(title);
          content.appendChild(ownerInfoDiv);
          content.innerHTML += petInfo;
          content.appendChild(locationTitle);
          content.appendChild(mapContainer);

          // Geocodificación inversa para obtener la dirección
          const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

          fetch(geocodeUrl)
            .then((response) => response.json())
            .then((data) => {
              const address = data.display_name || "Dirección no disponible";

              fetch(`${API_ENDPOINT}notifications`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId: userId,
                  petId: parseInt(id),
                  date: new Date(),
                  location: address,
                }),
              })
                .then(() => {
                  console.log("Notificación enviada.");
                })
                .catch(() => {
                  console.error("No se pudo enviar la notificación.");
                });

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
