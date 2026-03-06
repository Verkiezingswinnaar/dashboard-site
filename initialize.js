
import * as constants from "./constants.js";
import { loadData } from "./updateChart.js";

const ctx = document.getElementById("chart");

const chart = new Chart(ctx, {
    type: "line",
    data: {},
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: getLegend(),
            title: getTitle(),
            tooltip: getTooltip()
        },
        parsing: false,
        interaction: {
            mode: "nearest",
            intersect: false
        },
        scales: getScales()
    }
});

function getLegend() {
    const DEFAULT_WIDTH = 2;
    const HIGHLIGHT_WIDTH = 5;
    const DIM_WIDTH = 1;

    return {
        onHover: (_, legendItem, legend) => {
            const { chart } = legend;

            chart.data.datasets.forEach((dataset, index) => {
                dataset.borderWidth =
                    index === legendItem.datasetIndex
                        ? HIGHLIGHT_WIDTH
                        : DIM_WIDTH;
            });

            chart.update();
        },

        onLeave: (_, __, legend) => {
            const chart = legend.chart;

            chart.data.datasets.forEach(dataset => {
                dataset.borderWidth = DEFAULT_WIDTH;
            });

            chart.update();
        }
    };
}

function getTooltip() {
    return {};
}

function getTitle() {
    return {
        display: true,
        text: constants.TITLE_TEXT,
        font: { size: 18 }
    };
}

function getScales() {
    const yText = constants.IS_NATIONAL_ELECTION
        ? "Prognose stemmen (%)"
        : "Groei stemmen (%)";

    return {
        x: {
            type: "time",
            time: {
                unit: "minute",
                stepSize: 30,
                displayFormats: {
                    minute: "dd-MM HH:mm"
                }
            },
            ticks: {
                autoSkip: false
            }
        },

        y: {
            beginAtZero: true,
            display: true,
            title: {
                display: true,
                text: yText,
                font: {
                    size: 18,
                    weight: "bold",
                    lineHeight: 1.2
                }
            }
        }
    };
}

loadData(chart);
setInterval(loadData, 5000, chart);

