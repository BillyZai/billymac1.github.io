function init() {
    var w = 600;
    var h = 300;
    var padding = 60;

    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    d3.csv("Task7.1.csv", function(d) {
        return {
            date: new Date(+d.year, +d.month - 1),
            number: +d.number
        };
    }).then(function(dataset) {
        console.table(dataset, ["date", "number"]);

        // Define scales inside the then() block
        var xScale = d3.scaleTime()
            .domain([
                d3.min(dataset, function(d) { return d.date; }),
                d3.max(dataset, function(d) { return d.date; })
            ])
            .range([padding, w - padding]);  // Adjusted to include padding

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(dataset, function(d) { return d.number; })])
            .range([h - padding, padding]);  // Flipped the range for correct orientation

        // Define area generator
        var area = d3.area()
            .x(function(d) { return xScale(d.date); })
            .y0(yScale(0))  // Sets the baseline to 0 (bottom of the chart)
            .y1(function(d) { return yScale(d.number); });

        // Append the area path element to the svg
        svg.append("path")
            .datum(dataset)
            .attr("class", "area")
            .attr("d", area)
            .attr("fill", "lightsteelblue")  // Fill color for area
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2);

        // Define and append x-axis
        var xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(10);

        svg.append("g")
            .attr("transform", "translate(0," + (h - padding) + ")")  // Move x-axis to the bottom
            .call(xAxis);

        // Define and append y-axis
        var yAxis = d3.axisLeft()
            .scale(yScale)
            .ticks(10);

        svg.append("g")
            .attr("transform", "translate(" + padding + ",0)")  // Move y-axis to the left
            .call(yAxis);

        // Adding x-axis label for "Year"
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", w / 2)
            .attr("y", h - 20)  // Position just below the x-axis
            .attr("font-size", "14px")
            .attr("fill", "black");
        // Adding y-axis label for "Number of Unemployed"
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", -h / 2)  // Position in the center of the y-axis
            .attr("y", 20)  // Position to the left of the y-axis
            .attr("font-size", "14px")
            .attr("fill", "black");

        // Draw horizontal line for 500,000 marker
        svg.append("line")
            .attr("class", "line halfMilMark")
            .attr("x1", padding)
            .attr("y1", yScale(500000))
            .attr("x2", w - padding)
            .attr("y2", yScale(500000))
            .attr("stroke", "red")
            .attr("stroke-dasharray", "4");

        // Add label for the horizontal marker
        svg.append("text")
            .attr("class", "halfMilLabel")
            .attr("x", padding + 10)
            .attr("y", yScale(500000) - 7)
            .attr("font-size", "12px")
            .attr("fill", "red")
            .text("Half a million unemployed");
    });
}
window.onload = init;
