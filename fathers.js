d3.json("fathers-processed.json", function (d) {
    return {
      name: d.name,
      ep: d.ep,
      text: d.text,
      score: d.score
    };
  }).then(function (fathersData) {
    console.log(fathersData);

    var margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 750 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const svg = d3.select('#fathers-graph')
        .append('svg')
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .style("opacity", 0.5)
        .append("g")
            .attr("transform",
                `translate(${margin.left}, ${margin.top})`);

    function getAggregateScores() {
        const scoresMap = new Map();
        for (const datum of fathersData) {
          if (scoresMap.has(datum.name)) {
              var scores = scoresMap.get(datum.name);
              scores.push(datum.score);
              scoresMap.set(datum.name, scores);
          } else {
              scoresMap.set(datum.name, [datum.score]); 
          }
      }
      return scoresMap;
    }


    var scoresMap = getAggregateScores();

    function calculateAverage(d) {
        var scores = scoresMap.get(d.name);
        return scores.reduce((a, b) => a + b) / scores.length;
    }


    // Sort data by average sentiment score
    fathersData.sort(function(b, a) {
        return calculateAverage(a) - calculateAverage(b);

    });


    // Add X axis
    const x = d3.scaleLinear()
        .domain([-1, 1])
        .range([ 0, width]);
    
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))

    // Y axis
    const y = d3.scaleBand()
        .range([ 0, height ])
        .domain(fathersData.map(function(d) { return d.name; }))
        .padding(1);

    const yAxis = svg.append("g")
        .attr("transform", `translate(${x(0)},0)`)
        .style("stroke-dasharray", 5.5)
        .call(d3.axisLeft(y));

        yAxis.selectAll("text").remove();
        yAxis.selectAll("line").remove();


        var tooltip = d3.select("#fathers-graph")
        .append("div")
    .style("opacity", 0)
    .style("display", "block")
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")


        function mouseover(event, d) {
            tooltip
      .style("opacity", 1)
          }
        
          function mousemove(event, d) {
              console.log(event.x)
            tooltip
                .html(`${d.ep} <br>
                ${d.text}`)
                .style("left", `${event.layerX+10}px`)
                .style("top", `${event.layerY}px`)

          } 

          function mouseleave(event, d) {
            tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
          }


          svg.selectAll("mycircle")
        .data(fathersData)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return x(d.score); })
        .attr("cy", function(d) { return y(d.name); })
        .attr("r", "6")
        .style("fill", "#69b3a2")
        .attr("id", function(d) { return d.text})
        .on("mouseover", mouseover )
        .on("mousemove", mousemove )
        .on("mouseleave", mouseleave )

        svg.selectAll("avgcircle")
        .data(fathersData)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return x(calculateAverage(d)); })
        .attr("cy", function(d) { return y(d.name); })
        .attr("r", "6")
        .style("fill", "#543213")
        .attr("id", function(d) { return d.text})
        .on("mouseover", mouseover )
        .on("mousemove", mousemove )
        .on("mouseleave", mouseleave )
    

    // Lines
    svg.selectAll("myline")
    .data(fathersData)
    .enter()
    .append("line")
        .attr("x1", function(d) { return x(Math.max(...scoresMap.get(d.name)));  } )
        .attr("x2", function(d) { return x(Math.min(...scoresMap.get(d.name))); } )
        .attr("y1", function(d) { return y(d.name); })
        .attr("y2", function(d) { return y(d.name); })
        .attr("stroke", "grey")
        .attr("stroke-width", "1px")


  });