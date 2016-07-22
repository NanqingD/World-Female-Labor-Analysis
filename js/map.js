var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1200 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

var projection = d3.geo.mercator();
var path = d3.geo.path().projection(projection);

var svg = d3.select("#map1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
var g = svg.append("g");

var digitScale = d3.scale.category20b();

var isoidData;

//read json file
d3.json("json/world-50m.json", function(error, world) {
  //worldObjects = world;

  if(error) {
    console.log(error);
  }

  var countries = topojson.feature(world,world.objects.countries).features;

    //add shadow to stroke
  var filter = g.append("filter")
        .attr("id", "stroke-shadow")
        .attr("height", "120%");

      filter.append("feGaussianBlur")
          .attr("in", "SourceAlpha")
          .attr("stdDeviation", 1)
          .attr("result", "blur");

      filter.append("feOffset")
          .attr("in", "blur")
          .attr("dx", 0.1)
          .attr("dy", 0.1)
          .attr("result", "offsetBlur");

    var feMerge = filter.append("feMerge");

    feMerge.append("feMergeNode").attr("in", "offsetBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

      var filter2 = g.append("filter")
        .attr("id", "stroke-shadow2")
        .attr("height", "120%");

      filter2.append("feGaussianBlur")
          .attr("in", "SourceAlpha")
          .attr("stdDeviation", 2)
          .attr("result", "blur");

      filter2.append("feOffset")
          .attr("in", "blur")
          .attr("dx", 0.5)
          .attr("dy", 1)
          .attr("result", "offsetBlur");

    var feMerge2 = filter2.append("feMerge");

    feMerge2.append("feMergeNode").attr("in", "offsetBlur");
    feMerge2.append("feMergeNode").attr("in", "SourceGraphic");

    var filter3 = g.append("filter")
        .attr("id", "stroke-shadow3")
        .attr("height", "140%");

      filter3.append("feGaussianBlur")
          .attr("in", "SourceAlpha")
          .attr("stdDeviation", 2)
          .attr("result", "blur");

      filter3.append("feOffset")
          .attr("in", "blur")
          .attr("dx", 0.8)
          .attr("dy", 1.5)
          .attr("result", "offsetBlur");

    var feMerge3 = filter3.append("feMerge");

    feMerge3.append("feMergeNode").attr("in", "offsetBlur");
    feMerge3.append("feMergeNode").attr("in", "SourceGraphic");

    var filter4 = g.append("filter")
        .attr("id", "stroke-shadow4")
        .attr("height", "140%");

      filter4.append("feGaussianBlur")
          .attr("in", "SourceAlpha")
          .attr("stdDeviation", 2)
          .attr("result", "blur");

      filter4.append("feOffset")
          .attr("in", "blur")
          .attr("dx", 1.1)
          .attr("dy", 2.5)
          .attr("result", "offsetBlur");

    var feMerge4 = filter4.append("feMerge");

    feMerge4.append("feMergeNode").attr("in", "offsetBlur");
    feMerge4.append("feMergeNode").attr("in", "SourceGraphic");


    g.selectAll("path").data(countries).enter()
    .append("path").attr("d",path)
    .style("stroke","#fff")
    .style("stroke-width","1")
    .style("stroke-opacity","1")
    .style("stroke-linejoin","round");

  d3.csv("data/WomenInWorkforce.csv",function(error,data){ //WomenInWorkforce.csv
    if (error) {console.log(error);}
    isoidData = d3.map(data, function (county) { return Number(county.ISOID); //console.log(county.ISOID)
    });
    g.selectAll("path")
    .style("fill",function(d){
      var countryData = isoidData.get(d.id);//only get one id
      if (!countryData) { return "#DDDDDD";}
      else if (countryData.LaborForce <= 20) { return "#feebe2";}
      else if (countryData.LaborForce > 20 && countryData.LaborForce <=40) { return "#fbb4b9";}
      else if (countryData.LaborForce > 40 && countryData.LaborForce <=60) { return "#f768a1";}
      else if (countryData.LaborForce > 60 && countryData.LaborForce <=80) { return "#c51b8a";}
      else if (countryData.LaborForce > 80 && countryData.LaborForce <=100) { return "#7a0177";}

      return "#DDDDDD";
    })
    .style("filter",function(d){
      var countryData = isoidData.get(d.id);
      if (!countryData) { return false;}
      else if (countryData.LaborForce <=20) {return "url(#stroke-shadow4)";}
      else if (countryData.LaborForce > 20 && countryData.LaborForce <=40) { return "url(#stroke-shadow3)";}
      else if (countryData.LaborForce > 40 && countryData.LaborForce <=60) { return "url(#stroke-shadow2)";}
      else if (countryData.LaborForce > 60 && countryData.LaborForce <=80) { return "url(#stroke-shadow2)";}
      else if (countryData.LaborForce > 80 && countryData.LaborForce <=100) { return "url(#stroke-shadow)";}



    });
  });

});

//explanations
svg.append("text")
    .attr("x",width + 50)
    .attr("y",5)
    .attr("dy",".35em")
    .style("text-anchor", "end")
    .style("font-weight", "bold")
    .text("Female Labor Force Participation");

svg.append("rect")
      .attr("x", width + 41)
       .attr("y",15)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", "#7a0177")
svg.append("text")
    .attr("x",width + 28)
    .attr("y",9+15)
    .attr("dy",".35em")
    .style("text-anchor", "end")
    .text("80% - 100%");

svg.append("rect")
      .attr("x", width + 41)
      .attr("y",18+2+15)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", "#c51b8a");
svg.append("text")
    .attr("x",width + 28)
    .attr("y",9+20+15)
    .attr("dy",".35em")
    .style("text-anchor", "end")
    .text("60% - 80%");

svg.append("rect")
      .attr("x", width + 41)
      .attr("y",18+2+20+15)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", "#f768a1");
svg.append("text")
    .attr("x",width + 28)
    .attr("y",9+40+15)
    .attr("dy",".35em")
    .style("text-anchor", "end")
    .text("40% - 60%");

svg.append("rect")
      .attr("x", width + 41)
      .attr("y",18+2+20+20+15)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", "#fbb4b9");
svg.append("text")
    .attr("x",width + 28)
    .attr("y",9+60+15)
    .attr("dy",".35em")
    .style("text-anchor", "end")
    .text("20% - 40%");

svg.append("rect")
      .attr("x", width + 41)
      .attr("y",18+2+20+20+20+15)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", "#feebe2");
svg.append("text")
    .attr("x",width + 28)
    .attr("y",9+80+15)
    .attr("dy",".35em")
    .style("text-anchor", "end")
    .text("0% - 20%");

svg.append("rect")
      .attr("x", width + 41)
      .attr("y",18+2+20+20+20+20+15)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", "#DDDDDD");
svg.append("text")
    .attr("x",width + 28)
    .attr("y",9+100+15)
    .attr("dy",".35em")
    .style("text-anchor", "end")
    .text("Data Unavailable");

//title
/*svg.append("text")
    .style("fill","#4F598C")
    .style("font-size","18px")
    .attr("x",370)
    .attr("y",9)
    .attr("dy",".65em")
    .style("text-anchor", "end")
    .text("Map of Female Labor Force Participation(%)");
*/
