// Inicializa o Firebase usando o SDK compatível
const firebaseConfig = {
  apiKey: "AIzaSyCJBvDjC09EmMlstdGqIO0PztsopsIzsYM",
  authDomain: "casa-nova-alan.firebaseapp.com",
  projectId: "casa-nova-alan",
  storageBucket: "casa-nova-alan.appspot.com",
  messagingSenderId: "88678127780",
  appId: "1:88678127780:web:ea39a0999b4b6ec95d2e31",
  measurementId: "G-3VCB41EP0M"
};

// Usa o SDK compat
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Função para carregar os presentes
function carregarPresentes() {
  db.collection("gifts").get().then((querySnapshot) => {
    const giftList = document.getElementById("gift-list");
    giftList.innerHTML = ""; // limpa a lista

    querySnapshot.forEach((doc) => {
      const gift = doc.data();
      if (gift.available) {
        const li = document.createElement("li");
        li.textContent = gift.name;
        li.onclick = () => selecionarPresente(doc.id, gift.name);
        giftList.appendChild(li);
      }
    });
  });
}

function selecionarPresente(id, name) {
  document.getElementById("form-container").style.display = "block";
  document.getElementById("selectedGift").value = id;
}

document.getElementById("gift-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const giftId = document.getElementById("selectedGift").value;

  db.collection("gifts").doc(giftId).update({
    available: false,
    reservedBy: name,
    reservedEmail: email
  }).then(() => {
    alert("Obrigado por confirmar seu presente!");
    document.getElementById("form-container").style.display = "none";
    carregarPresentes();
  });
});

// Carrega os presentes ao abrir o site
carregarPresentes();
