import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from
"https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc
} from
"https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


// =====================================
// FIREBASE CONFIG
// =====================================

const firebaseConfig = {

  apiKey: "AIzaSyCzjryit_T8PHpD9D7xdmxUheBU6gQ4n14",

  authDomain:
    "madagascar-tourism.firebaseapp.com",

  projectId:
    "madagascar-tourism",

  storageBucket:
    "madagascar-tourism.firebasestorage.app",

  messagingSenderId:
    "1098060851073",

  appId:
    "1:1098060851073:web:ec08253935f77354beea80"

};


// =====================================
// INITIALISATION
// =====================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// =====================================
// HTML ELEMENTS
// =====================================

const loginForm =
  document.getElementById("loginForm");

const emailInput =
  document.getElementById("email");

const passwordInput =
  document.getElementById("password");

const loginSection =
  document.getElementById("loginSection");

const dashboard =
  document.getElementById("dashboard");

const loginMessage =
  document.getElementById("loginMessage");

const reservationsList =
  document.getElementById("reservationsList");

const logoutBtn =
  document.getElementById("logoutBtn");


// =====================================
// LOGIN
// =====================================

loginForm.addEventListener(
  "submit",
  async function(event) {

    event.preventDefault();

    const email =
      emailInput.value.trim();

    const password =
      passwordInput.value;

    loginMessage.textContent =
      "Connexion...";

    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      loginMessage.textContent = "";

    } catch (error) {

      console.error(error);

      loginMessage.textContent =
        "❌ Email ou mot de passe incorrect.";

    }

  }
);


// =====================================
// AUTHENTIFICATION
// =====================================

onAuthStateChanged(
  auth,
  async function(user) {

    if (user) {

      loginSection.style.display =
        "none";

      dashboard.style.display =
        "block";

      await loadReservations();

    } else {

      loginSection.style.display =
        "block";

      dashboard.style.display =
        "none";

    }

  }
);


// =====================================
// CHARGER RESERVATIONS
// =====================================

async function loadReservations() {

  reservationsList.innerHTML =
    "<p>Chargement...</p>";

  try {

    const snapshot =
      await getDocs(
        collection(
          db,
          "reservations"
        )
      );

    if (snapshot.empty) {

      reservationsList.innerHTML =
        "<p>Aucune réservation.</p>";

      return;
    }

    reservationsList.innerHTML = "";

    snapshot.forEach(
      function(documentSnapshot) {

        const data =
          documentSnapshot.data();

        const card =
          document.createElement("div");

        card.className =
          "reservation-card";

        card.innerHTML = `

          <h3>
            🏝️ ${escapeHTML(
              data.destination || "N/A"
            )}
          </h3>

          <p>
            👤 <strong>Nom :</strong>
            ${escapeHTML(
              data.nom || "N/A"
            )}
          </p>

          <p>
            📞 <strong>Téléphone :</strong>
            ${escapeHTML(
              data.telephone || "N/A"
            )}
          </p>

          <p>
            📅 <strong>Date :</strong>
            ${escapeHTML(
              data.date || "N/A"
            )}
          </p>

          <p>
            👥 <strong>Personnes :</strong>
            ${data.personnes || 0}
          </p>

          <p>
            💬 <strong>Message :</strong>
            ${escapeHTML(
              data.message || ""
            )}
          </p>

          <button
            class="delete-btn"
            data-id="${documentSnapshot.id}"
          >
            🗑️ Supprimer
          </button>

        `;

        reservationsList.appendChild(
          card
        );

      }
    );


    // =================================
    // SUPPRESSION
    // =================================

    document
      .querySelectorAll(".delete-btn")
      .forEach(
        function(button) {

          button.addEventListener(
            "click",
            async function() {

              const id =
                button.dataset.id;

              const ok =
                confirm(
                  "Voulez-vous supprimer cette réservation ?"
                );

              if (!ok) return;

              try {

                await deleteDoc(
                  doc(
                    db,
                    "reservations",
                    id
                  )
                );

                await loadReservations();

              } catch (error) {

                console.error(error);

                alert(
                  "❌ Suppression impossible."
                );

              }

            }
          );

        }
      );


  } catch (error) {

    console.error(error);

    reservationsList.innerHTML =
      "<p>❌ Erreur Firestore.</p>";

  }

}


// =====================================
// LOGOUT
// =====================================

logoutBtn.addEventListener(
  "click",
  async function() {

    try {

      await signOut(auth);

    } catch (error) {

      console.error(error);

    }

  }
);


// =====================================
// SECURITE AFFICHAGE
// =====================================

function escapeHTML(value) {

  const div =
    document.createElement("div");

  div.textContent =
    String(value);

  return div.innerHTML;

}
