const petEl = document.getElementById('pet');
const hungerBar = document.getElementById('hungerBar');
const happyBar = document.getElementById('happyBar');
const energyBar = document.getElementById('energyBar');

const hungerVal = document.getElementById('hungerVal');
const happyVal = document.getElementById('happyVal');
const energyVal = document.getElementById('energyVal');

const logList = document.getElementById('logList');

const feedBtn = document.getElementById('feedBtn');
const playBtn = document.getElementById('playBtn');
const sleepBtn = document.getElementById('sleepBtn');
const resetBtn = document.getElementById('resetBtn');

const pet = {
  hunger: 40,
  happiness: 70,
  energy: 60,
  awake: true
};

let tickInterval = null;
const TICK_MS = 3000;

function clamp(n, a = 0, b = 100) {
  return Math.max(a, Math.min(b, n));
}

function updateUI() {
  const hungerFill = 100 - pet.hunger;
  hungerBar.style.width = hungerFill + "%";
  happyBar.style.width = pet.happiness + "%";
  energyBar.style.width = pet.energy + "%";

  hungerVal.textContent = Math.round(pet.hunger);
  happyVal.textContent = Math.round(pet.happiness);
  energyVal.textContent = Math.round(pet.energy);

  
  petEl.classList.remove("happy", "sad", "sleeping", "idle");

  if (!pet.awake) {
    petEl.classList.add("sleeping");
  } else if (pet.hunger > 70 || pet.energy < 20) {
    petEl.classList.add("sad");
  } else if (pet.happiness > 65) {
    petEl.classList.add("happy");
  } else {
    petEl.classList.add("idle");
  }
}

function log(message) {
  const li = document.createElement("li");
  const time = new Date().toLocaleTimeString();
  li.textContent = `${time} — ${message}`;
  logList.prepend(li);

  if (logList.childElementCount > 40) {
    logList.removeChild(logList.lastChild);
  }
}

function feed() {
  if (!pet.awake) {
    log("You tried to feed — pet is sleeping.");
    return;
  }

  pet.hunger = clamp(pet.hunger - 25);
  pet.happiness = clamp(pet.happiness + 6);
  pet.energy = clamp(pet.energy + 3);

  updateUI();
  log("Fed the pet.");
}

function play() {
  if (!pet.awake) {
    log("Pet is sleeping. Try later.");
    return;
  }

  if (pet.energy < 15) {
    log("Pet is too tired to play.");
    return;
  }

  pet.happiness = clamp(pet.happiness + 18);
  pet.hunger = clamp(pet.hunger + 10);
  pet.energy = clamp(pet.energy - 18);

  updateUI();
  log("Played with pet — lots of fun!");
}

function sleep() {
  if (!pet.awake) {
    log("Pet is already sleeping.");
    return;
  }

  pet.awake = false;
  updateUI();
  log("Pet went to sleep.");

  setTimeout(() => {
    pet.awake = true;
    pet.energy = clamp(pet.energy + 40);
    pet.hunger = clamp(pet.hunger + 8);

    updateUI();
    log("Pet woke up well rested.");
  }, 7000);
}

function reset() {
  pet.hunger = 40;
  pet.happiness = 70;
  pet.energy = 60;
  pet.awake = true;

  updateUI();
  log("State reset.");
}


function tick() {
  pet.hunger = clamp(pet.hunger + 3);

  if (pet.awake) {
    pet.energy = clamp(pet.energy - 2);
  }

  if (pet.hunger > 80) {
    pet.happiness = clamp(pet.happiness - 4);
  }

  if (pet.energy < 20) {
    pet.happiness = clamp(pet.happiness - 3);
  }

  if (pet.happiness < 20 && Math.random() < 0.2) {
    pet.happiness = clamp(pet.happiness + 1);
  }

  if (pet.hunger >= 100) {
    log("Pet is starving!");
  }

  if (pet.energy <= 0) {
    pet.awake = false;
    log("Pet collapsed from exhaustion!");
  }

  updateUI();
}

function start() {
  updateUI();
  if (tickInterval) clearInterval(tickInterval);
  tickInterval = setInterval(tick, TICK_MS);
}

feedBtn.addEventListener("click", feed);
playBtn.addEventListener("click", play);
sleepBtn.addEventListener("click", sleep);
resetBtn.addEventListener("click", reset);


start();

window._pet = pet;