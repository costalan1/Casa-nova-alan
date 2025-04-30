// Inicializa o EmailJS
emailjs.init("mWfB4nXwKvQblnwFr"); // substitua pela sua Public Key

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

// Inicializa o EmailJS
emailjs.init("mWfB4nXwKvQblnwFr");

// Carrega os presentes
const giftList = document.getElementById("gift-list");

function carregarPresentes() {
  giftList.innerHTML = "";
  db.collection("gifts").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const gift = doc.data();
      if (!gift.reservado) {
        const li = document.createElement("li");
        li.textContent = gift.nome;
        li.setAttribute("data-id", doc.id);
        li.addEventListener("click", () => {
          document.getElementById("form-container").style.display = "block";
          document.getElementById("selectedGift").value = doc.id;
        });
        giftList.appendChild(li);
      }
    });
  });
}

carregarPresentes();

// Lida com o envio do formulário
document.getElementById("gift-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const giftId = document.getElementById("selectedGift").value;

  if (!name || !email || !giftId) {
    alert("Preencha todos os campos!");
    return;
  }

  const giftDoc = db.collection("gifts").doc(giftId);
  giftDoc.update({ reservado: true, nome, email }).then(() => {
    alert(`Obrigado, ${name}! Presente confirmado.`);

    // Envia o e-mail para você
    emailjs.send("service_gmail", "template_lq3gppr", {
      to_name: "Alan",
      from_name: name,
      from_email: email,
      gift: giftId
    }).then(() => {
      console.log("Email enviado com sucesso!");
    }).catch((error) => {
      console.error("Erro ao enviar email:", error);
    });

    document.getElementById("form-container").style.display = "none";
    carregarPresentes(); // Atualiza a lista removendo item selecionado
  });
});
