var map = L.map('map').setView([44.98, -93.26], 13);

var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var imageUrl = 'mpls_georef.png';
var errorOverlayUrl = 'https://cdn-icons-png.flaticon.com/512/110/110686.png';
var altText = '1890 Map of Minneapolis';
var latLngBounds = L.latLngBounds([[45.059891346, -93.343537744], [44.918957562, -93.186692539]]);

/* L.rectangle(latLngBounds).addTo(map); */

var imageOverlay = L.imageOverlay(imageUrl, latLngBounds, {
    opacity: 0.7,
    errorOverlayUrl: errorOverlayUrl,
    alt: altText,
    interactive: true
}).addTo(map);

function toggleHistoricalMapLayer() {
    if(map.hasLayer(imageOverlay)){
        map.removeLayer(imageOverlay);
    }
    else{
        imageOverlay.addTo(map);
    }
}

const mapButton = document.querySelector('#toggle-map-button');

mapButton.addEventListener('click', () => {
    toggleHistoricalMapLayer()
});

var slider = document.getElementById("myRange");

slider.oninput = function() {
    imageOverlay.setOpacity(this.value/100)
}



