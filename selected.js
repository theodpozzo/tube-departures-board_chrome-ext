const stationSelect = document.getElementById('station-select');

stationSelect.addEventListener('change', (e) => {
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
        const ids = stationID.split(',');
        const promises = [];

        ids.forEach((id) => {
            promises.push(callAPI(id));
        });

        populateTable(Promise.all(promises));
        
    } else {
        console.log('Not array');
        const resultPromise = callAPI(stationID); // Make this understand that it's a promise
        resultPromise.then((result) => {
            populateTable([result]); // Wrap the single result in an array for consistency
        }).catch((error) => {
            console.error(error);
        });
        return resultPromise;
    }
    
});

function callAPI(stationID) {
    const url = `https://api.tfl.gov.uk/StopPoint/${stationID}/Arrivals`
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            const results = [];
            data.forEach((result) => {
                results.push({
                    lineName: result.lineName,
                    destinationName: result.destinationName,
                    platformName: result.platformName,
                    expectedArrival: result.expectedArrival
                });
            });
            return results; // This is a promise
        })
        .catch((error) => { console.error(error); });
}

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
