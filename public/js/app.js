var width = 900, height = 600, margin = 40;
d3.select("body")
  .append("div")
  .style("margin", "20px")
  .append("select")
  .attr("id", "files");
d3.select("body")
  .append("div")
  .style("margin", "20px")
  .append("select")
  .attr("id", "picker");
var svg = d3.select("body").append("svg")
  .attr({
    width: width,
    height: height
    });

d3.select("body").append("div").append("h1").attr("id", "value");
d3.select("body").append("div").append("h1").attr("id", "time");
d3.select("body").append("div").append("h1").attr("id", "name");
svg.append("g").attr("class", "x axis").attr("transform", "translate(" + [margin,(height - margin)] + ")");
svg.append("g").attr("class", "y axis").attr("transform", "translate(" + [(width - margin), 0] + ")");

function accessor() {
  var args = arguments;
  var f = function (d) { 
    var current = d;
    for(var i=0; i < args.length; i++) {
      current = current[args[i]];
    }
    return current;
  };
  return f;
}


function drawField(data, acc) {

  function mouseOver(d) {
    d3.select("#value").text("Value: " + acc(d));
    d3.select("#time").text("Time: " + new Date(d.time));
    d3.select("#name").text("Service: " + d.name + " PID: " + d.pid);
    console.log(d, this);
  }

  function mouseOut(d) {
    d3.select(".detail").text("");
  }

  var nest = d3.nest()
    .key(function(d) { return d.name + d.pid;})
    .entries(data);

  var color = d3.scale.category10();

  var x = d3.time.scale()
    .domain(d3.extent(data, function(d) { return new Date(d.time);}))
    .range([0,width - margin - margin]);

  var y = d3.scale.linear().domain([0, d3.max(data, acc)]).range([height-margin,margin]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("right")
    .tickFormat(d3.format(".3s"));

  var line = d3.svg.line()
    .x(function(d) { return x(new Date(d.time)); })
    .y(function(d) { return y(d3.format("0.3f")(acc(d))); });

  d3.select("svg").selectAll("path").remove();
  d3.select("svg").selectAll(".pointc").remove();
  console.log(nest.map(function(d) { return d.values }));
  var lines = d3.select("svg").selectAll("path")
    .data(nest.map(function(d) { return d.values; } ))
    .enter()
    .append("path")
    .attr("transform", "translate(" + [margin, 0] + ")")
    .style("stroke", function(d,i) { return color(d[0].name); })
    .style("fill", "none")
      .attr("d", line);
  var points = d3.select("svg").selectAll(".pointc")
    .data(nest.map(function(d) { return d.values; }))
    .enter()
    .append("g")
    .attr("transform", "translate(" + [margin, 0] + ")")
    .classed("pointc", true)
    .selectAll(".point")
    .data(function(d) { return d;})
    .enter()
    .append("circle")
    .on("mouseover", mouseOver)
    .on("mouseout", mouseOut)
    .classed("point", true)
    .attr({
      cx: function(d) { return x(new Date(d.time)); },
      cy: function(d) { return y(acc(d)); },
      r: 5
    });
  d3.select(".x.axis").transition().call(xAxis);
  d3.select(".y.axis").transition().call(yAxis);
}

function getSetAndDraw(path) {
  d3.json(path, function(data) {
    function populatePicker(data) {
      var entries = d3.entries(data[0]);
      var groups = d3.select("#picker")
        .on("change", pickerChange)
        .selectAll("optgroup")
        .data(entries)
        .enter()
        .append("optgroup")
        .attr("label", function(d) {return d.key;});

      groups.selectAll("option")
        .data(function(d) { 
          if (typeof(d.value) == "object") { 
            return d3.entries(d.value);
          } else {
            return [];
          }
        })
        .enter()
        .append("option")
        .text(function(d) { return d.key; });
    }

    function pickerChange(event) { 
      var elem = d3.select(this.selectedOptions[0]);
      var parent = d3.select(elem.node().parentNode);
      drawField(data,accessor(parent.attr("label"), elem.text()));
    }
    populatePicker(data);
  });
}

d3.json("/files", function(files) {
  function fileChange(ev) {
    console.log(ev, d3.select(this.selectedOptions[0]).text());
    var file = d3.select(this.selectedOptions[0]).text();

    getSetAndDraw("/data/" + file);
  }
  var filePicker = d3.select("#files")
    .on("change", fileChange)
    .selectAll("option")
    .data(files)
    .enter()
    .append("option")
    .text(function(d) { return d;})
});
