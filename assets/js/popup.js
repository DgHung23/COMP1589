const footerForm = document.querySelector(".footer-form");
const emailInput = document.querySelector(".footer-form__input");
const popup = document.getElementById("subscribePopup");
const closePopup = document.getElementById("closePopup");
const popupOverlay = document.querySelector(".subscribe-popup__overlay");

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
