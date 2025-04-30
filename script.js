
// CONFIGURE O FIREBASE AQUI
const firebaseConfig = {
  apiKey: "AIzaSyCJBvDjC09EmMlstdGqIO0PztsopsIzsYM",
  authDomain: "casa-nova-alan.firebaseapp.com",
  projectId: "casa-nova-alan",
  storageBucket: "casa-nova-alan.firebasestorage.app",
  messagingSenderId: "88678127780",
  appId: "1:88678127780:web:ea39a0999b4b6ec95d2e31",
  measurementId: "G-3VCB41EP0M"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

emailjs.init("mWfB4nXwKvQblnwFr");

const giftList = document.getElementById("gift-list");
const formContainer = document.getElementById("form-container");
const giftForm = document.getElementById("gift-form");
let currentGift = null;

function loadGifts() {
  db.collection("gifts").where("available", "==", true).get().then(snapshot => {
    giftList.innerHTML = "";
    snapshot.forEach(doc => {
      const item = document.createElement("li");
      item.textContent = doc.data().name;
      item.onclick = () => {
        currentGift = doc;
        document.getElementById("selectedGift").value = doc.id;
        formContainer.style.display = "block";
        window.scrollTo(0, document.body.scrollHeight);
      };
      giftList.appendChild(item);
    });
  });
}

giftForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const giftId = document.getElementById("selectedGift").value;

  db.collection("gifts").doc(giftId).update({ available: false }).then(() => {
    emailjs.send("alancosta294@gmail.com", "template_ikbdyup", {
      gift_name: currentGift.data().name,
      from_name: name,
      reply_to: email,
      to_name: "Alan",
      to_email: "alancosta294@gmail.com"
    });

    alert("Obrigado! Seu presente foi reservado.");
    formContainer.style.display = "none";
    loadGifts();
  });
});

loadGifts();
