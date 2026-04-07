(function () {
    const chartRoot = document.querySelector("[data-impact-chart]");

    if (!chartRoot) {
        return;
    }

    const svg = chartRoot.querySelector("[data-impact-svg]");
    const tooltip = chartRoot.querySelector("[data-impact-tooltip]");
    const tooltipMonth = chartRoot.querySelector(
        "[data-impact-tooltip-month]"
    );
    const tooltipValue = chartRoot.querySelector(
        "[data-impact-tooltip-value]"
    );
    const tooltipTrend = chartRoot.querySelector(
        "[data-impact-tooltip-trend]"
    );

    if (!svg || !tooltip || !tooltipMonth || !tooltipValue || !tooltipTrend) {
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

    const svgNS = "http://www.w3.org/2000/svg";
    const viewBox = { width: 560, height: 340 };
    const plot = { left: 70, right: 520, top: 54, bottom: 284 };
    const plotWidth = plot.right - plot.left;
    const plotHeight = plot.bottom - plot.top;
    const roundedMax = Math.max(20, Math.ceil(Math.max(...values) / 20) * 20);
    const tickSteps = 4;
    const tickSize = roundedMax / tickSteps;
    const chartId = `impact-${Math.random().toString(36).slice(2, 8)}`;
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const points = labels.map((label, index) => ({
        index,
        label,
        value: values[index],
        x: plot.left + (plotWidth / (labels.length - 1)) * index,
        y:
            plot.bottom -
            (values[index] / roundedMax) * plotHeight,
    }));

    const createSvgNode = (tagName, attributes = {}) => {
        const node = document.createElementNS(svgNS, tagName);

        Object.entries(attributes).forEach(([name, value]) => {
            node.setAttribute(name, String(value));
        });

        return node;
    };

    const appendText = (parent, attributes, text) => {
        const node = createSvgNode("text", attributes);
        node.textContent = text;
        parent.appendChild(node);
        return node;
    };

    const getLineProps = (pointA, pointB) => {
        const lengthX = pointB.x - pointA.x;
        const lengthY = pointB.y - pointA.y;

        return {
            angle: Math.atan2(lengthY, lengthX),
            length: Math.sqrt(lengthX * lengthX + lengthY * lengthY),
        };
    };

    const getControlPoint = (current, previous, next, reverse = false) => {
        const previousPoint = previous || current;
        const nextPoint = next || current;
        const smoothing = 0.18;
        const line = getLineProps(previousPoint, nextPoint);
        const angle = line.angle + (reverse ? Math.PI : 0);
        const length = line.length * smoothing;

        return {
            x: current.x + Math.cos(angle) * length,
            y: current.y + Math.sin(angle) * length,
        };
    };

    const buildSmoothPath = (pathPoints) =>
        pathPoints.reduce((path, point, index, array) => {
            if (index === 0) {
                return `M ${point.x} ${point.y}`;
            }

            const previousPoint = array[index - 1];
            const startControlPoint = getControlPoint(
                previousPoint,
                array[index - 2],
                point
            );
            const endControlPoint = getControlPoint(
                point,
                previousPoint,
                array[index + 1],
                true
            );

            return `${path} C ${startControlPoint.x} ${startControlPoint.y}, ${endControlPoint.x} ${endControlPoint.y}, ${point.x} ${point.y}`;
        }, "");

    svg.textContent = "";
    svg.setAttribute("viewBox", `0 0 ${viewBox.width} ${viewBox.height}`);
    svg.setAttribute("aria-labelledby", `${chartId}-title ${chartId}-desc`);

    const title = createSvgNode("title", { id: `${chartId}-title` });
    title.textContent = "Garbage reduction in active GreenWish areas";

    const desc = createSvgNode("desc", { id: `${chartId}-desc` });
    desc.textContent =
        "A curved line chart showing garbage dropping from 78 bags per week in January to 31 in June.";

    const defs = createSvgNode("defs");

    const areaGradient = createSvgNode("linearGradient", {
        id: `${chartId}-area-gradient`,
        x1: "0%",
        y1: "0%",
        x2: "0%",
        y2: "100%",
    });
    areaGradient.appendChild(
        createSvgNode("stop", {
            offset: "0%",
            "stop-color": "#6fb987",
            "stop-opacity": "0.34",
        })
    );
    areaGradient.appendChild(
        createSvgNode("stop", {
            offset: "100%",
            "stop-color": "#6fb987",
            "stop-opacity": "0.03",
        })
    );

    const lineGradient = createSvgNode("linearGradient", {
        id: `${chartId}-line-gradient`,
        x1: "0%",
        y1: "0%",
        x2: "100%",
        y2: "0%",
    });
    lineGradient.appendChild(
        createSvgNode("stop", {
            offset: "0%",
            "stop-color": "#8fd3a3",
        })
    );
    lineGradient.appendChild(
        createSvgNode("stop", {
            offset: "100%",
            "stop-color": "#3b6b4d",
        })
    );

    const glowFilter = createSvgNode("filter", {
        id: `${chartId}-glow`,
        x: "-40%",
        y: "-40%",
        width: "180%",
        height: "180%",
    });
    glowFilter.appendChild(
        createSvgNode("feGaussianBlur", {
            stdDeviation: "6",
            result: "blur",
        })
    );
    glowFilter.appendChild(
        createSvgNode("feMerge")
    );

    const merge = glowFilter.querySelector("feMerge");
    merge.appendChild(createSvgNode("feMergeNode", { in: "blur" }));
    merge.appendChild(createSvgNode("feMergeNode", { in: "SourceGraphic" }));

    const clipPath = createSvgNode("clipPath", {
        id: `${chartId}-area-clip`,
    });
    const revealRect = createSvgNode("rect", {
        x: plot.left,
        y: 0,
        width: 0,
        height: viewBox.height,
    });
    clipPath.appendChild(revealRect);

    defs.append(areaGradient, lineGradient, glowFilter, clipPath);
    svg.append(title, desc, defs);

    const verticalGuideLayer = createSvgNode("g");
    const gridLayer = createSvgNode("g");
    const monthLayer = createSvgNode("g");
    const valueLayer = createSvgNode("g");
    const pointLayer = createSvgNode("g");

    points.forEach((point) => {
        verticalGuideLayer.appendChild(
            createSvgNode("line", {
                x1: point.x,
                y1: plot.top,
                x2: point.x,
                y2: plot.bottom,
                class: "impact-chart__vertical-guide",
            })
        );
    });

    for (let step = 0; step <= tickSteps; step += 1) {
        const value = roundedMax - step * tickSize;
        const y = plot.top + (plotHeight / tickSteps) * step;
        const lineClass =
            step === tickSteps ? "impact-chart__axis" : "impact-chart__grid";

        gridLayer.appendChild(
            createSvgNode("line", {
                x1: plot.left,
                y1: y,
                x2: plot.right,
                y2: y,
                class: lineClass,
            })
        );

        appendText(
            gridLayer,
            {
                x: value === 0 ? 40 : 32,
                y: y + 4,
                class: "impact-chart__axis-label",
            },
            String(value)
        );
    }

    points.forEach((point) => {
        appendText(
            monthLayer,
            {
                x: point.x,
                y: plot.bottom + 30,
                "text-anchor": "middle",
                class: "impact-chart__month-label",
            },
            point.label
        );
    });

    const linePathData = buildSmoothPath(points);
    const areaPathData = `${linePathData} L ${points[points.length - 1].x} ${plot.bottom} L ${points[0].x} ${plot.bottom} Z`;

    const areaPath = createSvgNode("path", {
        d: areaPathData,
        class: "impact-chart__area",
        "clip-path": `url(#${chartId}-area-clip)`,
        fill: `url(#${chartId}-area-gradient)`,
    });

    const lineGlow = createSvgNode("path", {
        d: linePathData,
        class: "impact-chart__line-glow",
        filter: `url(#${chartId}-glow)`,
        stroke: `url(#${chartId}-line-gradient)`,
    });

    const linePath = createSvgNode("path", {
        d: linePathData,
        class: "impact-chart__line",
        stroke: `url(#${chartId}-line-gradient)`,
    });

    const traveler = createSvgNode("circle", {
        cx: points[0].x,
        cy: points[0].y,
        r: 8,
        class: "impact-chart__traveler",
        filter: `url(#${chartId}-glow)`,
    });

    svg.append(
        verticalGuideLayer,
        gridLayer,
        areaPath,
        lineGlow,
        linePath,
        valueLayer,
        pointLayer,
        monthLayer,
        traveler
    );

    const pointGroups = [];
    const valueLabels = [];
    let activeIndex = points.length - 1;

    const setActivePoint = (index) => {
        const point = points[index];
        const previousPoint = points[index - 1];
        const changeFromPrevious = previousPoint
            ? previousPoint.value - point.value
            : 0;
        const trendLabel = previousPoint
            ? changeFromPrevious >= 0
                ? `${Math.abs(changeFromPrevious)} fewer bags than ${previousPoint.label}`
                : `${Math.abs(changeFromPrevious)} more bags than ${previousPoint.label}`
            : "Starting baseline for the recovery program";

        activeIndex = index;
        tooltipMonth.textContent = point.label;
        tooltipValue.textContent = `${point.value} ${unit}`;
        tooltipTrend.textContent = trendLabel;

        pointGroups.forEach((group, groupIndex) => {
            group.classList.toggle("is-active", groupIndex === index);
        });

        const stage = chartRoot.querySelector(".impact-chart__stage");
        const stageRect = stage.getBoundingClientRect();
        const svgRect = svg.getBoundingClientRect();
        const pointX =
            svgRect.left -
            stageRect.left +
            (point.x / viewBox.width) * svgRect.width;
        const pointY =
            svgRect.top -
            stageRect.top +
            (point.y / viewBox.height) * svgRect.height;
        const tooltipWidth = tooltip.offsetWidth || 190;
        const safeX = Math.max(
            tooltipWidth / 2 + 10,
            Math.min(pointX, stageRect.width - tooltipWidth / 2 - 10)
        );

        tooltip.style.left = `${safeX}px`;
        tooltip.style.top = `${pointY}px`;
        tooltip.classList.add("is-visible");
    };

    points.forEach((point, index) => {
        const group = createSvgNode("g", {
            class: "impact-chart__point-group",
            tabindex: "0",
            role: "button",
            "aria-label": `${point.label}: ${point.value} ${unit}`,
        });

        const dropLine = createSvgNode("line", {
            x1: point.x,
            y1: point.y,
            x2: point.x,
            y2: plot.bottom,
            class: "impact-chart__drop-line",
        });

        const hitArea = createSvgNode("circle", {
            cx: point.x,
            cy: point.y,
            r: 18,
            class: "impact-chart__point-hit",
        });

        const ring = createSvgNode("circle", {
            cx: point.x,
            cy: point.y,
            r: 13,
            class: "impact-chart__point-ring",
        });

        const core = createSvgNode("circle", {
            cx: point.x,
            cy: point.y,
            r: 7,
            class: "impact-chart__point-core",
        });

        group.append(dropLine, hitArea, ring, core);
        pointLayer.appendChild(group);
        pointGroups.push(group);

        const valueLabel = appendText(
            valueLayer,
            {
                x: point.x,
                y: point.y - 18,
                "text-anchor": "middle",
                class: "impact-chart__value-label",
            },
            String(point.value)
        );

        valueLabels.push(valueLabel);

        ["mouseenter", "focus", "click"].forEach((eventName) => {
            group.addEventListener(eventName, () => setActivePoint(index));
        });
    });

    const totalLength = linePath.getTotalLength();
    linePath.style.strokeDasharray = `${totalLength}`;
    linePath.style.strokeDashoffset = `${totalLength}`;
    lineGlow.style.strokeDasharray = `${totalLength}`;
    lineGlow.style.strokeDashoffset = `${totalLength}`;

    const revealPoint = (index) => {
        if (pointGroups[index]) {
            pointGroups[index].classList.add("is-visible");
        }

        if (valueLabels[index]) {
            valueLabels[index].classList.add("is-visible");
        }
    };

    const finishAnimation = () => {
        linePath.style.strokeDashoffset = "0";
        lineGlow.style.strokeDashoffset = "0";
        revealRect.setAttribute("width", plotWidth);
        traveler.style.opacity = "0";
        points.forEach((_, index) => revealPoint(index));
        setActivePoint(points.length - 1);
    };

    const runAnimation = () => {
        if (chartRoot.dataset.animated === "true") {
            return;
        }

        chartRoot.dataset.animated = "true";

        if (prefersReducedMotion) {
            finishAnimation();
            return;
        }

        traveler.style.opacity = "1";

        const duration = 1900;
        const animationStart = performance.now();

        const animateFrame = (now) => {
            const elapsed = now - animationStart;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentLength = totalLength * easedProgress;
            const revealWidth = plotWidth * easedProgress;
            const travelerPoint = linePath.getPointAtLength(currentLength);

            linePath.style.strokeDashoffset = `${totalLength - currentLength}`;
            lineGlow.style.strokeDashoffset = `${totalLength - currentLength}`;
            revealRect.setAttribute("width", revealWidth);
            traveler.setAttribute("cx", travelerPoint.x);
            traveler.setAttribute("cy", travelerPoint.y);

            points.forEach((point, index) => {
                const threshold = index / (points.length - 1);

                if (easedProgress >= threshold * 0.94) {
                    revealPoint(index);
                }
            });

            if (progress < 1) {
                window.requestAnimationFrame(animateFrame);
                return;
            }

            finishAnimation();
        };

        window.requestAnimationFrame(animateFrame);
    };

    const resizeHandler = () => {
        if (tooltip.classList.contains("is-visible")) {
            setActivePoint(activeIndex);
        }
    };

    window.addEventListener("resize", resizeHandler);

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        runAnimation();
                        observer.disconnect();
                    }
                });
            },
            {
                threshold: 0.35,
            }
        );

        observer.observe(chartRoot);
    } else {
        runAnimation();
    }
})();
