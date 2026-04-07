const ctx = document.getElementById("emissionChart");

const chart = new Chart(ctx, {
    type: "line",
    data: {
        labels: [2000, 2003, 2006, 2009, 2012, 2015, 2018, 2021, 2024, 2026],
        datasets: [
            {
                label: "Global CO₂ Emissions (Gigatons)",
                data: [25, 26.5, 28, 29, 31, 33, 35, 36, 38, 140],
                borderColor: "#38bdf8",
                backgroundColor: "rgba(56,189,248,0.2)",
                fill: true,
                tension: 0.4,
                pointRadius: 4,
            },
        ],
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                ticks: {
                    color: "#cbd5e1",
                },
            },
            y: {
                ticks: {
                    color: "#cbd5e1",
                },
            },
        },
        animation: {
            duration: 2000,
        },
    },
});

/* Scroll animation */

const graph = document.querySelector(".graph-box");
const text = document.querySelector(".text-box");

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            graph.classList.add("show");
            text.classList.add("show");
        }
    });
});

observer.observe(document.querySelector(".emission-section"));
