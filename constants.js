export const DATA_URL = "https://verkiezingswinnaar.s3.eu-north-1.amazonaws.com/data.jsonl.gz"
export const IS_NATIONAL_ELECTION = false


export let TITLE_TEXT = "Welke partij wint de verkiezingen van 2025?"
if (!IS_NATIONAL_ELECTION) {
    TITLE_TEXT = "Welke partij groeit het meest sinds de gemeenteraadsverkiezingen van 2022?"
}

//const DATA_URL = "http://localhost:63342/data.jsonl.gz"
export let FILTER_THRESHOLD = 0.5
if (!IS_NATIONAL_ELECTION) {
    // For municipal elections, we don't filter out any parties because we are only reporting relevant parties anyway.
    FILTER_THRESHOLD = -1
}