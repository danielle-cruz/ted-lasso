d3.csv("data/apologies/ApologiesData.csv", function (d) {
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

    var margin = {
        top: 20,
        right: 80,
        bottom: 50,
        left: 50,
      },
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    radius = width / 2



    function getDirectionalData() {
        const directionalDataMap = new Map();
        for (const d of apologiesData) {
            if (directionalDataMap.has(d.to)) {
                var value = directionalDataMap.get(d.to);
                var imports = value.imports;
                imports.push(d.from);
                value.imports = imports;
                directionalDataMap.set(d.to, value);
            } else {
                var value = {
                    "name": d.to,
                    "size": 1,
                    "imports": [d.from]
                }
                directionalDataMap.set(d.to, value); 
            }

            if(!directionalDataMap.has(d.from)) {
                var value = {
                    "name": d.from,
                    "size": 1,
                    "imports": []
                }
                directionalDataMap.set(d.from, value); 
            }

        }
        return Array.from(directionalDataMap.values());
    }

    var hierarchicalData = getDirectionalData();

    // Some constants controlling the graph appearance
const PADDING_BUBBLE = 15 // distance between edge end and bubble
const PADDING_LABEL = 30 // distance between edge end and engineer name
const BUBBLE_SIZE_MIN = 4
const BUBBLE_SIZE_MAX = 20

var diameter = 800,
    radius = diameter / 2,
    innerRadius = radius - 170; // between center and edge end


    // The 'cluster' function takes 1 argument as input. It also has methods (??) like cluster.separation(), cluster.size() and cluster.nodeSize()
var cluster = d3.cluster()
.size([360, innerRadius]);

var line = d3.radialLine()
    .curve(d3.curveBundle.beta(0.85))
    .radius(function (d) { return d.y; })
    .angle(function (d) { return d.x / 180 * Math.PI; });

var svg = d3.select("#apologies-graph").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .append("g")
    .attr("transform", "translate(" + radius + "," + radius + ")");

    var link = svg.append("g").selectAll(".link"),
    label = svg.append("g").selectAll(".label"),
    bubble = svg.append("g").selectAll(".bubble");

    // Add a scale for bubble size
var bubbleSizeScale = d3.scaleLinear()
.domain([0, 100])
.range([BUBBLE_SIZE_MIN, BUBBLE_SIZE_MAX]);

    // Lazily construct the package hierarchy from class names.
function packageHierarchy(classes) {
    var map = {};

    function find(name, data) {
        var node = map[name], i;
        if (!node) {
            node = map[name] = data || { name: name, children: [] };
            if (name.length) {
                node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
                node.parent.children.push(node);
                node.key = name.substring(i + 1);
            }
        }
        return node;
    }

    classes.forEach(function (d) {
        find(d.name, d);
    });

    return d3.hierarchy(map[""]);
}

// Return a list of imports for the given array of nodes.
function packageImports(nodes) {
    var map = {},
        imports = [];

    // Compute a map from name to node.
    nodes.forEach(function (d) {
        map[d.data.name] = d;
    });

    // For each import, construct a link from the source to target node.
    nodes.forEach(function (d) {
        if (d.data.imports) d.data.imports.forEach(function (i) {
            imports.push(map[d.data.name].path(map[i]));
        });
    });

    return imports;
}



    // Reformat the data
    var root = packageHierarchy(hierarchicalData)
        //debugger;
        .sum(function (d) { console.log(d); return 0; });
    // console.log(root)

    // Build an object that gives feature of each leaves
    cluster(root);
    leaves = root.leaves()


    // Leaves is an array of Objects. 1 item = one leaf. Provides x and y for leaf position in the svg. Also gives details about its parent.
    link = link
        .data(packageImports(leaves))
        .enter().append("path")
        .each(function (d) { d.source = d[0], d.target = d[d.length - 1]; })
        .attr("class", "link")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "black")

    label = label
        .data(leaves)
        .enter().append("text")
        .attr("class", "label")
        .attr("dy", "0.31em")
        .attr("transform", function (d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + PADDING_LABEL) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
        .attr("text-anchor", function (d) { return d.x < 180 ? "start" : "end"; })
        .text(function (d) { return d.data.key; });

    bubble = bubble
        .data(leaves)
        .enter().append("circle")
        .attr("class", "bubble")
        .attr("transform", function (d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + PADDING_BUBBLE) + ",0)" })
        .attr('r', d => bubbleSizeScale(d.value))
        .attr('stroke', 'black')
        .attr('fill', '#69a3b2')
        .style('opacity', .2)




    /* line = d3.lineRadial()
      .curve(d3.curveBundle.beta(0.85))
      .radius(d => d.y)
      .angle(d => d.x)


    var tree = d3.cluster().size([2 * Math.PI, radius - 100])

    function hierarchy(apologiesData, delimiter = ".") {
        let root;
        const map = new Map;
        apologiesData.forEach(function find(data) {
          const {id} = data;
          if (map.has(id)) return map.get(id);
          const i = id.lastIndexOf(delimiter);
          map.set(id, data);
          if (i >= 0) {
            find({id: id.substring(0, i), children: []}).children.push(data);
            data.id = id.substring(i + 1);
          } else {
            root = data;
          }
          return data;
        });
        return root;
      }

    function bilink(root) {
        const map = new Map(root.leaves().map(d => [id(d), d]));
        for (const d of root.leaves()) d.incoming = [], d.outgoing = d.data.imports.map(i => [d, map.get(i)]);
        for (const d of root.leaves()) for (const o of d.outgoing) o[1].incoming.push(o);
        return root;
      }

    function id(node) {
        return `${node.parent ? id(node.parent) + "." : ""}${node.data.name}`;
      }

    const root = tree(bilink(d3.hierarchy(apologiesData)
      .sort((a, b) => d3.ascending(a.height, b.height) || d3.ascending(a.data.name, b.data.name))));

  const svg = d3.create("svg")
        .select("#apologies-graph")
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
      .on("mouseover", overed)
      .on("mouseout", outed)
      .call(text => text.append("title").text(d => `${id(d)}
${d.outgoing.length} outgoing
${d.incoming.length} incoming`));

  const link = svg.append("g")
      .attr("stroke", colornone)
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
    d3.selectAll(d.incoming.map(d => d.path)).attr("stroke", colorin).raise();
    d3.selectAll(d.incoming.map(([d]) => d.text)).attr("fill", colorin).attr("font-weight", "bold");
    d3.selectAll(d.outgoing.map(d => d.path)).attr("stroke", colorout).raise();
    d3.selectAll(d.outgoing.map(([, d]) => d.text)).attr("fill", colorout).attr("font-weight", "bold");
  }

  function outed(event, d) {
    link.style("mix-blend-mode", "multiply");
    d3.select(this).attr("font-weight", null);
    d3.selectAll(d.incoming.map(d => d.path)).attr("stroke", null);
    d3.selectAll(d.incoming.map(([d]) => d.text)).attr("fill", null).attr("font-weight", null);
    d3.selectAll(d.outgoing.map(d => d.path)).attr("stroke", null);
    d3.selectAll(d.outgoing.map(([, d]) => d.text)).attr("fill", null).attr("font-weight", null);
  }

  return svg.node();*/


  });