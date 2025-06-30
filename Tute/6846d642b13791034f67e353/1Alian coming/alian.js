alert("👽 Welcome, explorer! Tap the alien emojis to decode their messages...");

const output = document.getElementById("output");
const radar = document.getElementById("radar");
const translator = document.getElementById("translator");
const body = document.getElementById("body");

const symbols = ["🪐", "🔺", "👽", "🌌", "🛸", "💫", "🧬", "☄️", "🌠", "✨", "👾", "🌀"];
const translations = [
    "🌮 Alien craving Earth tacos... extra cheese!",
    "💥 Oops, pressed the black hole button again!",
    "⚠️ 🚫ERROR: Alien virus detected... Shaking reality!",
    "🪩 Let's party on Saturn's rings!",
    "🧼 Earthlings taste like bubblegum. Yum.",
    "📻 Now playing: Galaxy FM 99.9 🚀",
    "🔍 Scanning Earth memes... confused.",
    "🕺 Moonwalk activated. Literally.",
    "🧠 Mind-reading... wait, just static!",
    "🎯 UFO aiming practice… duck!",
    "🎶 Beep bop boop. That means 'hi' in Alienish.",
    "🌀 Spinning into another dimension... brb."
];

for (let i = 0; i < 12; i++) {
    const div = document.createElement("div");
    div.className = "symbol";
    div.style.transform = `rotate(${i * 30}deg)`;

    const emoji = document.createElement("span");
    emoji.textContent = symbols[i];
    emoji.onclick = () => {
        radar.style.transform = `rotate(${i * 30}deg)`;
        output.textContent = translations[i];

        if (symbols[i] === "👽") {
            body.classList.add("shake-screen");
            setTimeout(() => {
                body.classList.remove("shake-screen");
            }, 2000);
        }
    };

    div.appendChild(emoji);
    translator.appendChild(div);
}

// Sparkles
for (let i = 0; i < 30; i++) {
    const s = document.createElement("div");
    s.className = "sparkle";
    s.style.top = `${Math.random() * 100}%`;
    s.style.left = `${Math.random() * 100}%`;
    s.style.animationDuration = `${1 + Math.random() * 2}s`;
    document.body.appendChild(s);
}

// Alien Mode
let alienMode = false;
function toggleAlienMode() {
    alienMode = !alienMode;
    document.querySelector('.switch').textContent = alienMode ? "🔙 Return to Earth Mode" : "👽 Switch to Alien Mode";
    document.documentElement.style.setProperty('--bg', alienMode ? 'linear-gradient(#001000, #000000)' : 'radial-gradient(circle at center, #000015, #000000)');
    document.documentElement.style.setProperty('--text', alienMode ? '#0f0' : '#0ff');
    document.documentElement.style.setProperty('--glow', alienMode ? '#0f0' : '#0ff');
}