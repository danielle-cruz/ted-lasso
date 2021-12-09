// const EMOTIONS = ["sadness", "joy", "fear", "disgust", "anger"];

// d3.csv("data/emotions/EmotionsData-Planned.csv",
//     function(d) {
//         return {
//             ep: d.ep,
//             sadness: +d.sadness,
//             joy: +d.joy,
//             fear: +d.fear,
//             disgust: +d.disgust,
//             anger: +d.anger,

// 	    };
//     }).then(function(emotionsData) {

//       console.log(emotionsData);
//       const slices = emotionsData.columns.slice(1).map(function(id) {
//         return {
//             id: id,
//             values: emotionsData.map(function(d){
//                 return {
//                     ep: d.ep,
//                     score: +d[id]
//                 };
//             })
//         };
//       });
//       console.log(slices)

//       const line = d3.line()
//         .x(function(d) { return x(d.ep); })
//         .y(function(d) { return y(d.score); });

//       var margin = {
//         top: 20,
//         right: 80,
//         bottom: 50,
//         left: 50
//       },

//       width = 900 - margin.left - margin.right,
//       height = 500 - margin.top - margin.bottom;

//       // append the svg object to the body of the page
//       var svg = d3.select("#emotions-graph")
//         .append("svg")
//           .attr("width", width + margin.left + margin.right)
//           .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//           .attr("transform",
//                 "translate(" + margin.left + "," + margin.top + ")");

//       // Add X axis --> it is a date format
//       var x = d3.scaleBand()
//         .domain(emotionsData.map(d => d.ep))
//         .range([ 0, width ])
//         .round(true);

//       svg
//         .append("g")
//         .attr("transform", "translate(0," + height + ")")
//         .call(d3.axisBottom(x))
//         .selectAll("text")
//           .attr("transform", "translate(-10,10)rotate(-45)")
//           .style("text-anchor", "end")

//       // Add Y axis
//       var y = d3.scaleLinear()
//         .domain([0, 0.8])
//         .range([ height, 0 ]);
//       svg.append("g")
//         .call(d3.axisLeft(y));

//       // This allows to find the closest X index of the mouse:
//       // var bisect = d3.bisector(function(d) { return d.ep; }).left;

//       // Create the circle that travels along the curve of chart
//       /*var focus = svg
//         .append('rect')
//           .style("fill", "none")
//           .attr("stroke", "black")
//           .attr("stroke-width", 10)
//           .style("opacity", 0)

//       // Create the text that travels along the curve of chart
//       var focusText = svg
//         .append('g')
//         .append('text')
//           .style("opacity", 0)
//           .attr("text-anchor", "left")
//           .attr("alignment-baseline", "middle")*/

//       let id = 0;
//       const ids = function () {
//           return "line-"+id++;
//       }

//       const lines = svg.selectAll("lines")
//         .data(slices)
//         .enter()
//         .append("g");

//       lines.append("path")
//         .attr("class", ids)
//         .attr("d", function(d) { return line(d.values); });

//       /*svg.append('path')
//             .datum(emotionsData)
//             .attr("fill", "none")
//             .attr("stroke", "orange")
//             .attr("stroke-width", 1.5)
//             .attr("d", d3.line()
//               .x(function(d) { return x(d.ep) + 10 })
//               .y(function(d) {
//                 console.log(d);
//                 return y(d.joy) })
//               )*/

//       var mouseG = svg.append("g")
//               .attr("class", "mouse-over-effects");

//             mouseG.append("path") // this is the black vertical line to follow mouse
//               .attr("class", "mouse-line")
//               .style("stroke", "black")
//               .style("stroke-width", "1px")
//               .style("opacity", "0");

//             var mousePerLine = mouseG.selectAll('.mouse-per-line')
//               .data(slices)
//               .enter()
//               .append("g")
//               .attr("class", "mouse-per-line");

//             mousePerLine.append("circle")
//               .attr("r", 7)
//               .style("fill", "none")
//               .style("stroke-width", "1px")
//               .style("opacity", "0");

//         mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
//               .attr('width', width) // can't catch mouse events on a g element
//               .attr('height', height)
//               .attr('fill', 'none')
//               .attr('pointer-events', 'all')
//               .on('mouseout', function() { // on mouse out hide line, circles and text
//                 d3.select(".mouse-line")
//                   .style("opacity", "0");
//                 d3.selectAll(".mouse-per-line circle")
//                   .style("opacity", "0");
//                 /* d3.selectAll(".mouse-per-line text")
//                   .style("opacity", "0");*/
//               })
//               .on('mouseover', function() { // on mouse in show line, circles and text
//                 d3.select(".mouse-line")
//                   .style("opacity", "1");
//                 d3.selectAll(".mouse-per-line circle")
//                   .style("opacity", "1");
//                 /* d3.selectAll(".mouse-per-line text")
//                   .style("opacity", "1"); */
//               })
//               .on('mousemove', function(event, d) { // mouse moving over canvas
//                 var mouse = d3.pointer(event);
//                 d3.select(".mouse-line")
//                   .attr("d", function() {
//                     var interval = x.step();

//                     var mousex = mouse[0];
//                     if (mousex < margin.left + width + margin.right && mousex > margin.left) {
//                       var index = Math.round(mouse[0]/ interval);
//                       d = "M" + x(emotionsData[index].ep) + "," + height;
//                       d += " " + x(emotionsData[index].ep)  + "," + 0;
//                     } else if (mousex < margin.left) {
//                       d = "M" + x("S01E01") + "," + height;
//                       d += " " + x("S01E01")  + "," + 0;
//                     } else {
//                       d = "M" + x("S02E12") + "," + height;
//                       d += " " + x("S02E12")  + "," + 0;
//                     }
//                     return d;
//                   });

//                 d3.selectAll(".mouse-per-line")
//                   .attr("transform", function(d, i) {

//                     var interval = x.step();

//                     var mousex = mouse[0];
//                     var index;
//                     if (mousex < margin.left + width + margin.right && mousex > margin.left) {
//                       index = Math.round(mouse[0]/ interval);
//                     } else if (mousex < margin.left) {
//                       index = 0;
//                     } else {
//                       index = 19;
//                     }

//                     var beginning = 0,
//                         end = lines[i].getTotalLength(),
//                         target = null;

//                     while (true){
//                       target = Math.floor((beginning + end) / 2);
//                       pos = lines[i].getPointAtLength(target);
//                       if ((target === end || target === beginning) && pos.x !== mousex) {
//                           break;
//                       }
//                       if (pos.x > mousex)      end = target;
//                       else if (pos.x < mousex) beginning = target;
//                       else break; //position found
//                     }

//                     d3.select(this).select('text')
//                       .text(y.invert(pos.y).toFixed(2));

//                     return "translate(" + mousex+ "," + pos.y +")";
//                   });
//               });

//       /*/ Create a rect on top of the svg area: this rectangle recovers mouse position
//       svg
//         .append('rect')
//         .style("fill", "none")
//         .style("pointer-events", "all")
//         .attr('width', width)
//         .attr('height', height)
//         .on('mouseover', mouseover)
//         .on('mousemove', mousemove)
//         .on('mouseout', mouseout);

//       // What happens when the mouse move -> show the annotations at the right positions.
//       function mouseover() {
//         focus.style("opacity", 1)
//         focusText.style("opacity",1)
//       }
//       function mousemove(event, d) {
//         var interval = x.step();
//         var index = Math.round((d3.pointer(event)[0]/ interval));
//         d = emotionsData[index]
//         focus
//           .attr("cx", x(d.ep) )
//           .attr("cy", y(d.joy))
//         focusText
//           .html("score:" + d.joy)
//           .attr("x", x(d.ep)+15)
//           .attr("y", y(d.joy))
//         }
//       function mouseout() {
//         focus.style("opacity", 0)
//         focusText.style("opacity", 0)
//       }*/
//     }
// );

// d3.csv("data/apologies/ApologiesData.csv",
//     function(d) {
//         return {
//             id: d.Id,
//             ep: d.Episode,
//             from: d.Apologizer,
//             to: d.Apologee,
//             from_gender: d.Apologizer_Gender,
//             to_gender: d.Apologee_Gender,
//             power: d.More_Power,
//             response: d.Response,
//             text: d.Text,
// 	    };
//     }).then(function(apologiesData) {
//       console.log(apologiesData);
//     }
// );