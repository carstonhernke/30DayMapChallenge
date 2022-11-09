var map = L.map('map').setView([59.9139, 10.7522], 10);

L.tileLayer(`https://api.maptiler.com/maps/winter/{z}/{x}/{y}.png?key=PCnNCqXJ8qZoT62HkEcQ`,{ //style URL
tileSize: 512,
zoomOffset: -1,
minZoom: 1,
attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
crossOrigin: true
}).addTo(map);

var mapLayerGroups = [];

L.geoJson(oslo_ski_data, {
    onEachFeature: onEachFeature, 
    style: function(feature) {
        switch (feature.properties['piste:grooming']) {
            case 'skating': return {color: "#D08770"};
            case 'classic':   return {color: "#5E81AC"};
            case 'classic+skating' || 'classic;skating' || 'classic;classic+skating': return {color: "#D08770"};
            default: return {color: "#ffffff"}
        }
} });

skate = ['skating','classic+skating','classic;skating','classic;classic+skating']
classic = ['classic','classic+skating','classic;skating','classic;classic+skating']

/*
this stackoverflow answer was very helpful here: https://stackoverflow.com/questions/16148598/leaflet-update-geojson-filter
*/
function onEachFeature(feature, featureLayer) {

    //does layerGroup already exist? if not create it and add to map
    var lg = mapLayerGroups[feature.properties['piste:grooming']];

    if (lg === undefined) {
        console.log(`adding feature layer ${feature.properties['piste:grooming']}`)
        lg = new L.layerGroup();

        lg.addTo(map);
        //store layer
        mapLayerGroups[feature.properties['piste:grooming']] = lg;
    }

    //add the feature to the layer
    lg.addLayer(featureLayer);      
}


function activateLayer(id_array) {
    for (const [key, value] of Object.entries(mapLayerGroups)) {
        if(map.hasLayer(value)){
            map.removeLayer(value);   
        }
      }
    
    // show layers in array
    for (var i = 0; i < id_array.length; i++) {
        var lg = mapLayerGroups[id_array[i]];
        if(!map.hasLayer(lg)){
            map.addLayer(lg);  
        }
    }
}

const classicFilter = document.querySelector('#select_classic');
const skateFilter = document.querySelector('#select_skate');

function setColor(e) {
    var s = e.classList.contains('active');
 
    e.classList.add(s ? 'inactive' : 'active');
    e.classList.remove(s ? 'active' : 'inactive'); 
 }

classicFilter.addEventListener('click', () => {
    skateFilter.classList.remove('active')
    setColor(classicFilter);
    activateLayer(classic)
});

skateFilter.addEventListener('click', () => {
    classicFilter.classList.remove('active')
    setColor(skateFilter);
    activateLayer(skate);
});
  
/*

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
  
*/