var map = L.map('map').setView([44.925898, -93.593654], 13.2);

colors = ['#445965','#56787E','#689693','#7AAEA0','#8CC6AA','#9BCEAC','#A9D7B0','#BADFB8','#CFE6C8','#E0EED7','#EFF5E7']

L.geoJson(lake_minnetonka_data, {style: function(feature) {
    return {'color': colors[Math.abs(feature.properties.depth_level/10)], 'weight': 1}
}}
).addTo(map);

const scale = document.getElementById('scale');

for (let i = 0; i < colors.length; i++) {
    e = document.createElement("div")
    e.className = 'scalebox'
    e.style.height = '100%'
    e.style.width = '100%'
    e.style.backgroundColor = colors[i]
    var content = document.createTextNode(`${i*10}ft`);
    e.appendChild(content)
    scale.appendChild(e)
}