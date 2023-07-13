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

        setColour(row, result);

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

function setColour(row, result) {
    if (result.lineName === 'Circle') {
        row.style.borderLeft = '5px solid #FFCE00';
    } else if (result.lineName === 'District') {
        row.style.borderLeft = '5px solid #007229';
    } else if (result.lineName === 'Hammersmith & City') {
        row.style.borderLeft = '5px solid #F3A9BB';
    } else if (result.lineName === 'Jubilee') {
        row.style.borderLeft = '5px solid #A0A5A9';
    } else if (result.lineName === 'Metropolitan') {
        row.style.borderLeft = '5px solid #9B0056';
    } else if (result.lineName === 'Northern') {
        row.style.borderLeft = '5px solid #000000';
    } else if (result.lineName === 'Piccadilly') {
        row.style.borderLeft = '5px solid #003688';
    } else if (result.lineName === 'Victoria') {
        row.style.borderLeft = '5px solid #0098D4';
    } else if (result.lineName === 'Waterloo & City') {
        row.style.borderLeft = '5px solid #95CDBA';
    } else if (result.lineName === 'Bakerloo') {
        row.style.borderLeft = '5px solid #B05C2C';
    } else if (result.lineName === 'Central') {
        row.style.borderLeft = '5px solid #E32017';
    } else if (result.lineName === 'DLR') {
        row.style.borderLeft = '5px solid #00A4A7';
    } else if (result.lineName === 'London Overground') {
        row.style.borderLeft = '5px solid #EE7C0E';
    } else if (result.lineName === 'TfL Rail') {
        row.style.borderLeft = '5px solid #0019A8';
    } else if (result.lineName === 'Tram') {
        row.style.borderLeft = '5px solid #84B817';
    } else {
        row.style.borderLeft = '5px solid #000000';
    }
}