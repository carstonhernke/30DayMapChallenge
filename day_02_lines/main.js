var map = L.map('map').setView([52.520008, 13.404954], 10.5);

var mapLayerGroups = [];

L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
	maxZoom: 20,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);

L.geoJson(berlin_transit_data, {
    onEachFeature: onEachFeature, 
    style: function(feature) {
        switch (feature.properties.railway) {
            case 'light_rail': return {color: "#3a8a55"};
            case 'subway':   return {color: "#1a4f88"};
            case 'tram':   return {color: "#d12c29"};
            default: return {color: "#317eb5"}
        }
} });

/*
this stackoverflow answer was very helpful here: https://stackoverflow.com/questions/16148598/leaflet-update-geojson-filter
*/
function onEachFeature(feature, featureLayer) {

    //does layerGroup already exist? if not create it and add to map
    var lg = mapLayerGroups[feature.properties.railway];

    if (lg === undefined) {
        console.log(`adding feature layer ${feature.properties.railway}`)
        lg = new L.layerGroup();
        //add the layer to the map
        lg.addTo(map);
        //store layer
        mapLayerGroups[feature.properties.railway] = lg;
    }

    //add the feature to the layer
    lg.addLayer(featureLayer);      
}

function showLayer(id) {
    var lg = mapLayerGroups[id];
    map.addLayer(lg);   
}
function hideLayer(id) {
    var lg = mapLayerGroups[id];
    map.removeLayer(lg);   
}
function toggleLayer(id) {
    if(map.hasLayer(mapLayerGroups[id])){
        hideLayer(id)
    }
    else{
        showLayer(id)
    }
}

const ubahnFilter = document.querySelector('#ubahnfilter');
const sbahnFilter = document.querySelector('#sbahnfilter');
const tramFilter = document.querySelector('#tramfilter');
const ferryFilter = document.querySelector('#ferryfilter');

ubahnFilter.addEventListener('click', () => {
  console.log('ubahn filter clicked')
  toggleLayer("subway")
});

sbahnFilter.addEventListener('click', () => {
    console.log('sbahn filter clicked')
    toggleLayer("light_rail")
});

tramFilter.addEventListener('click', () => {
console.log('tram filter clicked')
toggleLayer("tram")
});

ferryFilter.addEventListener('click', () => {
    console.log('ferry filter clicked')
    toggleLayer("undefined")
});
  
