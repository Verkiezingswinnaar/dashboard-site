
import { getLegend } from "./plugins/legend.js";
import { getTitle } from "./plugins/title.js";
import { getScales } from "./scales.js";
import { getTooltip } from "./plugins/tooltip.js";

export function createChart(ctx) {
    return new Chart(ctx, {
        type: "line",
        data: {},
        options: {
            responsive: true,
            maintainAspectRatio: false,
            parsing: false,

            interaction: {
                mode: "nearest",
                intersect: false
            },
            animation: false,

            plugins: {
                legend: getLegend(),
                title: getTitle(),
                tooltip: getTooltip(),
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'x',
                        threshold: 10
                    },
                    zoom: {
                        wheel: { enabled: true },
                        pinch: { enabled: true },
                        mode: 'x'
                    },
                },
                decimation: {
                    enabled: true,
                    algorithm: "lttb"
                }
            },

            scales: getScales()
        }
    });
}