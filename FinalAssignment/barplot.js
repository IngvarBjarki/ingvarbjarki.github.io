var height;
var width;

var margin = {top: 40, right: 20, bottom: 80, left: 80},
    width = 810 - margin.left - margin.right,
    height = 480 - margin.top - margin.bottom;


var svgBarPlot = d3.select("#bar")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// defome the x and y scales
var xScale = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.2, 0.2);

var yScale = d3.scale.linear()
    .range([height, 0]); // since the top of the screen is 0

// define axis
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");


var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

var data;
// this data has the higest values.. best for scaling..
var current_category = "both";
var current_district = "MISSION";


var tipBar = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    var color = categoryColor(current_category);
    var cat;
    if (current_category === "both"){
      cat = "Graffiti Private and Public Property";
    } else{
        cat =  current_category;
    }
    return "<strong>District: </strong>"+ "<span style='color:"+color+ "'>"+ current_district  +"</span>"
              + "<br/>" + "<strong>Category: </strong>"+ "<span style='color:"+color+ "'>"+ cat +"</span>"
              + "<br/>" + "<strong>Number of cases: </strong>"+ "<span style='color:"+color+ "'>"+ d.count +"</span>";
    ;});

svgBarPlot.call(tipBar);

d3.json("countInDistrict.json", function(error,data){
    if(error){
        console.log(error);
    } else{

        this.data = data;

// FYRIR X ÞARF EG AÐ FINNA EINHVERN SEM ER MEÐ ALLA TIMANA OG FYRIR Y ÞARF EG AÐ FINNA STÆSTU TÖLUNA
        xScale.domain(data[current_category][1][current_district].map(function(d){return d;})); // reeturns the time
        yScale.domain([0, d3.max(data[current_category][0][current_district], function(d){return d +2000;})]);


// make array of only the objects which are needed
     var data_objects = [];
                for (var i = 0; i < data[current_category][1][current_district].length; i++) {
                    data_objects.push({
                                          count : data[current_category][0][current_district][i] ,
                                          clock:  data[current_category][1][current_district][i]
                                                  });
                    }



        // draw bars
         svgBarPlot.selectAll("rect")
            .data(data_objects)
            .enter()
            .append("rect")
            .attr("fill", "rgb(115, 196, 118)")
            .attr("x", function(d) { return xScale(d.clock); })
            .attr("width", xScale.rangeBand())
            .attr("y", function(d) {return  yScale(d.count); })
            .attr("height", function(d) { return height - yScale(d.count); })
            .on('mouseover', tipBar.show)
            .on('mouseout', tipBar.hide);

        // title
        svgBarPlot.append("text")
         .attr("class", "title")
         .attr("x", (width / 2))
         .attr("y", 25)
         .attr("text-anchor", "middle")
         .style("font-size", "22px")
         .style("text-decoration", "underline")
         .style("text-decoration", "bold")
         .text("Total graffiti complaints by hour  in " + current_district);

//x label
  svgBarPlot.append("text")
         .attr("x", (width / 2))
         .attr("y", height + margin.bottom/1.25)
         .attr("text-anchor", "middle")
         .style("font-size", "16px")
         .style("text-decoration", "bold")
         .text("Time[hours]");
// y label
svgBarPlot.append("text")
         .attr("x", -50)
         .attr("y", -2)
         .attr("transform", "translate(" + (-margin.left / 1.5) + "," + (height / 2) + ")rotate(-90)")
         .style("font-size", "16px")
         .style("text-decoration", "bold")
         .text("Number of complaints");

            // label the bars
           /* svgBarPlot.selectAll("text")
            .data(data_objects)
            .enter()
            .append('text')
            .text(function(d){return d.count;})
            .attr("x", function(d){return xScale(d.clock) + xScale.rangeBand()/2;})
            .attr("y", function(d){return yScale(d.count )+ 12;})
            .style("fill", "green")
            .style("text-anchor", "middle");
*/

            // draw the x axis values

            svgBarPlot.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis)
              .selectAll('text')
              .attr("transform", "rotate(-60)")
              .attr("dx", "-.8em")
              .attr("dy", "-.25em")
              .style("text-anchor", "end")
              .style("font-size", "12px");

            // draw y axis values
            svgBarPlot.append("g")
              .attr("class", "y axis")
              .call(yAxis);

    }});


d3.selectAll(".bar_button")
               .on("click", function(){
              current_category = this.id;

             // make array of only the objects which are needed
                var data_objects = [];
                for (var i = 0; i < data[current_category][1][current_district].length; i++) {
                    data_objects.push({
                                          count : data[current_category][0][current_district][i] ,
                                          clock:  data[current_category][1][current_district][i]
                                                  });
                  }
          svgBarPlot.selectAll("rect")
            .data(data_objects)
            .transition()
            .duration(1000)
            .ease("quad")
            .attr("fill", function(d){
              return categoryColor(current_category);
            })
            .attr("x", function(d) { return xScale(d.clock); })
            .attr("width", xScale.rangeBand())
            .attr("y", function(d) {return  yScale(d.count); })
            .attr("height", function(d) { return height - yScale(d.count); });

                // update title
                var category_title;
                if  (current_category === "both"){
                  category_title = "Total graffiti";
                }
                else if(current_category === "Graffiti Private Property"){
                  category_title = "Private graffiti";
                }
                else{
                  category_title = "Public graffiti";

                }
              svgBarPlot.select(".title")
                     .attr("x", (width / 2))
                     .attr("y", 25)
                     .attr("text-anchor", "middle")
                     .style("font-size", "22px")
                     .style("text-decoration", "bold")
                     .text(category_title+ " complaints by hour in  " + current_district);


});


d3.select(".barSelect")
  .on("click", function(){
    current_district = document.getElementById("thedropdown").value;
     var data_objects = [];
                for (var i = 0; i < data[current_category][1][current_district].length; i++) {
                    data_objects.push({
                                          count : data[current_category][0][current_district][i] ,
                                          clock:  data[current_category][1][current_district][i]
                                                  });
                  }
          //update bar plot
          svgBarPlot.selectAll("rect")
            .data(data_objects)
            .transition()
            .duration(1000)
            .ease("quad")
            .attr("x", function(d) { return xScale(d.clock); })
            .attr("width", xScale.rangeBand())
            .attr("y", function(d) {return  yScale(d.count); })
            .attr("height", function(d) { return height - yScale(d.count); });


  // update title
                var category_title;
                if  (current_category === "both"){
                  category_title = "Total graffiti";
                }
                else if(current_category  === "Graffiti Private Property"){
                  category_title = "Private graffiti";
                }
                else{
                  category_title = "Public graffiti";

                }

              svgBarPlot.select(".title")
                     .attr("x", (width / 2))
                     .attr("y", 25)
                     .attr("text-anchor", "middle")
                     .style("font-size", "22px")
                     .style("text-decoration", "bold")
                     .text(category_title+ " complaints by hour in  " + current_district);


  });

function categoryColor(category){

  switch(category){
    case "Graffiti Private Property":
      return "rgb(106, 174, 214)";
      case "Graffiti Public Property":
        return "rgb(251, 105, 74)";
      case "both":
        return "rgb(115, 196, 118)";
      default:
        console.log("somthing went woring with the coloring");
        return "rgb(0, 0, 0)";
  }

}
