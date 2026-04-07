document.addEventListener("DOMContentLoaded", () => {
    const statNumbers = Array.from(document.querySelectorAll("[class]")).filter(
        (el) =>
            [...el.classList].some((className) =>
                className.endsWith("__number"),
            ),
    );

    function getTargetValue(text) {
        const cleanText = text.trim();
        const numericValue = parseFloat(cleanText.replace(/[^\d.]/g, ""));

        if (/k/i.test(cleanText)) return numericValue * 1000;
        return numericValue;
    }

    function formatValue(value, originalText) {
        const hasPlus = originalText.includes("+");
        const hasPercent = originalText.includes("%");
        const hasK = /k/i.test(originalText);

        let display = "";

        if (hasK) {
            const kValue = value / 1000;
            display =
                kValue % 1 === 0
                    ? `${kValue.toFixed(0)}K`
                    : `${kValue.toFixed(1)}K`;
        } else if (hasPercent) {
            display = `${Math.round(value)}%`;
        } else {
            display = Number.isInteger(value)
                ? `${Math.round(value)}`
                : `${value.toFixed(1)}`;
        }

        if (hasPlus) display += "+";

        return display;
    }

    function animateStat(element, duration = 1000) {
        if (element.dataset.animated === "true") return;
        element.dataset.animated = "true";

        const originalText = element.textContent.trim();
        const targetValue = getTargetValue(originalText);
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = targetValue * easedProgress;

            element.textContent = formatValue(currentValue, originalText);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = formatValue(targetValue, originalText);
            }
        }

        requestAnimationFrame(update);
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateStat(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.4 },
    );

    statNumbers.forEach((stat) => observer.observe(stat));
});
