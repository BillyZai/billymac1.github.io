var margin = {top: 20, right: 20, bottom: 20, left: 40};
        var width = 600 - margin.left - margin.right;
        var height = 400 - margin.top - margin.bottom;

        // Create SVG
        var svg = d3.select("#chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Initial data
        let data = d3.range(10).map(() => Math.floor(Math.random() * 100));

        // Set up scales
        var xScale = d3.scaleBand()
            .range([0, width])
            .padding(0.1);

        var yScale = d3.scaleLinear()
            .range([height, 0]);

        let sortOrder = 'ascending';

        function updateChart() {
            // Update scales
            xScale.domain(d3.range(data.length));
            yScale.domain([0, d3.max(data)]);

            // Bind data to bars
            var bars = svg.selectAll(".bar")
                .data(data);

            // Enter new bars
        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", width)
            .attr("y", d => yScale(d))
            .attr("height", d => height - yScale(d))
            .attr("fill", "slategrey")
            .merge(bars)
            .transition()
            .duration(1000)
            .attr("x", (d, i) => xScale(i))
            .attr("y", d => yScale(d))
            .attr("width", xScale.bandwidth())
            .attr("height", d => height - yScale(d))
            .on("end", function() {
            // Add mouse events after transition
            d3.select(this)
                .on("mouseover", handleMouseOver)
                .on("mouseout", handleMouseOut);
        });

    // Exit bars
        bars.exit()
            .transition()
            .duration(1000)
            .attr("x", width)
            .remove();
}

// Function to handle mouse over
    function handleMouseOver(event, d) {
    var bar = d3.select(this);
    
    bar.transition()
        .duration(200)
        .attr("fill", "orange");

    // Remove any existing tooltip
    svg.select(".tooltip").remove();

    // Add SVG tooltip
    svg.append("text")
        .attr("class", "tooltip")
        .attr("x", parseFloat(bar.attr("x")) + xScale.bandwidth() / 2)
        .attr("y", parseFloat(bar.attr("y")) - 5)
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .attr("fill", "black")
        .text(d);
}

// Function to handle mouse out
function handleMouseOut() {
    d3.select(this)
        .transition()
        .duration(200)
        .attr("fill", "slategrey");

    // Remove tooltip
    svg.select(".tooltip").remove();
}
function addValue() {
    var newValue = Math.floor(Math.random() * 100);
    data.push(newValue);
    updateChart();
}

// Function to remove a value
function removeValue() {
    if (data.length > 1) {
        data.shift();
        updateChart();
    }
}
function sortBars() {
    // Toggle sort order
    sortOrder = sortOrder === 'ascending' ? 'descending' : 'ascending';

    // Sort the data
    data.sort((a, b) => sortOrder === 'ascending' ? a - b : b - a);

    // Update x-scale domain
    xScale.domain(d3.range(data.length));

    // Select all bars and apply the transition
    svg.selectAll(".bar")
        .transition()
        .duration(1000)
        .attr("x", (d, i) => xScale(i));

    // Update the chart
    updateChart();
}

// Initial chart render
updateChart();

// Add event listeners to buttons
d3.select("#add").on("click", addValue);
d3.select("#remove").on("click", removeValue);
d3.select("#sort").on("click", sortBars);

window.onload = init;