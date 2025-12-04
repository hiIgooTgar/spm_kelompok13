const apiKeyWrite = "AGPIYM3P4IAIBVFU";
const channelID = "3147685";
const apiReadURL = `https://api.thingspeak.com/channels/${channelID}/feeds.json?results=1`;

const users = [
  { username: "igo", password: "igo123", role: "igo" },
  { username: "ismail", password: "ismail123", role: "ismail" },
];

window.onload = () => {
  const savedUser = localStorage.getItem("loggedUser");
  if (savedUser) {
    showUser(savedUser);
    loadStatus(savedUser);
  }
};

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === "" || password === "") {
    alert("Username dan password wajib diisi!");
    return;
  }

  const foundUser = users.find(
    (u) => u.username === username && u.password === password
  );

  if (foundUser) {
    localStorage.setItem("loggedUser", foundUser.role);
    showUser(foundUser.role);
    loadStatus(foundUser.role);
  } else {
    alert("Username atau password salah!");
  }
}

function showUser(role) {
  document.getElementById("login-form").classList.add("d-none");
  document.getElementById("content-second").classList.remove("d-none");
  document.getElementById("user-igo").classList.add("d-none");
  document.getElementById("user-ismail").classList.add("d-none");

  if (role === "igo") {
    document.getElementById("user-igo").classList.remove("d-none");
  } else if (role === "ismail") {
    document.getElementById("user-ismail").classList.remove("d-none");
  }
}

function logout() {
  localStorage.removeItem("loggedUser");
  document.getElementById("login-form").classList.remove("d-none");
  document.getElementById("user-igo").classList.add("d-none");
  document.getElementById("user-ismail").classList.add("d-none");
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
}

async function cekStatusThingSpeak() {
  try {
    const res = await fetch(apiReadURL);
    if (!res.ok) {
      console.error("Gagal membaca data ThingSpeak:", res.status);
      return null;
    }

    const data = await res.json();
    const feeds = data.feeds && data.feeds[0];
    if (!feeds) {
      console.error("Data ThingSpeak kosong!");
      return null;
    }

    const statusIgo = feeds.field1 ? Number(feeds.field1) : 0;
    const statusIsmail = feeds.field2 ? Number(feeds.field2) : 0;

    return {
      igo: statusIgo,
      ismail: statusIsmail,
    };
  } catch (err) {
    console.error("Error saat mengambil status ThingSpeak:", err);
    return null;
  }
}

async function loadStatus(user) {
  const result = await cekStatusThingSpeak();
  if (!result) return;

  if (user === "igo") {
    document.getElementById("igoStatus").innerText =
      result.igo === 1
        ? "Status: Pintu Terbuka ✅"
        : "Status: Pintu Tertutup ❌";
  } else if (user === "ismail") {
    document.getElementById("ismailStatus").innerText =
      result.ismail === 1
        ? "Status: Pintu Terbuka ✅"
        : "Status: Pintu Tertutup ❌";
  }
}

async function updateStatus(user, status) {
  let field = "";
  let statusEl = null;

  if (user === "igo") {
    field = "field1";
    statusEl = document.getElementById("igoStatus");
  } else if (user === "ismail") {
    field = "field2";
    statusEl = document.getElementById("ismailStatus");
  }

  statusEl.innerText =
    status === 1 ? "Status: Pintu Terbuka ✅" : "Status: Pintu Tertutup ❌";

  const url = `https://api.thingspeak.com/update?api_key=${apiKeyWrite}&${field}=${status}`;

  try {
    const res = await fetch(url);
    if (!res.ok) console.error("ThingSpeak update gagal:", res.status);
    else console.log(`✅ ${user.toUpperCase()} ubah status ke: ${status}`);
  } catch (err) {
    console.error("❌ Gagal kirim ke ThingSpeak", err);
  }
}

var swiper = new Swiper(".imgLogin", {
  spaceBetween: 20,
  loop: true,
  slidesPerView: "auto",
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  breakpoints: {
    0: {
      spaceBetween: 12,
    },
    480: {
      spaceBetween: 15,
    },
    767: {
      spaceBetween: 20,
    },
    992: {
      spaceBetween: 20,
    },
  },
});
