const themeToggles = Array.from(document.querySelectorAll("[data-theme-toggle]"));
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

function updateThemeToggleIcons(theme) {
    const icon = theme === "dark" ? "☀️" : "🌙";

    themeToggles.forEach((toggleBtn) => {
        const iconEl = toggleBtn.querySelector(".theme-icon");
        if (iconEl) {
            iconEl.textContent = icon;
            return;
        }

        toggleBtn.textContent = icon;
    });
}

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    updateThemeToggleIcons(theme);
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

function initializeMobileMenus() {
    const navSplits = document.querySelectorAll(".nav-split");

    navSplits.forEach((navSplit) => {
        const menuToggle = navSplit.querySelector(".mobile-menu-toggle");
        const menu = navSplit.querySelector(".mobile-menu");
        if (!menuToggle || !menu) {
            return;
        }

        const searchInput = menu.querySelector(".mobile-menu-search");
        const menuItems = Array.from(menu.querySelectorAll(".mobile-menu-item"));
        const emptyState = menu.querySelector(".mobile-menu-empty");

        const filterMenuItems = () => {
            const query = (searchInput?.value || "").trim().toLowerCase();
            let visibleCount = 0;

            menuItems.forEach((item) => {
                const label = (item.dataset.menuLabel || item.textContent || "").toLowerCase();
                const matches = label.includes(query);
                item.hidden = !matches;
                if (matches) {
                    visibleCount += 1;
                }
            });

            if (emptyState) {
                emptyState.hidden = visibleCount > 0;
            }
        };

        const closeMenu = () => {
            if (menu.hidden) {
                return;
            }

            menu.hidden = true;
            menuToggle.setAttribute("aria-expanded", "false");
            if (searchInput) {
                searchInput.value = "";
            }
            filterMenuItems();
        };

        const openMenu = () => {
            menu.hidden = false;
            menuToggle.setAttribute("aria-expanded", "true");
            filterMenuItems();
            searchInput?.focus();
        };

        menuToggle.addEventListener("click", (event) => {
            event.stopPropagation();
            if (menu.hidden) {
                openMenu();
                return;
            }

            closeMenu();
        });

        searchInput?.addEventListener("input", filterMenuItems);

        menuItems.forEach((item) => {
            item.addEventListener("click", closeMenu);
        });

        document.addEventListener("click", (event) => {
            const target = event.target;
            if (menu.hidden || !(target instanceof Node)) {
                return;
            }

            if (!menu.contains(target) && !menuToggle.contains(target)) {
                closeMenu();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });

        filterMenuItems();
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

themeToggles.forEach((toggleBtn) => {
    toggleBtn.addEventListener("click", toggleTheme);
});

window.addEventListener("scroll", handleScroll, { passive: true });
window.addEventListener("load", () => {
    setTodayDate();
    initializeCalloutToggles();
    initializeMobileMenus();
    handleScroll();
});
