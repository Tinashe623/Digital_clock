// Modern Digital Clock & Utilities Logic

// Elements - Clock
const clockElement = document.getElementById("clock");
const dateElement = document.getElementById("date-display");
const greetingElement = document.getElementById("greeting-display");
const quoteElement = document.getElementById("quote-display");
const formatBtn = document.getElementById("format-toggle");
const themeBtn = document.getElementById("theme-toggle");

// Elements - Tabs
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

// Elements - Stopwatch
const swDisplay = document.querySelector(".stopwatch-display");
const swStartBtn = document.getElementById("sw-start");
const swStopBtn = document.getElementById("sw-stop");
const swLapBtn = document.getElementById("sw-lap");
const swResetBtn = document.getElementById("sw-reset");
const swLapsList = document.getElementById("laps-list");

// State - Clock
let is24Hour = localStorage.getItem("clockFormat") === "24";
let isDarkMode = localStorage.getItem("theme") !== "light";

// State - Stopwatch
let swInterval;
let swStartTime;
let swElapsedTime = 0;
let swRunning = false;
let swLaps = [];

// Quotes Data
const quotes = [
    "The only way to do great work is to love what you do.",
    "Time is what we want most, but what we use worst.",
    "The two most powerful warriors are patience and time.",
    "Lost time is never found again.",
    "Time is a created thing."
];

// Initialize
document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "light");
formatBtn.textContent = is24Hour ? "24H" : "12H";
quoteElement.textContent = `"${quotes[Math.floor(Math.random() * quotes.length)]}"`;

// Initialize - Stopwatch button states
swStopBtn.disabled = true;
swLapBtn.disabled = true;
swResetBtn.disabled = true;

const updateClock = () => {
    const now = new Date();
    
    // Update Greeting
    const hours24 = now.getHours();
    let greeting = "Good Evening";
    if (hours24 < 12) greeting = "Good Morning";
    else if (hours24 < 18) greeting = "Good Afternoon";
    greetingElement.textContent = greeting;

    // Update Date
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = now.toLocaleDateString(undefined, dateOptions);

    // Update Time
    let hours = hours24;
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    let meridian = "";

    if (!is24Hour) {
        meridian = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
    }

    const hoursStr = hours.toString().padStart(2, "0");
    clockElement.innerHTML = `${hoursStr}:${minutes}:${seconds} ${!is24Hour ? `<span class="meridian">${meridian}</span>` : ''}`;
};

// --- Tab Logic ---
tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const tabId = btn.getAttribute("data-tab");
        
        tabBtns.forEach(b => b.classList.remove("active"));
        tabContents.forEach(c => c.classList.remove("active"));
        
        btn.classList.add("active");
        document.getElementById(tabId).classList.add("active");
    });
});

// --- Clock Controls ---
formatBtn.addEventListener("click", () => {
    is24Hour = !is24Hour;
    localStorage.setItem("clockFormat", is24Hour ? "24" : "12");
    formatBtn.textContent = is24Hour ? "24H" : "12H";
    updateClock();
});

themeBtn.addEventListener("click", () => {
    isDarkMode = !isDarkMode;
    const theme = isDarkMode ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
});

// --- Stopwatch Logic ---
const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    const msPortion = Math.floor((ms % 1000) / 10).toString().padStart(2, "0");
    return `${h}:${m}:${s}.<span class="ms">${msPortion}</span>`;
};

swStartBtn.addEventListener("click", () => {
    if (!swRunning) {
        swStartTime = Date.now() - swElapsedTime;
        swInterval = setInterval(() => {
            swElapsedTime = Date.now() - swStartTime;
            swDisplay.innerHTML = formatTime(swElapsedTime);
        }, 10);
        swRunning = true;
        swStartBtn.disabled = true;
        swStopBtn.disabled = false;
        swLapBtn.disabled = false;
        swResetBtn.disabled = false;
        swStartBtn.classList.add("disabled");
    }
});

swStopBtn.addEventListener("click", () => {
    if (swRunning) {
        clearInterval(swInterval);
        swRunning = false;
        swStartBtn.disabled = false;
        swStopBtn.disabled = true;
        swLapBtn.disabled = true;
        swStartBtn.classList.remove("disabled");
    }
});

swLapBtn.addEventListener("click", () => {
    if (swRunning) {
        const lapTime = formatTime(swElapsedTime);
        swLaps.unshift(lapTime);
        const li = document.createElement("li");
        li.innerHTML = `<span>Lap ${swLaps.length}</span> <span>${lapTime}</span>`;
        swLapsList.prepend(li);
    }
});

swResetBtn.addEventListener("click", () => {
    clearInterval(swInterval);
    swRunning = false;
    swElapsedTime = 0;
    swLaps = [];
    swDisplay.innerHTML = `00:00:00.<span class="ms">00</span>`;
    swStartBtn.disabled = false;
    swStopBtn.disabled = true;
    swLapBtn.disabled = true;
    swResetBtn.disabled = true;
    swStartBtn.classList.remove("disabled");
    swLapsList.innerHTML = "";
});

// Run
setInterval(updateClock, 1000);
updateClock();
