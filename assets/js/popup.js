// =================================Pop up for email Subscription=========================

const footerForm = document.querySelector(".footer-form");
const emailInput = document.querySelector(".footer-form__input");
const popup = document.getElementById("subscribePopup");
const closePopup = document.getElementById("closePopup");
const popupOverlay = document.querySelector(".subscribe-popup__overlay");

if (footerForm && emailInput && popup && closePopup && popupOverlay) {
    footerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        if (!emailInput.checkValidity()) {
            emailInput.reportValidity();
            return;
        }

        popup.classList.add("subscribe-popup--show");
        emailInput.value = "";
    });

    closePopup.addEventListener("click", function () {
        popup.classList.remove("subscribe-popup--show");
    });

    popupOverlay.addEventListener("click", function () {
        popup.classList.remove("subscribe-popup--show");
    });
}

// ============================= Pop up for Event Registration =========================

const eventRegisterTriggers = document.querySelectorAll(
    "[data-event-register-trigger]",
);
const eventRegisterPopup = document.getElementById("eventRegisterPopup");
const eventRegisterOverlay = eventRegisterPopup?.querySelector(
    ".subscribe-popup__overlay",
);
const eventRegisterClose = document.getElementById("eventRegisterClose");
const eventRegisterDone = document.getElementById("eventRegisterDone");
const eventRegisterForm = document.getElementById("eventRegisterForm");
const eventRegisterEmail = document.getElementById("eventRegisterEmail");
const eventRegisterFormView = document.getElementById("eventRegisterFormView");
const eventRegisterSuccess = document.getElementById("eventRegisterSuccess");

if (
    eventRegisterTriggers.length > 0 &&
    eventRegisterPopup &&
    eventRegisterOverlay &&
    eventRegisterClose &&
    eventRegisterDone &&
    eventRegisterForm &&
    eventRegisterEmail &&
    eventRegisterFormView &&
    eventRegisterSuccess
) {
    const resetEventRegisterPopup = function () {
        eventRegisterForm.reset();
        eventRegisterFormView.hidden = false;
        eventRegisterSuccess.hidden = true;
    };

    const openEventRegisterPopup = function () {
        resetEventRegisterPopup();
        eventRegisterPopup.classList.add("subscribe-popup--show");
        eventRegisterPopup.setAttribute("aria-hidden", "false");
        eventRegisterEmail.focus();
    };

    const closeEventRegisterPopup = function () {
        eventRegisterPopup.classList.remove("subscribe-popup--show");
        eventRegisterPopup.setAttribute("aria-hidden", "true");
        resetEventRegisterPopup();
    };

    eventRegisterTriggers.forEach(function (trigger) {
        trigger.addEventListener("click", function (event) {
            event.preventDefault();
            openEventRegisterPopup();
        });
    });

    eventRegisterForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!eventRegisterForm.checkValidity()) {
            eventRegisterForm.reportValidity();
            return;
        }

        eventRegisterForm.reset();
        eventRegisterFormView.hidden = true;
        eventRegisterSuccess.hidden = false;
    });

    eventRegisterClose.addEventListener("click", closeEventRegisterPopup);
    eventRegisterDone.addEventListener("click", closeEventRegisterPopup);
    eventRegisterOverlay.addEventListener("click", closeEventRegisterPopup);

    window.addEventListener("keydown", function (event) {
        if (
            event.key === "Escape" &&
            eventRegisterPopup.classList.contains("subscribe-popup--show")
        ) {
            closeEventRegisterPopup();
        }
    });
}

// ============Pop up for Mobile Navigation=========================
const header = document.querySelector(".header");
const headerTop = document.querySelector(".header-top");
const navbar = document.querySelector(".navbar");
const headerAction = document.querySelector(".header-action");

if (header && headerTop && navbar) {
    const navId = navbar.id || "site-navigation";
    navbar.id = navId;

    const mobileToggle = document.createElement("button");
    mobileToggle.type = "button";
    mobileToggle.className = "mobile-nav-toggle";
    mobileToggle.setAttribute("aria-label", "Toggle navigation");
    mobileToggle.setAttribute("aria-controls", navId);
    mobileToggle.setAttribute("aria-expanded", "false");
    mobileToggle.innerHTML = "<span></span><span></span><span></span>";

    if (headerAction) {
        const donateLink = headerAction.querySelector("a");

        if (donateLink) {
            const mobileDonate = donateLink.cloneNode(true);
            mobileDonate.classList.remove("header-action__signup");
            mobileDonate.classList.add("mobile-nav__donate");
            navbar.appendChild(mobileDonate);
        }
    }

    headerTop.appendChild(mobileToggle);

    const mobileOverlay = document.createElement("button");
    mobileOverlay.type = "button";
    mobileOverlay.className = "mobile-nav-overlay";
    mobileOverlay.setAttribute("aria-label", "Close navigation");
    document.body.appendChild(mobileOverlay);

    const closeMobileNav = function () {
        header.classList.remove("header--nav-open");
        document.body.classList.remove("nav-open");
        mobileToggle.setAttribute("aria-expanded", "false");
    };

    const toggleMobileNav = function () {
        const isOpen = header.classList.toggle("header--nav-open");
        document.body.classList.toggle("nav-open", isOpen);
        mobileToggle.setAttribute("aria-expanded", String(isOpen));
    };

    mobileToggle.addEventListener("click", toggleMobileNav);
    mobileOverlay.addEventListener("click", closeMobileNav);

    navbar.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeMobileNav);
    });

    window.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeMobileNav();
        }
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 767.98) {
            closeMobileNav();
        }
    });

    header.classList.add("header--mobile-ready");
}
