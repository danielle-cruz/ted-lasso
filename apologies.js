d3.csv("data/apologies/ApologiesData-Processed.csv", function (d) {
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
}).then(function (apologiesData) {
  console.log(apologiesData);

  /* var margin = {
      top: 20,
      right: 80,
      bottom: 50,
      left: 50,
    },
  width = 900 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;
  radius = width / 2 */

  var waypoint = new Waypoint({
    element: document.querySelector('#apologies-section'),
    handler: function(direction) {
      console.log('Scrolled to waypoint!')
    }
  })

  console.log('WOW JUST PRINTED SOMETHING')
  var str = "hi";
  console.log(`test: ${str}`)


  function getDirectionalData() {
      const directionalDataMap = new Map();
      for (const apology of apologiesData) {
          if (directionalDataMap.has(apology.to)) {
              var value = directionalDataMap.get(apology.to);
              console.log(value)
              var imports = value.imports;
              imports.push(apology.from);
              value.imports = imports;
              directionalDataMap.set(apology.to, value);
          } else {
            console.log(apology.to)
              var value = {
                  "name": apology.to,
                  "size": 1,
                  "imports": [apology.from]
              }
              directionalDataMap.set(apology.to, value); 
          }

          if(!directionalDataMap.has(apology.from)) {
            console.log(apology.from)
              var value = {
                  "name": apology.from,
                  "size": 1,
                  "imports": []
              }
              directionalDataMap.set(apology.from, value); 
          }

      }
      console.log(directionalDataMap)
      return Array.from(directionalDataMap.values());
  }

  var hierarchicalData = getDirectionalData();
  console.log(hierarchicalData)


/*
NEW
*/

var width = 500;
var radius = width / 2;


function hierarchy(data, delimiter = ".") {
  let root;
  const map = new Map;

  data.forEach(function find(data) {
    const {name} = data;

    if (map.has(name)) return map.get(name);
    
    const i = name.lastIndexOf(delimiter);
    
    map.set(name, data);
    if (i >= 0) {
      find({name: name.substring(0, i), children: []}).children.push(data);
      data.name = name.substring(i + 1);
    } else {
      root = data;
    }
    return data;

  });
  return root;
}

function bilink(root) {
  const map = new Map(root.leaves().map(d => [id(d), d]));
  console.log(map)
  console.log(root.leaves())
  for (const d of root.leaves()) {
    d.incoming = [], d.outgoing = d.data.imports.map(i => [d, map.get(i)])};
  for (const d of root.leaves()) for (const o of d.outgoing) o[1].incoming.push(o);
  return root;
}

function id(node) {
  return `${node.parent ? id(node.parent) + "." : ""}${node.data.name}`;
}

line = d3.lineRadial()
    .curve(d3.curveBundle.beta(0.25))
    .radius(d => d.y)
    .angle(d => d.x)

    tree = d3.cluster()
    .size([2 * Math.PI, radius - 100])
    .separation(function(a, b) { return 1; });


  const data = hierarchy(hierarchicalData);
  console.log(data)
  // const test = d3.hierarchy(hierarchicalData);
  // console.log(test)



  const root = tree(bilink(d3.hierarchy(data)
      .sort((a, b) => d3.ascending(a.height, b.height) || d3.ascending(a.data.name, b.data.name))));

  const svg = d3.select('#apologies-graph').append('svg')
    .attr("viewBox", [-width / 2, -width / 2, width, width]);

  const node = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
    .selectAll("g")
    .data(root.leaves())
    .join("g")
      .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)
    .append("text")
      .attr("dy", "0.31em")
      .attr("x", d => d.x < Math.PI ? 6 : -6)
      .attr("text-anchor", d => d.x < Math.PI ? "start" : "end")
      .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null)
      .text(d => d.data.name)
      .each(function(d) { d.text = this; })
      .on("click", clicked)
      .on("mouseover", overed)
      .on("mouseout", outed)
      .call(text => text.append("title").text(d => `${id(d).substring(6)}
apologies given: ${d.incoming.length}
apologies received: ${d.outgoing.length}`));

  const link = svg.append("g")
      .attr("stroke", COLOR_NONE)
      .attr("stroke-width", 3)
      .attr("fill", "none")
    .selectAll("path")
    .data(root.leaves().flatMap(leaf => leaf.outgoing))
    .join("path")
      .style("mix-blend-mode", "multiply")
      .attr("d", ([i, o]) => line(i.path(o)))
      .each(function(d) { d.path = this; });

  function overed(event, d) {
    link.style("mix-blend-mode", null);
    d3.select(this).attr("font-weight", "bold");
    d3.selectAll(d.incoming.map(d => d.path)).attr("stroke", COLOR_IN).raise();
    d3.selectAll(d.incoming.map(([d]) => d.text)).attr("fill", COLOR_IN).attr("font-weight", "bold");
    d3.selectAll(d.outgoing.map(d => d.path)).attr("stroke", COLOR_OUT).raise();
    d3.selectAll(d.outgoing.map(([, d]) => d.text)).attr("fill", COLOR_OUT).attr("font-weight", "bold");
  }

  function outed(event, d) {
    link.style("mix-blend-mode", "multiply");
    d3.select(this).attr("font-weight", null);
    d3.selectAll(d.incoming.map(d => d.path)).attr("stroke", null);
    d3.selectAll(d.incoming.map(([d]) => d.text)).attr("fill", null).attr("font-weight", null);
    d3.selectAll(d.outgoing.map(d => d.path)).attr("stroke", null);
    d3.selectAll(d.outgoing.map(([, d]) => d.text)).attr("fill", null).attr("font-weight", null);
  }

  function clicked(event, d) {
    console.log(d)
  }

  
});