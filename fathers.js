d3.json("data/fathers/fathers-processed.json", function (d) {
  return {
    name: d.name,
    ep: d.ep,
    text: d.text,
    score: d.score,
  };
}).then(function (fathersData) {

  var margin = { top: 30, right: 50, bottom: 70, left: 60 },
    width = 750 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  const svg = d3
    .select("#fathers-graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

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
  fathersData.sort(function (b, a) {
    return calculateAverage(a) - calculateAverage(b);
  });

  // Add X axis
  const x = d3.scaleLinear().domain([-1, 1]).range([0, width]);

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // text label for the x axis
  svg
    .append("text")
    .attr("transform", "translate(" + width / 2 + " ," + (height + 50) + ")")
    .style("text-anchor", "middle")
    .text("Sentiment");

  // Y axis
  const y = d3
    .scaleBand()
    .range([0, height])
    .domain(
      fathersData.map(function (d) {
        return d.name;
      })
    )
    .padding(1);

  // Y axis label:
  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", x(0) - 20)
    .attr("x", 30)
    .text("Selected characters");

  // Y axis label:
  /* svg.append("text")
.attr("text-anchor", "end")
.attr("transform", "rotate(90)translate(150, -350)")
.text("Selected characters");*/

  function mouseover(event, d) {
    d3.select(this).style("fill", "rgba(1,117,233,0.7)");
    d3.select(this).style("stroke", "rgba(1,117,233,255)");

    svg
      .append("text")
      .attr("x", x(d.score))
      .attr("y", y(d.name) - 15)
      .attr("class", "ptLabel")
      .style("text-anchor", "middle")
      .text(`${d.ep}`);

    updateFatherData(d);
  }
  svg
    .append("g")
    .style("stroke", "#c4c4c4")
    .attr("stroke-width", 0.5)
    .selectAll("line")
    .data(fathersData)
    .join("line")
    .attr("x1", (d) => x(Math.min(...scoresMap.get(d.name))))
    .attr("x2", (d) => x(Math.max(...scoresMap.get(d.name))))
    .attr("y1", (d, i) => y(d.name))
    .attr("y2", (d, i) => y(d.name));

  svg
    .append("g")
    .selectAll("text")
    .data(fathersData)
    .join("text")
    .text((d) => d.name)
    .attr("dx", (d) => x(Math.max(...scoresMap.get(d.name))) + 15)
    .attr("dy", (d, i) => y(d.name) + 5);

  svg
    .selectAll("mycircle")
    .data(fathersData)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return x(d.score);
    })
    .attr("cy", function (d) {
      return y(d.name);
    })
    .attr("r", "6")
    .style("fill", "rgba(1,117,233,0.2)")
    .style("stroke", "rgba(1,117,233,9.7)")
    .attr("id", function (d) {
      return d.text;
    })
    .on("mouseover", mouseover)
    .on("mouseout", function (event, d) {
      d3.select(this).style("fill", "rgba(1,117,233,0.2)");
      d3.select(this).style("stroke", "rgba(1,117,233,0.7)");
      svg.selectAll(".ptLabel").remove();
    });

  svg
    .selectAll("avgcircle")
    .data(fathersData)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return x(calculateAverage(d));
    })
    .attr("cy", function (d) {
      return y(d.name);
    })
    .attr("r", "6")
    .style("fill", "rgba(255, 196, 93, 255)")
    .style("stroke", "rgba(242, 137, 51, 255)");

  const yAxis = svg
    .append("g")
    .attr("transform", `translate(${x(0)},0)`)
    .style("stroke-dasharray", 5.5)
    .call(d3.axisLeft(y));

  yAxis.selectAll("text").remove();
  yAxis.selectAll("line").remove();

  function updateFatherData(d) {
    var excerptsSection = document.querySelector("#fathers-excerpts-section");

    while (excerptsSection.firstChild) {
      excerptsSection.removeChild(excerptsSection.firstChild);
    }

    let excerptsSectionTitle = document.querySelector(
      "#fathers-excerpts-section-title"
    );
    excerptsSectionTitle.textContent = `Father excerpt: ${d.name} (${d.ep})`;

    let nameImage = document.createElement("img");
    nameImage.setAttribute("src", `images/characters/${d.name}.jpg`);
    nameImage.classList.add("nameImage");
    excerptsSectionTitle.appendChild(nameImage);

    let excerptText = document.createElement("p");
    excerptText.textContent = d.text;
    excerptText.classList.add("details");
    excerptsSection.appendChild(excerptText);
  }

  // Handmade legend
  svg
    .append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 6)
    .style("fill", "rgba(1,117,233,0.2)")
    .style("stroke", "rgba(1,117,233,0.7)");
  svg
    .append("circle")
    .attr("cx", 0)
    .attr("cy", 20)
    .attr("r", 6)
    .style("fill", "rgba(255, 196, 93, 255)")
    .style("stroke", "rgba(242, 137, 51, 255)");
  svg
    .append("text")
    .attr("x", 20)
    .attr("y", 0)
    .text("individual conversation sentiment")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle");
  svg
    .append("text")
    .attr("x", 20)
    .attr("y", 20)
    .text("overall average sentiment")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle");
});
