async function getIDs() {
  try {
    const response = await fetch('ids.json');
    const data = await response.json();
    return data;
  } catch (error) {console.error(error)}
}

function populateDropdown(results) {
  const stationSelect = document.getElementById('station-select');

  results.forEach((station) => {
    const option = document.createElement('option');
    const name = station.name;
    const ids = station.ids;

    option.textContent = name;

    // If there are multiple ids, concatenate them with a comma
    if (ids.length > 1) {
      option.value = ids
    } else {
      option.value = ids[0];
    }

    stationSelect.appendChild(option);
  });
}

getIDs()
  .then((results) => {
    populateDropdown(results); // Populate the dropdown list with the results
  })
  .catch((error) => {
    console.error(error);
  });
