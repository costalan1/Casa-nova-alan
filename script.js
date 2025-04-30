// Inicializa o Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCJBvDjC09EmMlstdGqIO0PztsopsIzsYM",
  authDomain: "casa-nova-alan.firebaseapp.com",
  projectId: "casa-nova-alan",
  storageBucket: "casa-nova-alan.appspot.com",
  messagingSenderId: "88678127780",
  appId: "1:88678127780:web:ea39a0999b4b6ec95d2e31",
  measurementId: "G-3VCB41EP0M"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Inicializa o EmailJS com sua chave pública
emailjs.init("jOWtB4NrC9wK_tx_1");  // Substitua pela sua chave pública

// Carrega os presentes
const giftList = document.getElementById("gift-list");

function carregarPresentes() {
  console.log("Iniciando o carregamento dos presentes...");
  giftList.innerHTML = "";  // Limpar a lista antes de adicionar os itens
  db.collection("gifts").get().then((querySnapshot) => {
    console.log("Dados carregados com sucesso!");
    querySnapshot.forEach((doc) => {
      const gift = doc.data();
      console.log("Gift:", gift);  // Exibe o objeto completo
      console.log("Available:", gift.available);  // Exibe o valor do campo available

      // Exibe o presente apenas se o campo "available" for verdadeiro
      if (gift.available === true) {  // Verificando se o campo "available" é exatamente true
        const li = document.createElement("li");
        li.textContent = gift.name || 'Nome do presente não encontrado'; // Exibe o nome do presente
        li.setAttribute("data-id", doc.id);
        li.addEventListener("click", () => {
          document.getElementById("form-container").style.display = "block";
          document.getElementById("selectedGift").value = doc.id;
        });
        giftList.appendChild(li);
      }
    });
  }).catch((error) => {
    console.error("Erro ao carregar presentes:", error);
  });
}

document.addEventListener("DOMContentLoaded", function() {
  carregarPresentes(); // Chamando a função após o carregamento completo do DOM
});

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
  giftDoc.update({ available: true, name, email }).then(() => {
    alert(`Obrigado, ${name}! Presente confirmado.`);

    // Envia o e-mail para você
    emailjs.send("service_gmail", "template_lq3gppr", {
      to_name: "Alan",
      to_email: "alancosta294@gmail.com",
      from_name: name,
      from_email: email,
      gift: giftId
    })
    .then((response) => {
      console.log("Email enviado com sucesso!", response);
    })
    .catch((error) => {
      console.error("Erro ao enviar o email:", error);
      alert("Houve um erro ao enviar o email. Tente novamente.");
    });

    document.getElementById("form-container").style.display = "none";
    carregarPresentes(); // Atualiza a lista removendo item selecionado
  });
});
