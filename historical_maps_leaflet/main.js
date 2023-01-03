var map = L.map('map').fitWorld();

var osm_baselayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
})

var satellite_layer = L.tileLayer('http://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: '© ESRI'
})

var basic_layer = L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© Stamen'
})

osm_baselayer.addTo(map)

var half_section = L.tileLayer('https://api.mapbox.com/v4/carston.3htkvlv5/{z}/{x}/{y}.jpg70?access_token=pk.eyJ1IjoiY2Fyc3RvbiIsImEiOiJjajY0ZDR4MmgxcHl3MndtcW9jeTE2enBpIn0.K9j5-HQz8zLGevbbjF4vRQ', {
    maxZoom: 19
})

var historical_plat = L.tileLayer('https://api.mapbox.com/v4/carston.5x57nvlf/{z}/{x}/{y}.jpg70?access_token=pk.eyJ1IjoiY2Fyc3RvbiIsImEiOiJjajY0ZDR4MmgxcHl3MndtcW9jeTE2enBpIn0.K9j5-HQz8zLGevbbjF4vRQ', {
    maxZoom: 19
})

var baseLayers = {
    "Open Street Map": osm_baselayer,
    "Satellite": satellite_layer,
    "Basic Street Map": basic_layer
}

var overlayMaps = {
    "2022 Property Map": half_section,
    "1855 Plat Map": historical_plat
};

var layerControl = L.control.layers(baseLayers, overlayMaps).addTo(map);
L.control.locate().addTo(map);