async function getNaptanCodes() {
  try {
    const response = await fetch('naptan.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

function populateDropdown(results) {
  const stationSelect = document.getElementById('station-select');

  results.forEach((result) => {
    const option = document.createElement('option');
    option.value = result.naptanID;
    option.text = result.commonName;
    stationSelect.appendChild(option);
  });
}

getNaptanCodes()
  .then((results) => {
    populateDropdown(results); // Populate the dropdown list with the results
  })
  .catch((error) => {
    console.error(error);
  });
