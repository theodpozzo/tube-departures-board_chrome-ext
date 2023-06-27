const stationSelect = document.getElementById('station-select');

stationSelect.addEventListener('change', (e) => {
    // const stationName = e.target.options[e.target.selectedIndex].text;
    const stationID = e.target.value;

    const url = `https://api.tfl.gov.uk/StopPoint/${stationID}/Arrivals`
    fetch(url)
        .then((response) => response.json())
        .then((data) => { populateTable(data); })
        .catch((error) => { console.error(error); });
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

        const now = new Date();
        const arrival = new Date(result.expectedArrival);
        const difference = arrival - now;
        const minutes = Math.floor(difference / 1000 / 60);

        time.textContent = minutes;

        row.appendChild(line);
        row.appendChild(destination);
        row.appendChild(platform);
        row.appendChild(time);

        table.appendChild(row);
    });
}
