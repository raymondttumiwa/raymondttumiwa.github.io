const themeToggles = Array.from(document.querySelectorAll("[data-theme-toggle]"));
const savedTheme = localStorage.getItem("theme");
const savedQuotesStorageKey = "savedBlogQuotes";
const blogCtaConfig = {
    whatsappNumber: "6281281865018",
    readingPlanUrl: "../365_onboarding.html",
};

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

function initializeReadingTimeIndicators() {
    const readingTimeElements = document.querySelectorAll(".post-header .project-read-time");
    readingTimeElements.forEach((readingTimeElement) => {
        const explicitMinutes = Number.parseInt(readingTimeElement.dataset.readingMinutes || "", 10);
        const fallbackMatch = (readingTimeElement.textContent || "").match(/\d+/);
        const fallbackMinutes = fallbackMatch ? Number.parseInt(fallbackMatch[0], 10) : Number.NaN;
        const minutes = Number.isFinite(explicitMinutes) && explicitMinutes > 0 ? explicitMinutes : fallbackMinutes;

        if (!Number.isFinite(minutes) || minutes <= 0) {
            return;
        }

        readingTimeElement.textContent = `Reading Time: ${minutes} minute${minutes === 1 ? "" : "s"}`;
    });
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

function buildCalloutActionButtons() {
    const actionBlock = document.createElement("div");
    actionBlock.className = "callout-action-block";

    const actionGuide = document.createElement("p");
    actionGuide.className = "callout-action-guide";
    actionGuide.textContent = "Don't know where to start? Let's start together. Send your prayer request on WhatsApp or join our 365 Bible reading journey today.";

    const actionButtons = document.createElement("div");
    actionButtons.className = "callout-action-buttons";

    const whatsappButton = document.createElement("a");
    whatsappButton.href = `https://wa.me/${blogCtaConfig.whatsappNumber}`;
    whatsappButton.target = "_blank";
    whatsappButton.rel = "noopener noreferrer";
    whatsappButton.className = "callout-cta-btn whatsapp-cta-btn";
    whatsappButton.dataset.whatsappNumber = blogCtaConfig.whatsappNumber;
    whatsappButton.dataset.whatsappContext = "blog-title";
    whatsappButton.innerHTML = "<i class=\"fa-brands fa-whatsapp\" aria-hidden=\"true\"></i><span>WhatsApp for Prayer or Connection</span>";

    const readingPlanButton = document.createElement("a");
    readingPlanButton.href = blogCtaConfig.readingPlanUrl;
    readingPlanButton.className = "callout-cta-btn reading-plan-cta-btn";
    readingPlanButton.innerHTML = "<i class=\"fa-solid fa-book-bible\" aria-hidden=\"true\"></i><span>Join 365 Bible Reading Plan</span>";

    actionButtons.append(whatsappButton, readingPlanButton);
    actionBlock.append(actionGuide, actionButtons);
    return actionBlock;
}

function initializeCalloutActionButtons() {
    const calloutContents = document.querySelectorAll(
        ".blog-content .collaboration-callout[data-collapsible=\"true\"] .callout-content"
    );

    calloutContents.forEach((calloutContent) => {
        const hasActionButtons = calloutContent.querySelector(".callout-action-buttons");
        if (hasActionButtons) {
            return;
        }

        calloutContent.appendChild(buildCalloutActionButtons());
    });
}

function initializeWhatsAppCtas() {
    const whatsappCtas = document.querySelectorAll(".whatsapp-cta-btn");
    if (whatsappCtas.length === 0) {
        return;
    }

    const postTitle = document.querySelector(".post-title-main")?.textContent?.trim() || "";

    whatsappCtas.forEach((ctaLink) => {
        const rawNumber = ctaLink.dataset.whatsappNumber || "6281281865018";
        const sanitizedNumber = rawNumber.replace(/[^\d]/g, "");
        if (!sanitizedNumber) {
            return;
        }

        const useBlogTitle = ctaLink.dataset.whatsappContext === "blog-title";
        const customTitle = ctaLink.dataset.postTitle?.trim() || "";
        const resolvedTitle = customTitle || (useBlogTitle ? postTitle : "");

        const intro = resolvedTitle
            ? `Hi Raymond, I just read your blog post "${resolvedTitle}" and would love to connect with you.`
            : "Hi Raymond, I just read your blog and would love to connect with you.";
        const message = `${intro}\n\nHere is my prayer request: `;

        ctaLink.href = `https://wa.me/${sanitizedNumber}?text=${encodeURIComponent(message)}`;
    });
}

function initializeQuoteActions() {
    const blogContent = document.querySelector(".blog-content");
    if (!blogContent) {
        return;
    }

    const actionsMenu = document.createElement("div");
    actionsMenu.className = "quote-actions";
    actionsMenu.dataset.visible = "false";
    actionsMenu.setAttribute("aria-hidden", "true");
    actionsMenu.innerHTML = [
        "<button type=\"button\" class=\"quote-action-btn\" data-quote-action=\"tweet\">Tweet Quote</button>",
        "<button type=\"button\" class=\"quote-action-btn\" data-quote-action=\"save\">Save Quote</button>",
    ].join("");
    document.body.appendChild(actionsMenu);

    const saveToast = document.createElement("div");
    saveToast.className = "quote-save-toast";
    saveToast.dataset.visible = "false";
    saveToast.setAttribute("role", "status");
    saveToast.setAttribute("aria-live", "polite");
    document.body.appendChild(saveToast);

    let activeQuote = "";
    let toastTimerId;

    const showToast = (message) => {
        if (toastTimerId) {
            window.clearTimeout(toastTimerId);
        }

        saveToast.textContent = message;
        saveToast.dataset.visible = "true";
        toastTimerId = window.setTimeout(() => {
            saveToast.dataset.visible = "false";
        }, 1800);
    };

    const hideActionsMenu = () => {
        actionsMenu.dataset.visible = "false";
        actionsMenu.setAttribute("aria-hidden", "true");
    };

    const positionActionsMenu = (selectionRect) => {
        actionsMenu.dataset.visible = "true";
        actionsMenu.setAttribute("aria-hidden", "false");
        actionsMenu.style.left = "0px";
        actionsMenu.style.top = "0px";

        const menuRect = actionsMenu.getBoundingClientRect();
        const viewportPadding = 10;
        const floatingGap = 10;
        const viewLeft = window.scrollX + viewportPadding;
        const viewRight = window.scrollX + window.innerWidth - viewportPadding;
        const centeredLeft = selectionRect.left + window.scrollX + (selectionRect.width / 2) - (menuRect.width / 2);
        const clampedLeft = Math.min(Math.max(centeredLeft, viewLeft), Math.max(viewLeft, viewRight - menuRect.width));

        let top = selectionRect.top + window.scrollY - menuRect.height - floatingGap;
        const minTop = window.scrollY + viewportPadding;
        if (top < minTop) {
            top = selectionRect.bottom + window.scrollY + floatingGap;
        }

        actionsMenu.style.left = `${clampedLeft}px`;
        actionsMenu.style.top = `${top}px`;
    };

    const getSelectionDetails = () => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
            return null;
        }

        const range = selection.getRangeAt(0);
        const ancestorNode = range.commonAncestorContainer;
        const anchorElement = ancestorNode.nodeType === Node.TEXT_NODE ? ancestorNode.parentElement : ancestorNode;

        if (!(anchorElement instanceof Element) || !blogContent.contains(anchorElement)) {
            return null;
        }

        const quoteText = selection.toString().replace(/\s+/g, " ").trim();
        if (quoteText.length < 12) {
            return null;
        }

        const selectionRect = range.getBoundingClientRect();
        if (selectionRect.width === 0 && selectionRect.height === 0) {
            return null;
        }

        return { quoteText, selectionRect };
    };

    const updateSelectionActions = () => {
        const selectionDetails = getSelectionDetails();
        if (!selectionDetails) {
            hideActionsMenu();
            return;
        }

        activeQuote = selectionDetails.quoteText;
        positionActionsMenu(selectionDetails.selectionRect);
    };

    const saveQuoteLocally = (quoteText) => {
        const postTitle = document.querySelector(".post-title-main")?.textContent?.trim() || document.title;
        const quoteRecord = {
            text: quoteText,
            postTitle,
            url: window.location.href,
            savedAt: new Date().toISOString(),
        };

        let savedQuotes = [];
        try {
            const rawQuotes = localStorage.getItem(savedQuotesStorageKey);
            const parsedQuotes = rawQuotes ? JSON.parse(rawQuotes) : [];
            savedQuotes = Array.isArray(parsedQuotes) ? parsedQuotes : [];
        } catch {
            savedQuotes = [];
        }

        const alreadySaved = savedQuotes.some((item) => item?.text === quoteRecord.text && item?.url === quoteRecord.url);
        if (alreadySaved) {
            return false;
        }

        savedQuotes.unshift(quoteRecord);
        localStorage.setItem(savedQuotesStorageKey, JSON.stringify(savedQuotes.slice(0, 150)));
        return true;
    };

    actionsMenu.addEventListener("click", async (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }

        const actionButton = target.closest(".quote-action-btn");
        if (!(actionButton instanceof HTMLButtonElement) || !activeQuote) {
            return;
        }

        const actionType = actionButton.dataset.quoteAction;
        if (actionType === "tweet") {
            const postTitle = document.querySelector(".post-title-main")?.textContent?.trim() || "";
            const shortenedQuote = activeQuote.length > 220 ? `${activeQuote.slice(0, 217)}...` : activeQuote;
            const tweetText = postTitle ? `"${shortenedQuote}"\n\n- ${postTitle}` : `"${shortenedQuote}"`;
            const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(window.location.href)}`;
            window.open(tweetUrl, "_blank", "noopener,noreferrer");
            hideActionsMenu();
            return;
        }

        if (actionType === "save") {
            const isNewQuote = saveQuoteLocally(activeQuote);
            if (navigator.clipboard?.writeText) {
                try {
                    await navigator.clipboard.writeText(activeQuote);
                } catch {
                    // Clipboard permission can fail on some browsers.
                }
            }
            showToast(isNewQuote ? "Quote saved." : "Quote already saved.");
            hideActionsMenu();
        }
    });

    const deferredSelectionUpdate = () => {
        window.setTimeout(updateSelectionActions, 0);
    };

    document.addEventListener("mouseup", deferredSelectionUpdate);
    document.addEventListener("keyup", deferredSelectionUpdate);
    document.addEventListener(
        "touchend",
        () => {
            window.setTimeout(updateSelectionActions, 30);
        },
        { passive: true }
    );

    document.addEventListener("mousedown", (event) => {
        const target = event.target;
        if (!(target instanceof Node) || actionsMenu.contains(target)) {
            return;
        }

        hideActionsMenu();
    });

    window.addEventListener(
        "scroll",
        () => {
            hideActionsMenu();
        },
        { passive: true }
    );
}

function initializeOnboardingChecklist() {
    const checklist = document.querySelector(".onboarding-checklist");
    if (!checklist) {
        return;
    }

    const checklistStatus = document.querySelector("[data-checklist-status]");
    const checklistFill = document.querySelector("[data-checklist-fill]");
    const checkboxes = Array.from(checklist.querySelectorAll("input[type=\"checkbox\"][data-check-id]"));
    if (checkboxes.length === 0) {
        return;
    }

    const storageKey = "onboarding365Checklist";
    let savedState = {};

    try {
        const rawState = localStorage.getItem(storageKey);
        const parsedState = rawState ? JSON.parse(rawState) : {};
        savedState = parsedState && typeof parsedState === "object" ? parsedState : {};
    } catch {
        savedState = {};
    }

    const syncUi = () => {
        const checkedCount = checkboxes.filter((checkbox) => checkbox.checked).length;
        const totalCount = checkboxes.length;
        const progressPercent = Math.round((checkedCount / totalCount) * 100);

        if (checklistStatus) {
            checklistStatus.textContent = checkedCount === totalCount
                ? `Completed ${checkedCount} of ${totalCount}. You're ready for Day 1.`
                : `Completed ${checkedCount} of ${totalCount}.`;
        }

        if (checklistFill) {
            checklistFill.style.width = `${progressPercent}%`;
        }
    };

    checkboxes.forEach((checkbox) => {
        const checkId = checkbox.dataset.checkId || "";
        if (checkId && savedState[checkId] === true) {
            checkbox.checked = true;
        }

        checkbox.addEventListener("change", () => {
            if (checkId) {
                savedState[checkId] = checkbox.checked;
                localStorage.setItem(storageKey, JSON.stringify(savedState));
            }
            syncUi();
        });
    });

    syncUi();
}

function topFunction() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

if (savedTheme === "dark" || savedTheme === "light") {
    applyTheme(savedTheme);
} else {
    applyTheme("dark");
}

themeToggles.forEach((toggleBtn) => {
    toggleBtn.addEventListener("click", toggleTheme);
});

window.addEventListener("scroll", handleScroll, { passive: true });
window.addEventListener("load", () => {
    initializeReadingTimeIndicators();
    setTodayDate();
    initializeCalloutToggles();
    initializeCalloutActionButtons();
    initializeWhatsAppCtas();
    initializeQuoteActions();
    initializeOnboardingChecklist();
    initializeMobileMenus();
    handleScroll();
});
