(function () {
    const chartRoot = document.querySelector("[data-impact-chart]");
    const canvas = document.querySelector("[data-impact-canvas]");

    if (!chartRoot || !canvas || typeof Chart === "undefined") {
        return;
    }

    const labels = (chartRoot.dataset.impactLabels || "")
        .split(",")
        .map((label) => label.trim())
        .filter(Boolean);
    const values = (chartRoot.dataset.impactValues || "")
        .split(",")
        .map((value) => Number(value.trim()));
    const unit = chartRoot.dataset.impactUnit || "bags per week";

    if (
        labels.length < 2 ||
        labels.length !== values.length ||
        values.some((value) => Number.isNaN(value))
    ) {
        return;
    }

    const existingChart = Chart.getChart(canvas);

    if (existingChart) {
        existingChart.destroy();
    }

    new Chart(canvas, {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: "Average garbage bags collected each week",
                    data: values,
                    borderColor: "#7bc790",
                    backgroundColor: "rgba(123, 199, 144, 0.2)",
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: "#7bc790",
                    pointBorderColor: "#f8fff9",
                    pointBorderWidth: 2,
                    borderWidth: 4,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: {
                duration: 2000,
            },
            interaction: {
                mode: "index",
                intersect: false,
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    displayColors: false,
                    backgroundColor: "rgba(15, 23, 42, 0.94)",
                    titleColor: "#f8fafc",
                    bodyColor: "#cbd5e1",
                    borderColor: "rgba(123, 199, 144, 0.4)",
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label(context) {
                            return `${context.parsed.y} ${unit}`;
                        },
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: "#cbd5e1",
                    },
                    grid: {
                        color: "rgba(203, 213, 225, 0.08)",
                    },
                    border: {
                        color: "rgba(203, 213, 225, 0.12)",
                    },
                },
                y: {
                    ticks: {
                        color: "#cbd5e1",
                    },
                    grid: {
                        color: "rgba(203, 213, 225, 0.08)",
                    },
                    border: {
                        color: "rgba(203, 213, 225, 0.12)",
                    },
                },
            },
        },
    });
})();
