function init() {
    const w = 500;
    const h = 300;
    
    const projection = d3.geoMercator()
        .center([145, -36.5])
        .translate([w/2, h/2])
        .scale(2450);

    const path = d3.geoPath()
        .projection(projection);
    
    const color = d3.scaleQuantize()
        .range(['rgb(242,240,247)','rgb(203,201,226)',
               'rgb(158,154,200)','rgb(117,107,177)',
               'rgb(84,39,143)']);

    const svg = d3.select("#MapOnpage")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    // Load both data files simultaneously
    Promise.all([
        d3.csv("VIC_LGA_unemployment.csv"),
        d3.json("LGA_VIC.json"),
        d3.csv("VIC_city.csv")
    ]).then(function([unemploymentData, geoData, cityData]) {
        // Set color domain based on unemployment data
        color.domain([
            d3.min(unemploymentData, d => +d.unemployed),
            d3.max(unemploymentData, d => +d.unemployed)
        ]);

        // Create a lookup object for faster data matching
        const unemploymentById = {};
        unemploymentData.forEach(d => {
            unemploymentById[d.LGA] = +d.unemployed;
        });

        // Merge unemployment data with GeoJSON
        geoData.features.forEach(feature => {
            feature.properties.value = unemploymentById[feature.properties.name] || 0;
        });

        // Draw map regions
        svg.selectAll("path")
            .data(geoData.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("fill", d => {
                const value = d.properties.value;
                return value ? color(value) : "#ccc";
            })
            .style("stroke", "#fff")
            .style("stroke-width", "0.5px");

        // Add cities
        svg.selectAll("circle")
            .data(cityData)
            .enter()
            .append("circle")
            .attr("cx", d => projection([d.lon, d.lat])[0])
            .attr("cy", d => projection([d.lon, d.lat])[1])
            .attr("r", 2)
            .style("fill", "red")
            .style("opacity", 0.75);
    }).catch(error => {
        console.error("Error loading the data:", error);
    });
}

window.onload = init;