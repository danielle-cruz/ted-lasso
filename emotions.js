console.log(COLORS)

d3.csv("data/emotions/EmotionsData-Planned.csv", function (d) {
  return {
    ep: d.ep,
    sentiment: +d.sentiment_score,
    sadness: +d.sadness,
    joy: +d.joy,
    fear: +d.fear,
    disgust: +d.disgust,
    anger: +d.anger,
  };
}).then(function (emotionsData) {
  console.log(emotionsData);

  var margin = {
      top: 20,
      right: 80,
      bottom: 50,
      left: 50,
    },
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#emotions-graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Add X axis --> it is a date format
  var x = d3
    .scaleBand()
    .domain(emotionsData.map((d) => d.ep))
    .range([0, width])
    .round(true);

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,10)rotate(-45)")
    .style("text-anchor", "end");

  // Add Y axis
  var y = d3.scaleLinear().domain([0, 0.8]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));


  svg
    .append("path")
    .datum(emotionsData)
    .attr("fill", "none")
    .attr("stroke", COLORS[3])
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.ep) + 10;
        })
        .y(function (d) {
          return y(d.joy);
        })
    );
  svg
    .append("path")
    .datum(emotionsData)
    .attr("fill", "none")
    .attr("stroke", COLORS[2])
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.ep) + 10;
        })
        .y(function (d) {
          return y(d.sadness);
        })
    );
  
    svg
    .append("path")
    .datum(emotionsData)
    .attr("fill", "none")
    .attr("stroke", COLORS[0])
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.ep) + 10;
        })
        .y(function (d) {
          return y(d.fear);
        })
    );
  svg
    .append("path")
    .datum(emotionsData)
    .attr("fill", "none")
    .attr("stroke", "green")
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.ep) + 10;
        })
        .y(function (d) {
          return y(d.disgust);
        })
    );
    svg
    .append("path")
    .datum(emotionsData)
    .attr("fill", "none")
    .attr("stroke", COLORS[4])
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.ep) + 10;
        })
        .y(function (d) {
          return y(d.anger);
        })
    );

  var vertical = svg
    .append("g")
    .append("rect")
    .attr("class", "mouse-line")
    .style("stroke", "black")
    .style("opacity", "0")
    .attr("width", 0.75)
    .attr("height", height);

  // Create the circle that travels along the curve of chart
  var joyFocus = svg
    .append("g")
    .append("circle")
    .style("fill", "none")
    .attr("stroke", COLORS[3])
    .attr("r", 8.5)
    .style("opacity", 0);

  // Create the text that travels along the curve of chart
  var joyText = svg
    .append("g")
    .append("text")
    .style("opacity", 0)
    .attr("text-anchor", "left")
    .attr("alignment-baseline", "middle")
    .style("fill", COLORS[3]);

  // Create the circle that travels along the curve of chart
  var sadFocus = svg
    .append("g")
    .append("circle")
    .style("fill", "none")
    .attr("stroke", COLORS[2])
    .attr("r", 8.5)
    .style("opacity", 0);

  // Create the text that travels along the curve of chart
  var sadText = svg
    .append("g")
    .append("text")
    .style("opacity", 0)
    .attr("text-anchor", "left")
    .attr("alignment-baseline", "middle")
    .style("fill", COLORS[2]);

  
  // Create the circle that travels along the curve of chart
  var fearFocus = svg
    .append("g")
    .append("circle")
    .style("fill", "none")
    .attr("stroke", COLORS[0])
    .attr("r", 8.5)
    .style("opacity", 0);

  // Create the text that travels along the curve of chart
  var fearText = svg
    .append("g")
    .append("text")
    .style("opacity", 0)
    .attr("text-anchor", "left")
    .attr("alignment-baseline", "middle")
    .style("fill", COLORS[0]);

  // Create the circle that travels along the curve of chart
  var disgustFocus = svg
    .append("g")
    .append("circle")
    .style("fill", "none")
    .attr("stroke", "green")
    .attr("r", 8.5)
    .style("opacity", 0);

  // Create the text that travels along the curve of chart
  var disgustText = svg
    .append("g")
    .append("text")
    .style("opacity", 0)
    .attr("text-anchor", "left")
    .attr("alignment-baseline", "middle")
    .style("fill", "green");

  // Create the circle that travels along the curve of chart
  var angerFocus = svg
    .append("g")
    .append("circle")
    .style("fill", "none")
    .attr("stroke", COLORS[4])
    .attr("r", 8.5)
    .style("opacity", 0);

  // Create the text that travels along the curve of chart
  var angerText = svg
    .append("g")
    .append("text")
    .style("opacity", 0)
    .attr("text-anchor", "left")
    .attr("alignment-baseline", "middle")
    .style("fill", COLORS[4]);



  // Create a rect on top of the svg area: this rectangle recovers mouse position
  svg
    .append("rect")
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr("width", width)
    .attr("height", height)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseout", mouseout);
  
  // Handmade legend
  svg.append("circle").attr("cx",50).attr("cy",0).attr("r", 6).style("fill", "#69b3a2")
  svg.append("circle").attr("cx",50).attr("cy",20).attr("r", 6).style("fill", "#404080")
  svg.append("text").attr("x", 70).attr("y", 0).text("variable A").style("font-size", "15px").attr("alignment-baseline","middle")
  svg.append("text").attr("x", 70).attr("y", 20).text("variable B").style("font-size", "15px").attr("alignment-baseline","middle")


  // What happens when the mouse move -> show the annotations at the right positions.
  function mouseover() {
    vertical.style("opacity", 1);
    joyFocus.style("opacity", 1);
    joyText.style("opacity", 1);
    sadFocus.style("opacity", 1);
    sadText.style("opacity", 1);
    fearFocus.style("opacity", 1);
    fearText.style("opacity", 1);
    disgustFocus.style("opacity", 1);
    disgustText.style("opacity", 1);
    angerFocus.style("opacity", 1);
    angerText.style("opacity", 1);
  }
  function mousemove(event, d) {
    var interval = x.step();
    var index = Math.round(d3.pointer(event)[0] / interval);
    d = emotionsData[index];
    vertical.attr("x", x(d.ep) + 10);

    joyFocus.attr("cx", x(d.ep) + 10).attr("cy", y(d.joy));
    joyText
      .html("joy: " + d.joy)
      .attr("x", x(d.ep) + 25)
      .attr("y", y(d.joy));
    sadFocus.attr("cx", x(d.ep) + 10).attr("cy", y(d.sadness));
    sadText
      .html("sadness: " + d.sadness)
      .attr("x", x(d.ep) + 25)
      .attr("y", y(d.sadness));
    fearFocus.attr("cx", x(d.ep) + 10).attr("cy", y(d.fear));
    fearText
      .html("fear: " + d.fear)
      .attr("x", x(d.ep) + 25)
      .attr("y", y(d.fear));
    disgustFocus.attr("cx", x(d.ep) + 10).attr("cy", y(d.disgust));
    disgustText
        .html("disgust: " + d.disgust)
        .attr("x", x(d.ep) + 25)
        .attr("y", y(d.disgust));
    angerFocus.attr("cx", x(d.ep) + 10).attr("cy", y(d.anger));
    angerText
      .html("anger: " + d.anger)
      .attr("x", x(d.ep) + 25)
      .attr("y", y(d.anger));

  }
  function mouseout() {
    vertical.style("opacity", 0);
    joyFocus.style("opacity", 0);
    joyText.style("opacity", 0);
    sadFocus.style("opacity", 0);
    sadText.style("opacity", 0);
    fearFocus.style("opacity", 1);
    fearText.style("opacity", 0);
    disgustFocus.style("opacity", 0);
    disgustText.style("opacity", 0);
    angerFocus.style("opacity", 0);
    angerText.style("opacity", 0);
  }
});
