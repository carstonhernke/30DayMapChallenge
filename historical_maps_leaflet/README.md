# Day 2 Notes
The theme of the day was 'lines', so I decided to show Berlin's train and ferry lines on a map. I also wanted to dive deeper into javascript, so I learned how to add buttons and connect them to event listeners which control the layers on the Leaflet map.

## OSM Overpass Turbo Query:
/*
[out:json][timeout:25];
// gather results
(
  // query part for: “railway=subway”
  way["railway"="light_rail"]({{bbox}});
  way["railway"="subway"]({{bbox}});
  way["railway"="tram"]({{bbox}});
  way["route"="ferry"]({{bbox}});
);
// print results
out skel;
>;
out skel qt;