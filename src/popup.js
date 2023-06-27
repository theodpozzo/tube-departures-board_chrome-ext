async function getArrivals() {
    // Willesden Junction - 940GZZLUWJN
    // stationId = '940GZZLUWJN';
    // const res=await fetch (`https://api.tfl.gov.uk/StopPoint/${stationId}`);
    // const res=await fetch (`https://api.tfl.gov.uk/Line/london-overground,bakerloo/Arrivals/${stationId}`);

    const res = await fetch(`https://api.tfl.gov.uk/StopPoint/Mode/tube`);

    const stations = await res.json();
    const stationNames = stations.stopPoints.map(station => station.commonName);
    const stationIds = stations.stopPoints.map(station => station.id);
    const stationDict = {};
    for (let i = 0; i < stationNames.length; i++) {
        stationDict[stationNames[i]] = stationIds[i];
    }
    console.log(stationDict);

    return record.data[0].date;
}

getArrivals();