
const DATA_URL = "https://verkiezingswinnaar.s3.eu-north-1.amazonaws.com/data.jsonl.gz"
//const DATA_URL = "http://localhost:63342/data.jsonl.gz"

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

/**
 * @param {Chart} chart -
 */
export async function loadData(chart) {
    fetchGzipJSONL(DATA_URL)
        .then(snapshots => {
            console.log("JSONL data:", snapshots);
            processData(chart, snapshots)
        })
        .catch(err => {
            console.error("Error reading gzipped JSONL:", err);
        });
}

function processData(chart, snapshots) {
    try {
        let chartData = chart.data
        let hasReachedThreshold = {}

        // Filter out all parties that are unlikely to get a seat
        // (=less than 0.5% of the expected votes in all timestamps)
        for (let snapshotIdx in snapshots) {
            let snapshot = snapshots[snapshotIdx] // Snapshot JSON that was exported from Python
            for (let partyName in snapshot.party_snapshots) {
                let partySnapshot = snapshot.party_snapshots[partyName]
                hasReachedThreshold[partyName] = hasReachedThreshold[partyName] || partySnapshot.votes_percentage > 0.5
            }
        }

        // Get all parties that have reached the 0.5% threshold
        let partyNames = Object.keys(hasReachedThreshold).filter(key => hasReachedThreshold[key]);
        partyNames.sort()

        // Check whether a party was marked as 'hidden' by the user before the update
        let isVisible = {}
        for (let chartDatasetIndex in chartData.datasets) {
            let dataset = chartData.datasets[chartDatasetIndex]
            let partyName = dataset.label
            isVisible[partyName] = chart.isDatasetVisible(chartDatasetIndex)
        }

        let chartDatasetIndex = 0
        for (let partyIdx in partyNames) {
            let partyName = partyNames[partyIdx]

            let isHidden = false
            if (typeof isVisible[partyName] !== "undefined" && !isVisible[partyName]) {
                isHidden = true
            }

            let borderWidth = 2
            if (chartData.datasets[chartDatasetIndex]) {
                borderWidth = chartData.datasets[chartDatasetIndex].borderWidth
            }

            if (hasReachedThreshold[partyName]) {
                chartData.datasets[chartDatasetIndex] = {
                    data: snapshots.map(snapshot => ({
                        x: snapshot.timestamp,
                        y: snapshot.party_snapshots[partyName].votes_percentage
                    })),
                    label: partyName,
                    borderWidth: borderWidth,
                    tension: 0.2,
                    borderColor: partyColors[partyName],
                    backgroundColor: partyColors[partyName],
                    hidden: isHidden // Hide a party again if the party was hidden by the user.
                };
                chartDatasetIndex += 1
            }
        }

        // Change the end of the x-axis to the whole hour after the end of the most recent snapshot.
        let lastSnapshot = snapshots[snapshots.length - 1]
        let millisecondsToHour = 3600 * 1000
        chart.options.scales.x.max = Math.ceil(lastSnapshot.timestamp / millisecondsToHour) * millisecondsToHour;

        chart.update('none');


    } catch (err) {
        console.error("Data fetch failed:", err);
    }
}

async function fetchGzipJSONL(url) {
    // Fetch gzip file as ArrayBuffer
    const response = await fetch(url, {cache: 'no-store'});
    const compressedBuffer = await response.arrayBuffer();

    // Decompress using pako
    const decompressed = pako.ungzip(new Uint8Array(compressedBuffer));

    // Convert to string
    const text = new TextDecoder('utf-8').decode(decompressed);

    // Split into lines and parse each JSON object
    const lines = text.split("\n").filter(line => line.trim() !== "");
    const data = lines.map(line => JSON.parse(line));

    return data;
}

