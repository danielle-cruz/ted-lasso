
d3.csv("data/emotions/EmotionsData-Planned.csv",
    function(d) {
        return {
            ep: d.ep,
            sentiment: +d.sentiment_score, 
            sadness: +d.sadness,
            joy: +d.joy,
            fear: +d.fear,
            disgust: +d.disgust,
            anger: +d.anger,

	    };
    }).then(function(emotionsData) {

      console.log(emotionsData);
      
      var margin = {
        top: 20,
        right: 80,
        bottom: 50,
        left: 50
      },

      width = 900 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

      // append the svg object to the body of the page
      var svg = d3.select("#emotions-graph")
        .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

      // Add X axis --> it is a date format
      var x = d3.scaleBand()
        .domain(emotionsData.map(d => d.ep))
        .range([ 0, width ])
        .round(true);

      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
          .attr("transform", "translate(-10,10)rotate(-45)")
          .style("text-anchor", "end")
          
      /* svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)); */

      // Add Y axis
      var y = d3.scaleLinear()
        .domain([0, 1])
        .range([ height, 0 ]);
      svg.append("g")
        .call(d3.axisLeft(y));

      // This allows to find the closest X index of the mouse:
      var bisect = d3.bisector(function(d) { return d.ep; }).left;

      // Create the circle that travels along the curve of chart
      var focus = svg
        .append('g')
        .append('circle')
          .style("fill", "none")
          .attr("stroke", "black")
          .attr('r', 8.5)
          .style("opacity", 0)

      // Create the text that travels along the curve of chart
      var focusText = svg
        .append('g')
        .append('text')
          .style("opacity", 0)
          .attr("text-anchor", "left")
          .attr("alignment-baseline", "middle")
      
      svg.append('path')
            .datum(emotionsData)
            .attr("fill", "none")
            .attr("stroke", "orange")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
              .x(function(d) { return x(d.ep) + 10 })
              .y(function(d) { 
                console.log(d);
                return y(d.joy) })
              )

      // Create a rect on top of the svg area: this rectangle recovers mouse position
      svg
        .append('rect')
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('width', width)
        .attr('height', height)
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout);

      // What happens when the mouse move -> show the annotations at the right positions.
      function mouseover() {
        focus.style("opacity", 1)
        focusText.style("opacity",1)
      }
      function mousemove(event, d) {
        var interval = x.step();
        var index = Math.round((d3.pointer(event)[0]/ interval));
        d = emotionsData[index]
        focus
          .attr("cx", x(d.ep)+ 10 )
          .attr("cy", y(d.joy))
        focusText
          .html("score:" + d.joy)
          .attr("x", x(d.ep)+25)
          .attr("y", y(d.joy))
        }
      function mouseout() {
        focus.style("opacity", 0)
        focusText.style("opacity", 0)
      }
    }
);

d3.csv("data/apologies/ApologiesData.csv",
    function(d) {
        return {
            id: d.Id,
            ep: d.Episode,
            from: d.Apologizer,
            to: d.Apologee,
            from_gender: d.Apologizer_Gender,
            to_gender: d.Apologee_Gender,
            power: d.More_Power,
            response: d.Response,
            text: d.Text,
	    };
    }).then(function(apologiesData) {
      console.log(apologiesData);
    }
);