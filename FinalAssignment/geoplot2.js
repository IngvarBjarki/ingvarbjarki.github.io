var h = 450;
var w = 675;

var num_predict_in_districts=null;
var total_in_district = null;

var svgGeoPlot =
    d3.select("#geo")
    .append("svg")
    .attr("width", w)
    .attr("height", h);  // to be changed later

// Define the div for the tooltip
var div = d3.select("#geo").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


var projection = d3.geo.mercator()
    .center([-122.433701, 37.767683])
    .scale(125000)
    .translate([w / 2, h / 2]);

var path = d3.geo.path()
.projection(projection);


var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    var private_val;
    var public_val;
    var total_private;
    var total_public;
    if(num_predict_in_districts === null){
        private_val = 0;
        public_val = 0;
    }
    else{
        private_val =num_predict_in_districts[d.properties.DISTRICT].private;
        public_val =num_predict_in_districts[d.properties.DISTRICT].public;
    }
    if(total_in_district === null){
        total_private = 0;
        total_public = 0;
    }
    else{
        total_private = total_in_district[d.properties.DISTRICT].private;
        total_public =  total_in_district[d.properties.DISTRICT].public;
    }

    return "<strong>District: </strong>" + "<span style='color:#44da82'> "+ d.properties.DISTRICT +"</span>"
        + "<br/>" + "<br/>" +"<strong>True number of graffiti cases: </strong>"
        + "<br/>" + "<strong>   Number of private: </strong>"  +"<span style='color:#44da82'>"+ total_private +"</span>"
        + "<br/>" + "<strong>   Number of public: </strong>"  +"<span style='color:#44da82'>"+total_public +"</span>"
        + "<br/>" + "<strong>   Total number of graffiti cases: </strong>"  +"<span style='color:#44da82'>"+ (Number(total_private)+Number(total_public)) +"</span>"
        + "<br/>" + "<br/>" +"<strong>Knn Predictions: </strong>"
        + "<br/>" + "<strong>   Number of private: </strong>"  +"<span style='color:#44da82'>"+ private_val +"</span>"
        + "<br/>" + "<strong>   Number of public: </strong>"  +"<span style='color:#44da82'>"+public_val +"</span>"
        + "<br/>" + "<strong>   Total number of predictions: </strong>"  +"<span style='color:#44da82'>"+(Number(public_val) + Number(private_val)) +"</span>";
  });

  svgGeoPlot.call(tip);

d3.json("https://raw.githubusercontent.com/suneman/socialdataanalysis2017/master/files/sfpddistricts.geojson", function(json) {
    svgGeoPlot.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", "rgb(100,100,100)")
    .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      ;

d3.csv("totalInstaceInDistict.csv", function(error,tota_count_in_districts){
    if(error){
        console.log(error);
    } else{

           var total_count = new Object();
                for (var i = 0; i < tota_count_in_districts.length; i++) {
                    total_count[tota_count_in_districts[i].district] = tota_count_in_districts[i];
                }
                total_in_district  = total_count;
    }
d3.csv("Copy-of-neighbourhoods.csv", function(error, data) {
        if (error) {
            console.log(error);
        } else {
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
loadPoints();
});
});

function loadPoints(){
    d3.csv("Predict_test.csv", function(error, data) {
        if (error) {
            console.log(error);
        } else {
            //set data on right format
            for (var i = 0; i < data.length; i++) {
                data[i].lat = Number(data[i].lat);
                data[i].lon = Number(data[i].lon);
            }
        }

});
}

function getColor(count_public, count_private){
    // calculate the RGB value to corresponding ratio of forcasted, private vs public

    r_ratio = count_public/(count_private+count_private);
    b_ratio = count_private/(count_private+count_private);

    // the current rgb in the color format are:
    // red rgb(251, 105, 74)
    // blue rgb(115, 196, 118)

    // green increases with blue ratio..
    R = Math.floor(85 + 115* r_ratio);
    G = Math.floor(10 + b_ratio*69) ;
    B = Math.floor(77+ 200*b_ratio);


    if( r_ratio > 0.95){
        return "rgb(109, 21, 19)";
    }
    if( r_ratio > 0.85){
        return "rgb(155, 40, 37)";
    }
    if(b_ratio > 0.85){
        return "rgb(5, 0, 200)";
    }

    if( r_ratio > 0.75){
        return "rgb(135, 40, 37)";
    }
    if(b_ratio > 0.75){
        return "rgb(39, 3, 193)";
    }

    if(r_ratio > 0.65){
        return "rgb(251, 105, 74)";
    }

    if(b_ratio > 0.65){
        return "rgb(59, 23, 193)";
    }


    color = "rgb(" +String(R) + "," + "10"+"," + String(B) + ")";
    return color;

}





 d3.selectAll(".geoButton")
               .on("click", function(){
        if(which_model === "K means"){
                    kmeans(this.id);
                }
        else{
            knn(this.id);
        }


                        });


function knn(id){
       if(id === "original"){
            num_predict_in_districts=null;
            svgGeoPlot.selectAll("path")
                        .style("fill", "rgb(100, 100, 100)");
        } else{

        var file_name = "knn" + id + ".csv"
        d3.csv(file_name ,  function(error, data) {
            if (error) {
                console.log(error);
            } else {
                // the object contains the name of the district as key, and the origianl obj as value
                 // then you can get the value with the key and calculate the color of the district
                 // you can use [] notion on file in javascript..
                var pred_data = new Object();
                for (var i = 0; i < data.length; i++) {
                    pred_data[data[i].district] = data[i];
                }

               num_predict_in_districts = pred_data; // so we can use the data in the tooltip

            }


                svgGeoPlot.selectAll("path")
                        .style("fill", function(d){
                            return getColor(Number(pred_data[d.properties.DISTRICT].public), Number(pred_data[d.properties.DISTRICT].private));

                        });

                        });


}

}


which_model = "K nearest neighbours";

d3.select(".geoSelect")
  .on("click", function(){
    which_model = document.getElementById("geoSel").value;
    if(which_model === "K means"){
        // clear the knn out
        num_predict_in_districts=null;
            svgGeoPlot.selectAll("path")
                        .style("fill", "rgb(100, 100, 100)");
    }
    else{
        // clear the kmeans
        svgGeoPlot.selectAll("circle").remove();
    }



    });


  function kmeans(id){

    if(id === "original"){
        svgGeoPlot.selectAll("circle").remove();
    }
    else{

        var file_name = "kmeans_" + id + ".json";
       d3.json(file_name, function(error, json) {
            if (error) {
                console.log(error);
            } else {

                json = JSON.parse(json);
                // lets remove the current data
                svgGeoPlot.selectAll("circle").remove();
                all_centroids = [];
                all_locations = [];
                // lets transfrom the data to the correct format for all the prostitution points
                for (var i = 0; i < json.lon.length; i++) {
                    all_locations[i] = {
                        "lon": json.lon[i],
                        "lat": json.lat[i],
                        "labels": json.labels[i],
                        "centroid": false
                    };
                };

                // lets transform the data to the correct format for all the centroids
                for (var i = 0; i < json.centroid_lat.length; i++) {
                    all_centroids[i] = {
                        "lon": json.centroid_lon[i],
                        "lat": json.centroid_lat[i],
                        "labels": i,
                        "centroid": true
                    };
                };

                all_locations = all_locations.concat(all_centroids);
                getProstitutionPoints(all_locations);

            }

    });

  }


  function getProstitutionPoints(all_locations) {

    var circle = svgGeoPlot.selectAll(".dataCircle")
        .data(all_locations);

    circle
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return projection([d.lon, d.lat])[0];
        })
        .attr("cy", function(d) {
            return projection([d.lon, d.lat])[1];
        })
        .attr("r", function(d) {
            if (d.centroid) {
                return 10;
            } else {
                return 2;
            }
        })
        .style("fill", function(d) {
            return getKmeansColor(d.labels);
        })
        .style("stroke", function(d) {
            if (d.centroid) {
                return "black";
            } else {
                return getKmeansColor(d.labels);
            }
        })
        .style("stroke-width", function(d) {
            if (d.centroid) {
                return "5";
            } else {
                return "0";
            }
        });

}
}


function getKmeansColor(class_labels) {
    switch (class_labels) {
        case 0:
            return "rgba(253,25,153, 0.75)";
        case 1:
            return "rgba(153,252,32, 0.75)";
        case 2:
            return "rgba(0,230,254, 0.75)";
        case 3:
            return "rgba(255,240,1, 0.75)";
        case 4:
            return "rgba(161,14,236, 0.75)";
        case 5:
            return "rgba(255,165,0,0.75)";
         case 6:
            return "rgba(229,20,0,0.75)";
         case 7:
            return "rgba(0,171,169,0.75)";
        case 8:
            return "rgba(252,251,227,0.75)";
        case 9:
            return "rgba(255,40,0,0.75)";
        default:
            return "rgba(255,100,255)";
    }
}






