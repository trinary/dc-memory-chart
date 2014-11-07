var width = 900, height = 600;
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
  var nest = d3.nest()
    .key(function(d) { return d.name;})
    .entries(data);

  var color = d3.scale.category10();

  var x = d3.time.scale()
    .domain(d3.extent(data, function(d) { return new Date(d.time);}))
    .range([0,960]);
  var y = d3.scale.linear().domain([0, d3.max(data, acc)]).range([600,0]);
  console.log(y.domain());

  var line = d3.svg.line()
    .x(function(d) { return x(new Date(d.time)); })
    .y(function(d) { return y(acc(d)); });

  d3.select("svg").selectAll("path").remove();
  var lines = d3.select("svg").selectAll("path")
    .data(nest.map(function(d) { return d.values} ))
    .enter()
    .append("path")
    .style("stroke", function(d,i) { return color(i)})
    .style("fill", "none")
      .attr("d", line);
}



d3.json("data/data2.json", function(data) {
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

