const toggle = document.getElementById("dark-mode-toggle");
const savedTheme = localStorage.getItem("theme");

function updateProgressBar() {
    const progressBar = document.getElementById("myBar");
    if (!progressBar) {
        return;
    }

    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const pageHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = pageHeight > 0 ? (winScroll / pageHeight) * 100 : 0;
    progressBar.style.width = `${scrolled}%`;
}

function updateBackToTopButton() {
    const topBtn = document.getElementById("backToTop");
    if (!topBtn) {
        return;
    }

    const showButton = document.documentElement.scrollTop > 300 || document.body.scrollTop > 300;
    topBtn.style.display = showButton ? "block" : "none";
}

function handleScroll() {
    updateProgressBar();
    updateBackToTopButton();
}

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    if (toggle) {
        toggle.textContent = theme === "dark" ? "☀️" : "🌙";
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
}

function setTodayDate() {
    const dateElement = document.getElementById("today-date");
    if (!dateElement) {
        return;
    }

    const today = new Date();
    const options = { month: "short", day: "numeric", year: "numeric" };
    dateElement.textContent = today.toLocaleDateString("en-US", options);
}

function initializeCalloutToggles() {
    const callouts = document.querySelectorAll(".collaboration-callout[data-collapsible=\"true\"]");

    callouts.forEach((callout) => {
        const toggleBtn = callout.querySelector(".callout-toggle");
        const content = callout.querySelector(".callout-content");
        if (!toggleBtn || !content) {
            return;
        }

        const startOpen = callout.dataset.open === "true";
        toggleBtn.setAttribute("aria-expanded", String(startOpen));
        content.hidden = !startOpen;

        toggleBtn.addEventListener("click", () => {
            const isOpen = toggleBtn.getAttribute("aria-expanded") === "true";
            const nextOpen = !isOpen;

            toggleBtn.setAttribute("aria-expanded", String(nextOpen));
            callout.dataset.open = String(nextOpen);
            content.hidden = !nextOpen;
        });
    });
}

function topFunction() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

if (savedTheme === "dark") {
    applyTheme("dark");
} else {
    applyTheme("light");
}

if (toggle) {
    toggle.addEventListener("click", toggleTheme);
}

window.addEventListener("scroll", handleScroll, { passive: true });
window.addEventListener("load", () => {
    setTodayDate();
    initializeCalloutToggles();
    handleScroll();
});
