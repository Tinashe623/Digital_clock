// Modern Digital Clock Logic

const clockElement = document.getElementById("clock");
const dateElement = document.getElementById("date-display");
const formatBtn = document.getElementById("format-toggle");
const themeBtn = document.getElementById("theme-toggle");

// State
let is24Hour = localStorage.getItem("clockFormat") === "24";
let isDarkMode = localStorage.getItem("theme") !== "light";

// Initialize Theme
document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "light");
formatBtn.textContent = is24Hour ? "24H" : "12H";

const updateClock = () => {
    const now = new Date();
    
    // Update Date
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = now.toLocaleDateString(undefined, dateOptions);

    // Update Time
    let hours = now.getHours();
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

// Event Listeners
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

// Run
setInterval(updateClock, 1000);
updateClock();
