// create map with center and zoom
let myMap = L.map("map", {
    center: [40, -120],
    zoom: 4
  });

  // add OpenStreetMap as the base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// store API url
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

// get request for url using d3
d3.json(url).then(function (data) {
    let earthquakes = data.features;

    earthquakes.forEach(function (earthquake) {
      let coordinates = [earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]];
      let magnitude = earthquake.properties.mag;
      let depth = earthquake.geometry.coordinates[2];
      
      let MarkerSize = magnitude * 5;

      let Markercolor = getColor(depth);

      // create circle markers for earthquakes
      L.circleMarker(coordinates, {
        fillOpacity: 0.75,
        color: "#000",
        weight: 1,
        fillColor: Markercolor,
        radius: MarkerSize
      }).bindPopup(`<center> <h3>${earthquake.properties.place}</h3> </center> <hr> <p> <b>  Magnitude: </b>  ${magnitude}  &nbsp;  <b>  Depth: </b>  ${depth}</p>  <p> <b> Date: </b>  ${new Date(earthquake.properties.time)} </p> <hr>  `)
        .addTo(myMap);
  });

  // create a legend
  let legend = L.control({position: 'bottomright'});
  
      legend.onAdd = function () {
      let div = L.DomUtil.create('div', 'info legend');
      let limits = [-10, 10, 30, 50, 70, 90];
      let colors = ['#99ff33', '#ace600', '#ffd11a', '#ff9900', '#ff6600', '#ff3300'];
  
      // loop through densities and create labels with their own color
      for (var i = 0; i < limits.length; i++) {
        div.innerHTML +=
          '<i style="background-color:' + colors[i] + '"></i>'+
          limits[i] + (limits[i + 1]? '&ndash;' + limits[i + 1] + '<br>' : '+');
    }
      return div;
    };
    
    legend.addTo(myMap);

    // use getColor function to determine colors of the markers based on magnitude
    function getColor(depth) {
      switch (true) {
        case depth  > 90:
          return '#ff3300';
        case depth  > 70:
          return '#ff6600';
        case depth  > 50:
          return '#ff9900';
        case depth  > 30:
          return '#ffd11a';
        case depth  > 10:
          return '#ace600';
        default:
          return '#99ff33';
      }
    }
  }).addTo(myMap);
