var map = L.map('map').setView([30, 0], 3);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


for (const [key, value] of Object.entries(airport_data)) {
    // get coordinates from object
    //console.log(`${key}: ${value.geometry.coordinates[0]}, ${value.geometry.coordinates[1]}`);

    // add coordinates to map
    var marker = L.marker([value.geometry.coordinates[1], value.geometry.coordinates[0]]).addTo(map);
    marker.bindPopup(`<b>${value.fields.icao}</b><br>${value.fields.name}`)
  }
