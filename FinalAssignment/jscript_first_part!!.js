var w = 600;
 var h = 400;
 var padding = 80;
 var dataset = [];

 d3.csv("data_2015.csv", function(error, data) {
     if (error) {
         console.log(error);
     } else {
         dataset = data.map(function(d) {
             return d;
         });
         //since csv files set everything to str, we convert the a proprate to num
         for (i = 0; i < dataset.length; i++) {
             dataset[i]["VEHICLE THEFT"] = Number(dataset[i]["VEHICLE THEFT"]);
             dataset[i]["PROSTITUTION"] = Number(dataset[i]["PROSTITUTION"]);
         }
         makeCircles();
         makeAxis();
     }

 });


 //Create scale functions
 var xScale;
 var yScale;
 var rScale;
 //Create svgOne element
 var svgOne = d3.select("#fh5co-main")
     .append("svg")
     .attr("width", w)
     .attr("height", h)
     .attr("class", "first")
     .attr("display","block")
     .attr("margin", "auto");



 function makeCircles() {
    console.log("making circles");

     xScale = d3.scale.linear()
         .domain([0, d3.max(dataset, function(d) {
             return d["PROSTITUTION"];
         })])
         .range([padding, w - padding * 2]);

     yScale = d3.scale.linear()
         .domain([0, d3.max(dataset, function(d) {
             return d["VEHICLE THEFT"];
         })])
         .range([h - padding, padding]);
     rScale = d3.scale.linear()
         .domain([0, d3.max(dataset, function(d) {
             return d["VEHICLE THEFT"] + d["PROSTITUTION"];
         })])
         .range([2, 7]);

     svgOne.selectAll("circle")
         .data(dataset)
         .enter()
         .append("circle")
         .attr("cx", function(d) {
             return xScale(d["PROSTITUTION"]);
         })
         .attr("cy", function(d) {
             return yScale(d["VEHICLE THEFT"]);
         })
         .attr("r", function(d) {
             return rScale(h - d["PROSTITUTION"] + d["VEHICLE THEFT"]);
         });

     svgOne.selectAll("text")
         .data(dataset)
         .enter()
         .append("text")
         .text(function(d) {
             return d["District"];
         })
         .attr("x", function(d) {
             return xScale(d["PROSTITUTION"] + 2);
         })
         .attr("y", function(d) {
             return yScale(d["VEHICLE THEFT"]);
         })
         .attr("font-family", "sans-serif")
         .attr("font-size", "11px")
         .attr("fill", "teal");
 }

 function makeAxis() {
     //Define X axis
     var xAxis = d3.svg.axis()
         .scale(xScale)
         .orient("bottom")
         .ticks(5);

     //Define Y axis
     var yAxis = d3.svg.axis()
         .scale(yScale)
         .orient("left")
         .ticks(5);
     //Create X axis
     svgOne.append("g")
         .attr("class", "axis")
         .attr("transform", "translate(0," + (h - padding) + ")")
         .call(xAxis);

     //Create Y axis
     svgOne.append("g")
         .attr("class", "axis")
         .attr("transform", "translate(" + padding + ",0)")
         .call(yAxis);

     svgOne.append("text")
         .attr("class", "dataYear")
         .attr("x", (w / 2))
         .attr("y", 25)
         .attr("text-anchor", "middle")
         .style("font-size", "22px")
         .style("text-decoration", "underline")
         .style("text-decoration", "bold")
         .text("Crimes 2015 in San Francisco");

     svgOne.append("text")
         .attr("x", (w / 2))
         .attr("y", h - padding / 2)
         .attr("text-anchor", "middle")
         .style("font-size", "16px")
         .style("text-decoration", "bold")
         .text("PROSTITUTION");

     svgOne.append("text")
         .attr("x", -50)
         .attr("y", -2)
         .attr("transform", "translate(" + (padding / 2) + "," + (h / 2) + ")rotate(-90)")
         .style("font-size", "16px")
         .style("text-decoration", "bold")
         .text("VEHICLE THEFT");


 }

 d3.select("button")
     .on("click", function() {

         var showdata = "data_2015.csv";
         // change the button text
         var elem = document.getElementById("myButton1");
         if (elem.innerHTML == "Show data 2003!") {
             elem.innerHTML = "Show data 2015!";
             showdata = "data_2003.csv";
             data_year = "Crimes 2003 in San Francisco";
         } else {
             elem.innerHTML = "Show data 2003!";
             showdata = "data_2015.csv";
             data_year = "Crimes 2015 in San Francisco";
         }

         d3.csv(showdata, function(error, data) {
             if (error) {
                 console.log(error);
             } else {
                 dataset = data.map(function(d) {
                     return d;
                 });
                 //since csv files set everything to str, we convert the a proprate to num
                 for (i = 0; i < dataset.length; i++) {
                     dataset[i]["VEHICLE THEFT"] = Number(dataset[i]["VEHICLE THEFT"]);
                     dataset[i]["PROSTITUTION"] = Number(dataset[i]["PROSTITUTION"]);
                 }

                 xScale = d3.scale.linear()
                     .domain([0, d3.max(dataset, function(d) {
                         return d["PROSTITUTION"];
                     })])
                     .range([padding, w - padding * 2]);

                 yScale = d3.scale.linear()
                     .domain([0, d3.max(dataset, function(d) {
                         return d["VEHICLE THEFT"];
                     })])
                     .range([h - padding, padding]);

                 svgOne.selectAll("circle")
                     .data(dataset)
                     .transition()
                     .duration(1000)
                     .ease("quad")
                     .attr("cx", function(d) {
                         return xScale(d["PROSTITUTION"]);
                     })
                     .attr("cy", function(d) {
                         return yScale(d["VEHICLE THEFT"]);
                     });

                 svgOne.selectAll("text")
                     .data(dataset)
                     .transition()
                     .duration(1000)
                     .ease("quad")
                     .text(function(d) {
                         return d["District"];
                     })
                     .attr("x", function(d) {
                         return xScale(d["PROSTITUTION"] + 2);
                     })
                     .attr("y", function(d) {
                         return yScale(d["VEHICLE THEFT"]);
                     })
                     .attr("font-family", "sans-serif")
                     .attr("font-size", "11px")
                     .attr("fill", "teal");

                 svgOne.select(".dataYear")
                     .attr("x", (w / 2))
                     .attr("y", 25)
                     .attr("text-anchor", "middle")
                     .style("font-size", "22px")
                     .style("text-decoration", "underline")
                     .style("text-decoration", "bold")
                     .text(data_year);

             }

         });


     });