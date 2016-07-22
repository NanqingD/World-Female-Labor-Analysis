var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1056 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

// setup x
var xValue = function(d) { return d.literacyRate;}, // data -> value
    xScale = d3.scale.linear().domain([0,100]).range([0, width - 300]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(11);

// setup y
var yValue = function(d) { return d.LFPrate;}, // data -> value
    yScale = d3.scale.linear().domain([0,100]).range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(5);

// setup fill color
var color = function(d) {
      if (d.LFPrate <= 20 && d.state == "dark") { return "#feebe2";}
      else if ( d.state == "dark" && d.LFPrate > 20 && d.LFPrate <=40) { return "#fbb4b9";}
      else if (d.state == "dark" && d.LFPrate > 40 && d.LFPrate <=60) { return "#f768a1";}
      else if (d.state == "dark" && d.LFPrate > 60 && d.LFPrate <=80) { return "#c51b8a";}
      else if (d.state == "dark" && d.LFPrate > 80 && d.LFPrate <=100) { return "#7a0177";}
      return "#bdbdbd";
}



var cValue = function(d) { return d.developState;};

// add the graph canvas to the body of the webpage
var svg = d3.select("#map2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


// load data
d3.csv("data/mergedData.csv", function(error, data) {
  
  if (error) {console.log(error);}



  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      
    .append("text")
      .attr("class", "label")
      .attr("x", width - 300)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Female Literacy Rate (%)");

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)

    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Female Labor Force Participation (%)");


   var symbolTypes = {
    "triangleUp": d3.svg.symbol().type("triangle-up"),
    "circle": d3.svg.symbol().type("circle"),
    "square": d3.svg.symbol().type("square")
};

// assign d from our symbols
   svg.selectAll("path")
    .data(data)
    .enter()
    .append("path")
    .attr("transform", function(d) { 
        return "translate(" + xMap(d) +  "," +  yMap(d) + ")"; 
        
    })
    .attr("d", function(d,i){
        if (d.developState === "High Human Development") {// circle if bar === 0
            return symbolTypes.circle();
        }
        else if (d.developState === "Medium Human Development") {
            return symbolTypes.triangleUp();
        }
        else {
          return symbolTypes.square();
        }
    })
    .style("fill", color)
    .style("opacity",function(d){
      if (d.state == "light") { return 0.3;}
      else return 1;
    })
    ;

var developState = ["High Human Development","Medium Human Development","Low Human Development"];

  // draw legend
  var highSymbol = d3.svg.symbol().type('circle')(),
      mediumSymbol = d3.svg.symbol().type('triangle-up')(),
      lowSymbol = d3.svg.symbol().type('rect')();

  var legend = svg.selectAll(".legend")
      .data(developState)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; });

svg.append("rect")
      .attr("x", 978)
      .attr("y",0)
      .attr("width", 18)
      .attr("height", 18)
         .style("stroke", "black")
	.style("fill", "white");
     


svg.append("polygon")
    .attr("points", "978,38 996,38 987,20")
    .attr("x", width)
    .attr("y",20)
     .style("stroke", "black")
	.style("fill", "white");

svg.append("circle")
      .attr("cx", 987)
      .attr("cy",49)
      .attr("r", 9)
          .style("stroke", "black")
	.style("fill", "white");

  // draw legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;})

    // add lables
    d3.csv("data/mergedData.csv",function(error, data){
      if (error) {console.log(error);}

      for (var i = data.length - 1; i >= 0; i--) {
        var country = data[i].Country;
        var literacyRate = data[i].literacyRate;
        var laborForce = data[i].LFPrate;
        //console.log(country);

        svg.append("text")
        .data(data)
        .attr("x", function(d){ return data[i].literacyRate * 7 + 5;})
        .attr("y", function(d){ return 5 * (100 - data[i].LFPrate);})
        .attr("dy",".35em")
        .text(function(d){
          if (data[i].state == "dark") { return data[i].Country;}
        });
      }

    });


});
