async function getArrivals(stationId) {
    // Willesden Junction - 940GZZLUWJN
    stationId = '940GZZLUWJN';
    const res=await fetch (`https://api.tfl.gov.uk/StopPoint/${stationId}`);
    const record=await res.json();

    return record.data[0].date;
}