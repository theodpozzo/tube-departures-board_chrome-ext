const csv = require('csv-parser');
const fs = require('fs');

function getNaptanCodes() {
    const results = [];

    fs.createReadStream('naptan.csv')
        .pipe(csv())
        .on('data', (data) => {
            results.push({ commonName: data.commonName, naptanID: data.naptanID });
        })
    return results;
}

console.log(getNaptanCodes());

// async function getStationList() {
//     // Willesden Junction - 940GZZLUWJN
//     // stationId = '940GZZLUWJN';
//     // const res=await fetch (`https://api.tfl.gov.uk/StopPoint/${stationId}`);
//     // const res=await fetch (`https://api.tfl.gov.uk/Line/london-overground,bakerloo/Arrivals/${stationId}`);

//     const res = await fetch(`https://api.tfl.gov.uk/StopPoint/Line/bakerloo`);

//     const stations = await res.json();
//     const stationNames = stations.stopPoints.map(station => station.commonName);
//     const stationIds = stations.stopPoints.map(station => station.id);
//     const stationDict = {};
//     for (let i = 0; i < stationNames.length; i++) {
//         stationDict[stationNames[i]] = stationIds[i];
//     }
//     console.log(stationDict);
//     return stationDict;
// }