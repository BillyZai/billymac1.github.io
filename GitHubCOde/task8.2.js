function init() {
    var w = 500; // Dynamic width
    var h = 500; // Dynamic height

    // Define a projection method (Mercator projection centered on coordinates)
    var projection = d3.geoMercator()
                       .scale(3000)
                       .center([145.5, -37.5]) 
                       .translate([w / 2, h / 2]); 

    // Define path generator using the projection
    var path = d3.geoPath().projection(projection);

    // Append an SVG element to the DOM
    var svg = d3.select("#MapOnpage")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

    var tooltip=d3.select("body")
                .append("div")
                .attr("class", "tooltip")
                .style("position", "absolute")
                .style("background-color", "white")
                .style("border", "1px solid #ccc")
                .style("padding", "5px")
                .style("border-radius", "5px")
                .style("opacity", 0);

    // Define a color scale for better visualization
    var color = d3.scaleSequential(d3.interpolateBlues)
                  .domain([0, 10, 30]); // Adjust domain based on your data

    // Load the CSV file using promises (d3.v7 syntax)
    d3.csv("VIC_LGA_unemployment.csv").then(function(data) {
        // Log the data to ensure it is loaded correctly
        console.log("Loaded data:", data);

        // Convert 'unemployed' to numeric if needed
        data.forEach(function(d) {
            if (d.unemployed) {
                d.unemployed = +d.unemployed; // Convert 'unemployed' to number
            } else {
                console.error("Missing 'unemployed' field in row:", d);
            }
        });

        // Check the 'unemployed' values to confirm correct conversion
        console.log("Processed 'unemployed' values:", data.map(d => d.unemployed));

        // Get the minimum and maximum 'unemployed' values for the domain
        var minUnemployed = d3.min(data, function(d) { return d.unemployed; });
        var maxUnemployed = d3.max(data, function(d) { return d.unemployed; });

        if (isNaN(minUnemployed) || isNaN(maxUnemployed)) {
            console.error("Invalid 'unemployed' data, unable to calculate min/max.");
            return;
        }

        // Example usage of the color scale
        data.forEach(function(d) {
            console.log(`Color for ${d.unemployed}: `, color(d.unemployed));
        });

    }).catch(function(error) {
        console.error("Error loading the CSV file:", error);
    });

    // Load GeoJSON data
    d3.json("LGA_VIC.json").then(function(json) {
        // Bind data and create one path per GeoJSON feature
        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", function(d, i) {
                return color(i % 10); // Fill with color based on index or property
            });

        // Load the city data and add circles for towns and cities
        d3.csv("VIC_city.csv").then(function(cityData) {
            // Create a separate group for the circles
            var circleGroup = svg.append("g");

            // Add circles for each city/town
            circleGroup.selectAll("circle")
                .data(cityData)
                .enter()
                .append("circle")
                .attr("cx", function(d) {
                    return projection([+d.lon, +d.lat])[0]; // Map longitude to x using projection
                })
                .attr("cy", function(d) {
                    return projection([+d.lon, +d.lat])[1]; // Map latitude to y using projection
                })
                .attr("r", 5) // Radius of the circle
                .attr("fill", "red") // Color of the circle
                .attr("stroke", "black") // Circle border color
                .attr("stroke-width", 1.5)
                .attr("opacity", 0.7) // Opacity for better visibility
                .on("mouseover",function(event,d){
                        tooltip.transition()
                                .duration(200)
                                .style("opacity", .9);
                        tooltip.html(d.place)
                                .style("left",(event.pageX+5)+"px")
                                .style("top",(event.pageY-28)+"px");
                      })
                .on("mouseout",function(d){
                
                          tooltip.transition()
                                  .duration(500)
                                  .style("opacity", 0);
                      })
        }).catch(function(error) {
            console.error("Error loading the city data:", error);
        });
    }).catch(function(error) {
        console.error("Error loading the GeoJSON data: ", error); // Error handling
    });
}

// Call the init function when the window loads
window.onload = init;