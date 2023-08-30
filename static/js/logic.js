let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";



    // Create the tile layer that will be the background of our map.
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});


// Create a baseMaps object to hold the streetmap layer.
let baseMaps = {
    "Street Map": streetmap
};

let earthquakes = L.layerGroup();

// Create an overlayMaps object to hold the earthquakes layer.
let overlayMaps = {
    "Earthquakes": earthquakes
};

// Create the map object with options.
let map = L.map("map", {
    center: [37.3387, -121.8853],
    zoom: 5,
    layers: [streetmap, earthquakes]
});

// Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(map);


  function chooseColor(depth) {
    if (depth > 90) return "red";
    else if (depth >=70 & depth <=90) return "#f55014";
    else if (depth >=50 & depth <=70) return "#f57614";
    else if (depth >=30 & depth <=50) return "#f5f514";
    
    else if (depth >10 & depth <=30) return "#f5f514";
    else if (depth >-10 & depth <=10) return "#14f53d"
    else return "#14f5aa";
  };

  //the marker size, on the map
  
  function markerSize(mag) {
    return mag * 4;
  }

//what the marker will look like
  function styling(feature) {

    return {
        color: chooseColor(feature.geometry.coordinates[2]),
        radius: markerSize(feature.properties.mag),
        fillColor: chooseColor(feature.geometry.coordinates[2])
    }



  };

  
  
  
  // Perform an API call to the Citi Bike API to get the earthquake information. Call createMarkers when it completes.
  d3.json(link).then(function(data) {
    console.log(data.features[0])

    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data, {
      style: styling,
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng).bindPopup(`ID: ${feature.id} <br> Magnitude: ${feature.properties.mag} <br> Location: ${feature.properties.place} <br> Depth: ${feature.geometry.coordinates[2]}`);
    }
    }).addTo(earthquakes);
    //adding to the earthquake layer and then adding earthquake layers to map
    earthquakes.addTo(map);

    

    let legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let limits = [-10,10,30,50,70,90];
    let labels = [];

    let legendInfo = "<h3>Magnitude</h3>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + chooseColor(limits[index]) + "\"></li>" +  limits[index] +(limits[index + 1] ? "&ndash;" + limits[index + 1] + "<br>" : "+"));
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  legend.addTo(map);
    
  });