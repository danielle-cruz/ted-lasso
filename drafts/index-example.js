// Set up size
var mapWidth = 1000;
var mapHeight = 750;
var DEGREES_TO_MILES = 54.6;

// Set up projection that the map is using
var scale = 190000;
var projection = d3.geoMercator()
    .center([-122.061578, 37.385532]) 
    .scale(scale)
    .translate([mapWidth / 2, mapHeight / 2]);

d3.csv("data/data.csv",
    function(d) {
        var coordinates = projection([+d.Longitude, +d.Latitude]);
        return {
            name: d.Name,
            address: d.Adress, 
            grade: d.Grade,
            score: +d.Score,
            x: coordinates[0],
            y: coordinates[1],
	    };
    }).then(function(restaurantData) {

        // Plot variables
        var filterName = "";
        var plotVars = ({
            plotWidth: 1000,
            plotHeight: 750,
            plotMargin: 10,
            plotCircleRadius: 5,
            locationCircleRadius: 100,
        });

        // Location variables
        var locationData = [
            {
                id: 'a', 
                x: projection(projection.center())[0] - 100, 
                y: projection(projection.center())[1],
                size: plotVars.locationCircleRadius,
                color: 'blue',
            },
            {
                id: 'b', 
                x: projection(projection.center())[0] + 100, 
                y: projection(projection.center())[1],
                size: plotVars.locationCircleRadius,
                color: 'red',
            }
        ];

        function createMap(mapWidth, mapHeight) {
            // Add an SVG element to the DOM
            var mapContainer = d3.select('#restaurant-finder').append('svg')
                .attr('width', plotVars.plotWidth + 2 * plotVars.plotMargin)
                .attr('height', plotVars.plotHeight + 2 * plotVars.plotMargin)
                .style('background-color', 'whitesmoke')
                .attr('id', 'mapContainer');

            // Add SVG map at correct size, assuming map is saved in a subdirectory called `data`
            var map = mapContainer.append('image')
                .attr('width', mapWidth)
                .attr('height', mapHeight)
                .attr('xlink:href', 'data/map.svg')
                .attr('transform', `translate(${plotVars.plotMargin},${plotVars.plotMargin})`);
            
            return mapContainer;
        }

        function plotRestaurants(restaurantData, mapContainer) { 
            const restaurantGroups = mapContainer.selectAll('g')
                .data(restaurantData, d => d.name)
                .join('g');
            
            restaurantGroups.append('circle')
                .attr('class', 'restaurant')
                .attr('r',  plotVars.plotCircleRadius)
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)           
                .attr('fill', 'white')
                .attr('stroke', null)

            restaurantGroups.append('circle')
                .attr('class', 'restaurant')
                .attr('r',  plotVars.plotCircleRadius)
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)           
                .attr('fill', function(d) {
                    if (checkIfRestaurantInRange(d) && checkIfRestaurantPassesFilter(d)) {
                        return 'rgba(137, 82, 196)';
                    } else {
                        return 'rgba(173, 173, 173, 0.7)';
                    }
                }
                )
                .attr('stroke', null)
                .on('mouseover', function (event, d) {
                    if (checkIfRestaurantInRange(d) && checkIfRestaurantPassesFilter(d)) {

                        d3.select('svg').append('text')
                        .attr('class', 'ptLabel')
                        .attr('x', d.x - 20)
                        .attr('y', d.y - 30)
                        .text(`${d.name}`); 

                        d3.select('svg').append('text')
                        .attr('class', 'ptScore')
                        .attr('x', d.x - 20)
                        .attr('y', d.y - 10)
                        .text(`(score: ${d.score})`); 
                    }
                })
                .on('mouseout', function(event, d) {
                    d3.select('svg').selectAll('.ptLabel').remove()    // Remove all ptLabels
                    d3.select('svg').selectAll('.ptScore').remove()    // Remove all ptLabels
                });
        }

        function plotLocations(locationData, mapContainer) { 

            const locationGroups = mapContainer.selectAll('g')
                .data(locationData, d => d.id)
                .join('g')
            
            locationGroups.append('circle')
                .attr('class', 'outer')
                .attr('id', d => `outer${d.id}`) 
                .attr('r', d => d.size + 3)
                .attr('cx', d => d.x)
                .attr('cy', d => d.y) 
                .attr('fill', 'transparent')      
                .attr('stroke', d => d.color)
                .attr('stroke-width', 5)  
                .style('opacity', 0.7)        
                    .call(d3.drag()
                    .subject(function(event,d) { return {x: event.x, y: event.y}; })
                        .on('start',resizeDragStarted)   
                        .on('drag',resizeDragged)
                        .on('end',resizeDragEnded)
                    )

            locationGroups.append('circle')
                .attr('class', 'inner')
                .attr('id', d => `inner${d.id}`) 
                .attr('r', d => d.size)
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
                .attr('fill', d => d.color) 
                .style('opacity', 0.3)        
                    .call(d3.drag()
                        .subject(function(event,d) { return {x: d.x, y: d.y}; })
                        .on('start',dragStarted)
                        .on('drag',dragged)
                        .on('end',dragEnded)
                    )

            
        }

        function plotLocationLabels(locationData, mapContainer) { 

            const locationLabelsGroups = mapContainer.selectAll('g')
                .data(locationData, d => d.id)
                .join('g')

            locationLabelsGroups.append('text')
                .attr('id', d => `label${d.id}`)
                .attr('x', d => d.x - 5)
                .attr('y', d => d.y)
                .text(d => d.id)
                .style('font-size', 'x-large')
                .style('font-weight', 'bold')
                .style('fill', d => d.color)

        }

        function getDistFromCircleCenter(circle, point) {
            const circCenterX = circle.x;
            const circCenterY = circle.y;
            return Math.sqrt(Math.pow(circCenterX - point.x, 2) + Math.pow(circCenterY - point.y, 2))
        }

        /**
         * Callback functions for the resizeDrag movement
         */
        function resizeDragStarted(event, d) {
            d3.select(`#outer${d.id}`).attr('stroke', d.color);
        }
        
        function resizeDragged(event, d) {
            d.size = getDistFromCircleCenter(d, event);

            d3.select(`#inner${d.id}`)
                .attr("r", d.size);
                
            d3.select(`#outer${d.id}`)
                .attr("r", d.size + 3)
            
            var mileRadius = calculateMileRadius(d);
            d3.select(`#${d.id}-miles`).text(mileRadius);
        }

        function calculateMileRadius(d) {
            var newRadius = projection.invert([d.x + d.size, d.y]);
            var oldRadius = projection.invert([d.x, d.y]);
            var miles = Math.abs(newRadius[0] - oldRadius[0]) * DEGREES_TO_MILES;
            return miles.toFixed(2);
        }
        
        function resizeDragEnded(event, d) {
            d3.select(`#outer${d.id}`).attr('stroke', d.color);
            plotRestaurants(restaurantData, restaurantLayer);

        } 

        /**
         * Callback functions for the drag movement
         */
            
        function dragStarted(event, d) {
            d3.select(`#outer${d.id}`).attr('stroke', d.color);
        }
    
        function dragged(event, d) {
            d.x = event.x;  
            d.y = event.y;   
            
            // Update position of inner circle
            d3.select(this)
                .attr('cx', d => d.x)
                .attr('cy', d => d.y); 
        
            // Update position of outer circle
            d3.select(`#outer${d.id}`)
                .attr('cx', d => d.x)
                .attr('cy', d => d.y); 
            
            // Update position of 'a' and 'b' labels
            d3.select(`#label${d.id}`)
                .attr('x', d => d.x - 5)
                .attr('y', d => d.y); 
        }
        
        function dragEnded(event, d) {
            d3.select(`#outer${d.id}`).attr('stroke', d.color);
            plotRestaurants(restaurantData, restaurantLayer);

        }

        /**
         * Filters by location range and name
         */
        function checkIfRestaurantInRange(d) {
            for (var location of locationData) {
                if (getDistFromCircleCenter(location, d) > location.size + 5) {
                    return false;
                }
            }
            return true;
        }

        function checkIfRestaurantPassesFilter(d) {
            return d.name.toLowerCase().includes(filterName.toLowerCase());
        }
        
        // Add event listeners
        const lookup = document.querySelector('#lookup');
        lookup.addEventListener('input', function(e) {
            filterName = e.target.value;
            plotRestaurants(restaurantData, restaurantLayer);
        });

        // Create layers for the visualization
        var map = createMap(mapWidth, mapHeight);
        var locationLayer = map.append('g').attr('id', 'locationLayer');
        var restaurantLayer = map.append('g').attr('id', 'restaurantLayer');
        var labelLayer = map.append('g').attr('id', 'labelLayer');
        
        // Plot datapoints and update DOM to reflect radius of locations
        plotLocations(locationData, locationLayer);
        for (var location of locationData) {
            var mileRadius = calculateMileRadius(location);
            d3.select(`#${location.id}-miles`).text(mileRadius);
        }
        plotRestaurants(restaurantData, restaurantLayer);
        plotLocationLabels(locationData, labelLayer);

    }
);
