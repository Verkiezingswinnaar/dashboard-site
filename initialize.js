
import {loadData} from "./updateChart.js";

const ctx = document.getElementById('chart');

const chart = new Chart(ctx, {
    type: 'line',
    data: {
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: "Welke partij wordt de grootste?",
                font: {
                    size: 18
                }
            }
        },
        parsing: false,
        interaction: {
            mode: 'nearest',
            intersect: false
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'minute',
                    stepSize: 30,
                    displayFormats: {
                        minute: 'dd-MM HH:mm'
                    }
                },
                ticks: {
                    autoSkip: false
                    //source: 'auto'
                }
            },
            y: {
                beginAtZero: true,
                display: true,
                title: {
                    display: true,
                    text: 'Prognose stemmen (%)',
                    font: {
                        size: 18,
                        weight: 'bold',
                        lineHeight: 1.2,
                    }
                }
            }
        }
    }
});

loadData(chart);
setInterval(loadData, 60000, chart); // update every minute