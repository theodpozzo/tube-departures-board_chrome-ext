const stationSelect = document.getElementById('station-select');

stationSelect.addEventListener('change', async (e) => {
    const stationName = e.target.options[e.target.selectedIndex].text;
    const stationID = e.target.value;
    console.log(`You selected ${stationName}, id: ${stationID}`)
    if (stationID.length === 0 || stationID[0] === 'Select a station') {
        console.log(`No station selected`);
        return;
    }

    /**
     * If stationID is an array, it means there are multiple ids for the station.
     * We need to make a request for each id and combine the results.
     */
    if (stationID.includes(',')) {
        console.log(`Array`);
        const numIDs = stationID.split(',').length - 1;
        var results = [];
        for (let i = 0; i <= numIDs; i++) {
            const url = `https://api.tfl.gov.uk/StopPoint/${stationID.split(',')[i]}/Arrivals`
            const response = await fetch(url);
            const data = await response.json();
            data.forEach((result) => {
                results.push({
                    lineName: result.lineName,
                    destinationName: result.destinationName,
                    platformName: result.platformName,
                    expectedArrival: result.expectedArrival
                });
            });
        }
        results = results.sort((a, b) => {
            return new Date(a.expectedArrival) - new Date(b.expectedArrival);
        });
        populateTable(results);
    } else {
        console.log(`Not array`);
        const url = `https://api.tfl.gov.uk/StopPoint/${stationID}/Arrivals`
        const response = await fetch(url);
        const data = await response.json();
        var results = [];
        data.forEach((result) => {
            results.push({
                lineName: result.lineName,
                destinationName: result.destinationName,
                platformName: result.platformName,
                expectedArrival: result.expectedArrival
            });
        });
        results = results.sort((a, b) => {
            return new Date(a.expectedArrival) - new Date(b.expectedArrival);
        });
        populateTable(results);
    }
    
});

function populateTable(results) {
    const table = document.getElementById('departures-body');
    table.innerHTML = '';

    results.forEach((result) => {
        const row = document.createElement('tr');

        const line = document.createElement('td');
        line.textContent = result.lineName;

        const destination = document.createElement('td');
        destination.textContent = result.destinationName;

        const platform = document.createElement('td');
        platform.textContent = result.platformName;

        const time = document.createElement('td');
        const arrival = new Date(result.expectedArrival);

        time.textContent = arrival.toLocaleTimeString().slice(0, -3);

        row.appendChild(line);
        row.appendChild(destination);
        row.appendChild(platform);
        row.appendChild(time);

        table.appendChild(row);
    });
}
