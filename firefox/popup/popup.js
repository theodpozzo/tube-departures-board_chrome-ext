document.addEventListener("DOMContentLoaded", () => {
    const stationSelect = document.getElementById('station-select');
    const departuresTable = document.getElementById('departures-body');

    const lineColors = {
        "Circle": "#FFCE00",
        "District": "#007229",
        "Hammersmith & City": "#F3A9BB",
        "Jubilee": "#A0A5A9",
        "Metropolitan": "#9B0056",
        "Northern": "#000000",
        "Piccadilly": "#003688",
        "Victoria": "#0098D4",
        "Waterloo & City": "#95CDBA",
        "Bakerloo": "#B05C2C",
        "Central": "#E32017",
        "DLR": "#00A4A7",
        "London Overground": "#EE7C0E",
        "TfL Rail": "#0019A8",
        "Tram": "#84B817",
        "Elizabeth line": "#753E98"
    };

    stationSelect.addEventListener('change', async (e) => {
        const stationName = e.target.options[e.target.selectedIndex].text;
        const stationID = e.target.value;

        if (!stationID || stationID === 'Select a station') return;

        const stationIDs = stationID.split(',').map(id => id.trim());
        let results = [];

        for (const id of stationIDs) {
            try {
                const url = `https://api.tfl.gov.uk/StopPoint/${id}/Arrivals`;
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
            } catch (err) {
                console.error(`Failed to fetch arrivals for ${id}`, err);
            }
        }

        results.sort((a, b) => new Date(a.expectedArrival) - new Date(b.expectedArrival));
        populateTable(results);
    });

    function populateTable(results) {
        departuresTable.innerHTML = '';

        results.forEach((result) => {
            const row = document.createElement('tr');
            const color = lineColors[result.lineName] || "#000000";
            row.style.borderLeft = `5px solid ${color}`;

            const line = document.createElement('td');
            line.textContent = result.lineName;

            const destination = document.createElement('td');
            destination.style.textAlign = 'center';
            destination.textContent = result.destinationName?.trim() || 'Check Front of Train';

            const platform = document.createElement('td');
            platform.style.textAlign = 'center';
            let platformDisplay = result.platformName?.trim() || 'N/A';

            const numberMatch = platformDisplay.match(/\d+/);
            const directionMatch = platformDisplay.match(/North|South|East|West/);

            if (numberMatch) {
                platformDisplay = numberMatch[0];
            } else if (directionMatch) {
                platformDisplay = `${directionMatch[0]}bound`;
            }

            platform.textContent = platformDisplay;

            const time = document.createElement('td');
            const arrival = new Date(result.expectedArrival);
            time.style.textAlign = 'center';
            time.textContent = arrival.toLocaleTimeString().slice(0, -3);

            row.appendChild(line);
            row.appendChild(destination);
            row.appendChild(platform);
            row.appendChild(time);

            departuresTable.appendChild(row);
        });
    }

    async function getIDs() {
        try {
            const response = await fetch('ids.json');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error loading station IDs:', error);
            return [];
        }
    }

    function populateDropdown(stations) {
        stations.forEach((station) => {
            const option = document.createElement('option');
            option.textContent = station.name;
            option.value = station.ids.join(',');
            stationSelect.appendChild(option);
        });
    }

    getIDs().then(populateDropdown).catch(console.error);
});
