import {getScales} from "../scales.js";

export function getZoom() {
    let beforeZoomXMin = null;
    let beforeZoomXMax = null;

    return {
        pan: {
            enabled: true,
            mode: 'x',
            threshold: 10
        },
        zoom: {
            wheel: {enabled: true},
            pinch: {enabled: true},
            mode: 'x',
            onZoomStart: function(eventObject) {
                // Store pre-zoom min/max
                const chart = eventObject.chart;
                const scale = chart.scales.x;
                beforeZoomXMin = scale.min
                beforeZoomXMax = scale.max
            },
            onZoom: function(eventObject) {
                // enforce min/max range
                const chart = eventObject.chart;
                const scale = chart.scales.x;
                const range = scale.max - scale.min;

                const minRange = 10 * 60 * 1000; // 10 minutes
                if (range < minRange) {
                    scale.options.min = beforeZoomXMin;
                    scale.options.max = beforeZoomXMax;
                }

                const maxRange = 24 * 60 * 60 * 1000; // 1 day
                if (range > maxRange) {
                    scale.options.min = beforeZoomXMin;
                    scale.options.max = beforeZoomXMax;
                }
                chart.update('none');
            }
        }
    }
}