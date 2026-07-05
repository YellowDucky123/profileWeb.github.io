/* ============================================================
   Kelvin's profile site — vanilla JS, no dependencies.
   ============================================================ */

/* ---------- terminal typing animation ---------- */

const TERMINAL_SCRIPT = [
    { cmd: "whoami", out: ["kelvin jonathan yoga"] },
    { cmd: "cat role.txt", out: ["CS @ UNSW — Security Engineering (2nd yr)"] },
    { cmd: "ls interests/", out: ["ctf/   web-sec/   linux/   coffee/"] },
    { cmd: "sudo make friends", out: ["[sudo] permission granted — scroll down ↓"] },
];

const termEl = document.getElementById("terminal-output");

async function typeTerminal() {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        termEl.innerHTML = TERMINAL_SCRIPT
            .map((l) => `<span class="t-prompt">$ </span>${l.cmd}\n<span class="t-out">${l.out.join("\n")}</span>`)
            .join("\n");
        return;
    }
    for (const line of TERMINAL_SCRIPT) {
        const prompt = document.createElement("span");
        prompt.className = "t-prompt";
        prompt.textContent = "$ ";
        termEl.appendChild(prompt);

        const cmdSpan = document.createElement("span");
        termEl.appendChild(cmdSpan);
        for (const ch of line.cmd) {
            cmdSpan.textContent += ch;
            await sleep(40 + Math.random() * 60);
        }
        await sleep(350);
        termEl.appendChild(document.createTextNode("\n"));

        const outSpan = document.createElement("span");
        outSpan.className = "t-out";
        outSpan.textContent = line.out.join("\n") + "\n";
        termEl.appendChild(outSpan);
        await sleep(500);
    }
    const cursor = document.createElement("span");
    cursor.className = "cursor-blink t-prompt";
    cursor.textContent = "$ ▌";
    termEl.appendChild(cursor);
}
typeTerminal();

/* ---------- resume auto-detection ----------
   Convention: put `resume.pdf` in the repo root and this section
   lights up on its own. No config, no accounts, no build step.  */

const foundEl = document.getElementById("resume-found");
const missingEl = document.getElementById("resume-missing");

fetch("resume.pdf", { method: "HEAD" })
    .then((res) => {
        if (res.ok) {
            foundEl.hidden = false;
            const bytes = Number(res.headers.get("Content-Length"));
            if (bytes > 0) {
                const kb = bytes / 1024;
                document.getElementById("resume-meta").textContent =
                    "resume.pdf · " + (kb > 1024 ? (kb / 1024).toFixed(1) + " MB" : Math.max(1, Math.round(kb)) + " KB");
            }
        } else {
            missingEl.hidden = false;
        }
    })
    .catch(() => {
        // fetch can fail on file:// — optimistically show the download
        // buttons; the <object> tag has its own fallback message.
        foundEl.hidden = false;
    });

/* ---------- cursor spotlight ---------- */

if (window.matchMedia("(pointer: fine)").matches) {
    const root = document.documentElement;
    window.addEventListener("pointermove", (e) => {
        root.style.setProperty("--mx", e.clientX + "px");
        root.style.setProperty("--my", e.clientY + "px");
    }, { passive: true });
}

/* ---------- scroll reveal ---------- */

const observer = new IntersectionObserver(
    (entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        }
    },
    { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

/* ---------- copy email to clipboard ---------- */

const toast = document.getElementById("toast");
let toastTimer;

document.getElementById("copy-email").addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText("kelvinjyoga@gmail.com");
        toast.textContent = "copied ✓";
    } catch {
        toast.textContent = "kelvinjyoga@gmail.com";
    }
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
});

/* ---------- little details ---------- */

// uptime = days since I started uni (Feb 2025)
const started = new Date("2025-02-17");
const days = Math.floor((Date.now() - started) / 86400000);
document.getElementById("uptime").textContent = days + " days";

document.getElementById("year").textContent = new Date().getFullYear();

// tab title guilt-trip
let realTitle = document.title;
document.addEventListener("visibilitychange", () => {
    document.title = document.hidden ? "👀 come back…" : realTitle;
});

// console greeting for fellow snoopers
console.log(
    "%c> whoami\n%ckelvin jonathan yoga — security engineering @ UNSW\n" +
    "%c> nice inspect-element skills. say hi: kelvinjyoga@gmail.com",
    "color:#e9ddb4;font-family:monospace;font-size:14px",
    "color:#f5f5f5;font-family:monospace;font-size:14px",
    "color:#c2c8a6;font-family:monospace;font-size:12px"
);

/* ---------- konami code → matrix rain ---------- */

const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
let konamiPos = 0;

document.addEventListener("keydown", (e) => {
    konamiPos = e.key === KONAMI[konamiPos] ? konamiPos + 1 : (e.key === KONAMI[0] ? 1 : 0);
    if (konamiPos === KONAMI.length) {
        konamiPos = 0;
        matrixRain();
    }
});

// tapping the footer hint works on phones too
document.querySelector(".footer-hint").addEventListener("click", matrixRain);

let matrixRunning = false;

function matrixRain() {
    if (matrixRunning) return;
    matrixRunning = true;

    const canvas = document.getElementById("matrix");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.classList.add("on");

    const glyphs = "アイウエオカキクケコサシスセソ0123456789ABCDEF{}<>/;$#";
    const fontSize = 16;
    const cols = Math.ceil(canvas.width / fontSize);
    const drops = Array.from({ length: cols }, () => Math.random() * -40);

    const interval = setInterval(() => {
        ctx.fillStyle = "rgba(36, 44, 19, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#e9ddb4";
        ctx.font = fontSize + "px monospace";
        for (let i = 0; i < drops.length; i++) {
            const ch = glyphs[Math.floor(Math.random() * glyphs.length)];
            ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
            drops[i] = drops[i] * fontSize > canvas.height && Math.random() > 0.97 ? 0 : drops[i] + 1;
        }
    }, 45);

    setTimeout(() => {
        canvas.classList.remove("on");
        setTimeout(() => {
            clearInterval(interval);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            matrixRunning = false;
        }, 700);
    }, 6000);
}
