d3.json("fathers.json", function (d) {
    return {
      name: d.name,
      lines: d.lies
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
        .append("g")
            .attr("transform",
                `translate(${margin.left}, ${margin.top})`);
    
    // Sort data by average sentiment score
    fathersData.sort(function(b, a) {
        var aScores = [];
        var bScores = [];

        for (line of a.lines) aScores.push(line.score)
        for (line of b.lines) bScores.push(line.score)

        const aAverage = aScores.reduce((a, b) => a + b) / aScores.length;
        const bAverage = bScores.reduce((a, b) => a + b) / bScores.length;

        return aAverage - bAverage;

    });

    function getMaxScore(d) {
        var scores = [];
        for (line of d.lines) scores.push(line.score);
        console.log(Math.max(...scores))
        return Math.max(...scores);
    }

    function getMinScore(d) {
        var scores = [];
        for (line of d.lines) scores.push(line.score);
        console.log(Math.min(...scores))

        return Math.min(...scores);
    }

    // Add X axis
    const x = d3.scaleLinear()
        .domain([-1, 1])
        .range([ 0, width]);
        svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Y axis
    const y = d3.scaleBand()
        .range([ 0, height ])
        .domain(fathersData.map(function(d) { return d.name; }))
        .padding(1);

    svg.append("g")
        .attr("transform", `translate(${x(0)},0)`)
        .call(d3.axisLeft(y));

    
    

    // Lines
    svg.selectAll("myline")
    .data(fathersData)
    .enter()
    .append("line")
    .attr("x1", function(d) { return x(getMaxScore(d)); } )
    .attr("x2", function(d) { return x(getMinScore(d)); } )
    .attr("y1", function(d) { return y(d.name); })
    .attr("y2", function(d) { return y(d.name); })
    .attr("stroke", "grey")
    .attr("stroke-width", "1px")


    svg.selectAll("mycircle")
    .data(fathersData)
    .enter()
    .append("circle")
      .attr("cx", function(d) { return x(d.lines[0].score); })
      .attr("cy", function(d) { return y(d.name); })
      .attr("r", "6")
      .style("fill", "#69b3a2")

      svg.selectAll("mycircle")
      .data(fathersData)
      .enter()
      .append("circle")
        .attr("cx", function(d) { return x(d.lines[1].score); })
        .attr("cy", function(d) { return y(d.name); })
        .attr("r", "6")
        .style("fill", "#69b3a2")

  /* svg.selectAll("mycircle")
  .data(fathersData)
  .enter()
  .append("circle")
    .attr("cx", function(d) { return x(d.lines[0].score); })
    .attr("cy", function(d) { return y(d.name); })
    .attr("r", "6")
    .style("fill", "#69b3a2")*/

    /* var groups = svg.selectAll("g")
        .data(fathersData)
        .enter()
        .append("g"); */

    /* groups.each(function(d,i) {
        for (var x = 1; x <= d.lines.length; x++) {
        d3.select(this).append('circle')
            .attr("cx", function(d) { 
                console.log(d.lines[x].score)
                return x(d.lines[x].score); })
            .attr("cy", function(d) { return y(d.name); })
            .attr("r", "6")
            .style("fill", "#69b3a2")
        }
    });*/

  });