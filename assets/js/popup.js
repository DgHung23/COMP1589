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
