d3.csv("data/emotions/EmotionsData-Planned-Details.csv", function (d) {
  return {
    ep: d.ep,
    sentiment: +d.sentiment_score,
    sadness: +d.sadness,
    joy: +d.joy,
    fear: +d.fear,
    disgust: +d.disgust,
    anger: +d.anger,
    details: d.details
  };
}).then(function (emotionsData) {
  console.log(emotionsData);

  var margin = {
      top: 20,
      right: 50,
      bottom: 100,
      left: 60,
    },
    width = 750 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

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
    .scalePoint()
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
  
  // text label for the x axis
  svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 60) + ")")
      .style("text-anchor", "middle")
      .text("Episode");

  // Add Y axis
  var y = d3.scaleLinear().domain([0, 0.8]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // text label for the y axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Share of Emotion Detected");  


  svg
    .append("path")
    .datum(emotionsData)
    .attr("fill", "none")
    .attr("stroke", COLORS[0])
    .attr("stroke-width", 2)
    .style("opacity", 0.75)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.ep);
        })
        .y(function (d) {
          return y(d.joy);
        })
    );
  svg
    .append("path")
    .datum(emotionsData)
    .attr("fill", "none")
    .attr("stroke", COLORS[1])
    .attr("stroke-width", 2)
    .style("opacity", 0.75)

    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.ep);
        })
        .y(function (d) {
          return y(d.sadness);
        })
    );
  
    svg
    .append("path")
    .datum(emotionsData)
    .attr("fill", "none")
    .attr("stroke", COLORS[2])
    .attr("stroke-width", 2)
    .style("opacity", 0.75)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.ep);
        })
        .y(function (d) {
          return y(d.fear);
        })
    );
  svg
    .append("path")
    .datum(emotionsData)
    .attr("fill", "none")
    .attr("stroke", COLORS[3])
    .attr("stroke-width", 2)
    .style("opacity", 0.75)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.ep);
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
    .attr("stroke-width", 2)
    .style("opacity", 0.75)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.ep);
        })
        .y(function (d) {
          return y(d.anger);
        })
    );

  var vertical = svg
    .append("g")
    .append("rect")
    .attr("class", "mouse-line")
    .style("stroke", "grey")
    .style("opacity", "0")
    .attr("width", 0.01)
    .attr("height", height);

  // Create the circle that travels along the curve of chart
  var joyFocus = svg
    .append("g")
    .append("circle")
    .style("fill", "none")
    .attr("stroke", COLORS[0])
    .attr("stroke-width", "2px")
    .attr("r", 10)
    .style("opacity", 0);

  // Create the text that travels along the curve of chart
  var joyText = svg
    .append("g")
    .append("text")
    .attr("class", "p")
    .style("opacity", 0)
    .attr("text-anchor", "left")
    .attr("alignment-baseline", "middle")


  // Create the circle that travels along the curve of chart
  var sadFocus = svg
    .append("g")
    .append("circle")
    .style("fill", "none")
    .attr("stroke", COLORS[1])
    .attr("stroke-width", "2px")
    .attr("r", 10)
    .style("opacity", 0);

  // Create the text that travels along the curve of chart
  var sadText = svg
    .append("g")
    .append("text")
    .style("opacity", 0)
    .attr("text-anchor", "left")
    .attr("alignment-baseline", "middle")

  
  // Create the circle that travels along the curve of chart
  var fearFocus = svg
    .append("g")
    .append("circle")
    .style("fill", "none")
    .attr("stroke", COLORS[2])
    .attr("stroke-width", "2px")
    .attr("r", 10)
    .style("opacity", 0);

  // Create the text that travels along the curve of chart
  var fearText = svg
    .append("g")
    .append("text")
    .style("opacity", 0)
    .attr("text-anchor", "left")
    .attr("alignment-baseline", "middle")

  // Create the circle that travels along the curve of chart
  var disgustFocus = svg
    .append("g")
    .append("circle")
    .style("fill", "none")
    .attr("stroke", COLORS[3])
    .attr("stroke-width", "2px")
    .attr("r", 10)
    .style("opacity", 0);

  // Create the text that travels along the curve of chart
  var disgustText = svg
    .append("g")
    .append("text")
    .style("opacity", 0)
    .attr("text-anchor", "left")
    .attr("alignment-baseline", "middle")

  // Create the circle that travels along the curve of chart
  var angerFocus = svg
    .append("g")
    .append("circle")
    .style("fill", "none")
    .attr("stroke", COLORS[4])
    .attr("stroke-width", "2px")
    .attr("r", 10)
    .style("opacity", 0);

  // Create the text that travels along the curve of chart
  var angerText = svg
    .append("g")
    .append("text")
    .style("opacity", 0)
    .attr("text-anchor", "left")
    .attr("alignment-baseline", "middle")



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
  var EMOTIONS = ["joy", "sadness", "fear", "disgust", "anger"]
  var NUM_EMOTIONS = 5;
  var SIZE = 8;
  var XOFFSET_SQUARE = 50;
  var XOFFSET_TEXT = 70;

  for (var i = 0; i < NUM_EMOTIONS; i++) {
    var xSegment = Math.floor(i/2)
    var ySegment = i % 2;
    svg.append("rect").attr("x", XOFFSET_SQUARE + xSegment * 150).attr("y", ySegment * 20).attr("width", SIZE).attr("height", SIZE).style("fill", COLORS[i]);
    svg.append("text").attr("x", XOFFSET_TEXT + xSegment * 150).attr("y", ySegment * 20 + 5).text(EMOTIONS[i]).style("font-size", "15px").attr("alignment-baseline","middle")

  }
  // svg.append("rect").attr("x",50).attr("y",0).attr("width", 6).attr("height", 6).style("fill", "#69b3a2")
  // svg.append("rect").attr("x",50).attr("y",20).attr("width", 6).attr("height", 6).style("fill", "#404080")
  // svg.append("text").attr("x", 70).attr("y", 0).text("variable A").style("font-size", "15px").attr("alignment-baseline","middle")
  // svg.append("text").attr("x", 70).attr("y", 20).text("variable B").style("font-size", "15px").attr("alignment-baseline","middle")


  // What happens when the mouse move -> show the annotations at the right positions.
  function mouseover() {
    vertical.style("opacity", 0.6);
    joyFocus.style("opacity", 0.6);
    joyText.style("opacity", 1);
    sadFocus.style("opacity", 0.6);
    sadText.style("opacity", 1);
    fearFocus.style("opacity", 0.6);
    fearText.style("opacity", 1);
    disgustFocus.style("opacity",0.8);
    disgustText.style("opacity", 1);
    angerFocus.style("opacity", 0.6);
    angerText.style("opacity", 1);
  }
  function mousemove(event, d) {
    var interval = x.step();
    var index = Math.round(d3.pointer(event)[0] / interval);
    d = emotionsData[index];
    vertical.attr("x", x(d.ep));

    joyFocus.attr("cx", x(d.ep)).attr("cy", y(d.joy));
    joyText
      .html(d.joy.toFixed(3))
      .attr("x", 100)
      .attr("y", 5);
    sadFocus.attr("cx", x(d.ep)).attr("cy", y(d.sadness));
    sadText
      .html(d.sadness.toFixed(3))
      .attr("x", 135)
      .attr("y", 25);
    fearFocus.attr("cx", x(d.ep)).attr("cy", y(d.fear));
    fearText
      .html(d.fear.toFixed(3))
      .attr("x", 260)
      .attr("y", 5);
    disgustFocus.attr("cx", x(d.ep)).attr("cy", y(d.disgust));
    disgustText
        .html(d.disgust.toFixed(3))
        .attr("x", 280)
        .attr("y", 25);
    angerFocus.attr("cx", x(d.ep)).attr("cy", y(d.anger));
    angerText
      .html(d.anger.toFixed(3))
      .attr("x", 420)
      .attr("y", 5);
      
    updateEpisodeData(d);
  }
  function mouseout() {
    vertical.style("opacity", 0);

  }

  //var excerptsData = getExcerptData();
  // console.log(excerptsData)
  function updateEpisodeData(d) {
    console.log(d)
    // var excerpts = excerptsData.get(`group.${d.data.name}`);
    var excerptsSection = document.querySelector('#episodes-excerpts-section');
    
    while (excerptsSection.firstChild) {
      excerptsSection.removeChild(excerptsSection.firstChild);
    }

    let excerptsSectionTitle = document.querySelector('#episodes-excerpts-section-title');
    excerptsSectionTitle.textContent = `Episode detail: ${d.ep}`

    let excerptText = document.createElement('p');
    excerptText.textContent = d.details;
    excerptText.classList.add('details');
    excerptsSection.appendChild(excerptText);



    /* for (var excerpt of excerpts) {
      let excerptElem = document.createElement('div');
      let excerptText = document.createElement('p');
      excerptText.textContent = excerpt.text;
      excerptElem.appendChild(excerptText);
      excerptElem.classList.add('excerpt')
      excerptsSection.appendChild(excerptElem);
    }*/
  }
});
