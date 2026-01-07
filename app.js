const sessionEl = document.getElementById("sessionCount");
const lifetimeEl = document.getElementById("lifetimeCount");
const mainBtn = document.getElementById("mainBtn");
const resetBtn = document.getElementById("resetBtn");
const soundBtn = document.getElementById("soundBtn");
const vibrateBtn = document.getElementById("vibrateBtn");
const insightEl = document.getElementById("insight");

let stats = JSON.parse(localStorage.getItem("jap_stats")) || {
  session: 0,
  lifetime: 0
};

let settings = JSON.parse(localStorage.getItem("jap_settings")) || {
  sound: true,
  vibrate: true
};

updateUI();

/* UI */
function updateUI() {
  sessionEl.textContent = stats.session;
  lifetimeEl.textContent = stats.lifetime;
  soundBtn.textContent = settings.sound ? "🔊 Sound ON" : "🔇 Sound OFF";
  vibrateBtn.textContent = settings.vibrate ? "📳 Vibrate ON" : "📴 Vibrate OFF";
}

function save() {
  localStorage.setItem("jap_stats", JSON.stringify(stats));
  localStorage.setItem("jap_settings", JSON.stringify(settings));
}

/* SOUND */
function playSound() {
  if (!settings.sound) return;
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = 880;
  gain.gain.value = 0.1;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.1);
}

/* 🌸 FLOATING RAM NAAM */
function spawnRamNaam() {
  const rect = mainBtn.getBoundingClientRect();
  const el = document.createElement("div");
  el.className = "ram-float";
  el.textContent = "राम नाम";

  el.style.left = rect.left + rect.width / 2 + "px";
  el.style.top = rect.top + rect.height / 2 + "px";

  const drift = (Math.random() * 60 - 30) + "px";
  el.style.setProperty("--drift", drift);

  document.body.appendChild(el);

  setTimeout(() => el.remove(), 1600);
}

/* MAIN CLICK */
mainBtn.addEventListener("click", () => {
  stats.session++;
  stats.lifetime++;

  playSound();
  spawnRamNaam();

  if (settings.vibrate && navigator.vibrate) {
    navigator.vibrate(50);
  }

  if (stats.session % 108 === 0) {
    insightEl.textContent = "ॐ श्री राम शरणं मम";
    insightEl.classList.remove("hidden");
    setTimeout(() => insightEl.classList.add("hidden"), 4000);
  }

  save();
  updateUI();
});

/* CONTROLS */
resetBtn.addEventListener("click", () => {
  stats.session = 0;
  save();
  updateUI();
});

soundBtn.addEventListener("click", () => {
  settings.sound = !settings.sound;
  save();
  updateUI();
});

vibrateBtn.addEventListener("click", () => {
  settings.vibrate = !settings.vibrate;
  save();
  updateUI();
});
const CACHE_NAME = "ram-jap-v1";

const FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./ram.png",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
