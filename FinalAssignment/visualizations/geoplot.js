var h = 400;
var w = 600;

var svgGeoPlot = d3.select("#geo") // to be changed later
.append("svg")
.attr("width", w)
.attr("height", h);

var projection = d3.geo.mercator()
    .center([-122.433701, 37.767683])
    .scale(125000)
    .translate([w / 2, h / 2]);

var path = d3.geo.path()
.projection(projection);

d3.json("https://raw.githubusercontent.com/suneman/socialdataanalysis2017/master/files/sfpddistricts.geojson", function(json) {
    svgGeoPlot.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", "rgb(40,40,40)");


d3.csv("Copy-of-neighbourhoods.csv", function(error, data) {
        if (error) {
            console.log(error);
        } else {
            console.log("hello");
            //set data on right format
            for (var i = 0; i < data.length; i++) {
                data[i].lat = Number(data[i].lat);
                data[i].lon = Number(data[i].lon);
            }

            //here we write the neigbourhood name on the geoplot
            svgGeoPlot.selectAll("text")
                .data(data)
                .enter()
                .append("text")
                .text(function(d) {
                    return d.name;
                })
                .attr("x", function(d) {
                    return projection([d.lon, d.lat])[0];
                })
                .attr("y", function(d) {
                    return projection([d.lon, d.lat])[1];
                })
                .attr("font-family", "sans-serif")
                .attr("font-size", "15px")
                .attr("fill", "beige");

        }
    });
});


