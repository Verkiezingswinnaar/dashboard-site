
const DATA_URL = "https://verkiezingswinnaar.s3.eu-north-1.amazonaws.com/data_manual.json"

const partyNames = [
    'LOKAAL', 'D66', 'PVV', 'VVD', 'GLPVDA', 'CDA', 'JA21', 'FVD', 'SGP', 'BBB', 'DENK', 'CU',
    'PVDD', 'SP', '50PLUS', 'VOLT', 'BIJ1', 'NSC', 'BVNL', 'VREVDIER', 'PIRATEN', 'LP', 'FNP',
    'DELINIE', 'NLPLAN', 'VRIJVER', 'ELLECT', 'PVDR', 'OVERIG']

const partyColors = {
    LOKAAL: "#1ABC9C",
    VVD: "#1F4E9E",        // Blue
    PVV: "#003366",        // Dark Blue
    CDA: "#008B45",        // Green
    D66: "#00A859",        // Bright Green
    SP: "#E30613",         // Red
    FVD: "#7A1F1F",        // Dark Red
    PVDD: "#006400",       // Dark Green
    CU: "#00AEEF",         // Light Blue
    SGP: "#FF7F00",        // Orange
    DENK: "#00B140",       // Green
    JA21: "#1F2A44",       // Dark Blue
    BBB: "#92C83E",        // Farmer Green
    VOLT: "#5A2D82",       // Purple
    BIJ1: "#000000",       // Black
    GLPVDA: "#8E1C3A",
    "50PLUS": "#800080"
};

export async function loadData(chart) {
    try {
        const response = await fetch(DATA_URL + '?t=' + Date.now(), {
            cache: 'no-store'
        });
        const data = await response.json();
        let chartData = chart.data
        let hasReachedThreshold = {}

        for (let timestamp in data) {
            let d = data[timestamp]
            for (let partyIdx in partyNames) {
                let partyName = partyNames[partyIdx]
                if (d.r[partyName]) {
                    hasReachedThreshold[partyName] = hasReachedThreshold[partyIdx] || d.r[partyName].Epercentage > 1
                }
            }
        }

        let chartDatasetIndex = 0
        for (let partyIdx in partyNames) {
            let partyName = partyNames[partyIdx]

            if (hasReachedThreshold[partyName]) {
                chartData.datasets[chartDatasetIndex] = {
                    data: data.map(d => ({
                        x: d.t,
                        y: d.r[partyName].Epercentage
                    })),
                    label: partyName,
                    borderWidth: 2,
                    tension: 0.2,
                    borderColor: partyColors[partyName],
                    backgroundColor: partyColors[partyName]
                };
                chartDatasetIndex += 1
            }
        }
        chart.update('none');
    } catch (err) {
        console.error("Data fetch failed:", err);
    }
}