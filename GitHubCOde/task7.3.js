function init() {
    const dataset = [
        { apples: 5, oranges: 10, grapes: 22 },
        { apples: 4, oranges: 12, grapes: 28 },
        { apples: 2, oranges: 19, grapes: 32 },
        { apples: 7, oranges: 23, grapes: 35 },
        { apples: 23, oranges: 17, grapes: 43 }
    ];

    const width = 400;  // Adjusted width
    const height = 400; // Adjusted height
    const margin = { top: 20, right: 20, bottom: 50, left: 50 }; // Adjusted margins

    const svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const keys = ["apples", "oranges", "grapes"];

    // Step 2: Set up the stack
    const stack = d3.stack()
        .keys(keys);

    const series = stack(dataset);
    console.log("Stacked data:", series);  // Debugging: Check if the stack is created correctly

    // Step 3: Set up the scales
    const xScale = d3.scaleBand()
        .domain(d3.range(dataset.length))
        .range([0, width - margin.left - margin.right])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d.apples + d.oranges + d.grapes)])
        .nice()
        .range([height - margin.top - margin.bottom, 0]);

    const color = d3.scaleOrdinal()
        .domain(keys)
        .range(["#4CAF50", "#FF9800", "#2196F3"]); // Green, Orange, Blue colors

    // Step 4: Draw the rectangles
    svg.selectAll("g.layer")
        .data(series)
        .enter().append("g")
        .attr("class", "layer")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .enter().append("rect")
        .attr("x", (d, i) => xScale(i))
        .attr("y", d => yScale(d[1]))
        .attr("height", d => yScale(d[0]) - yScale(d[1]))
        .attr("width", xScale.bandwidth());

        const legend = svg.selectAll(".legend")
        .data(keys)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(0, ${i * 25})`); 

    legend.append("rect")
        .attr("x", 0)
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", color);

    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", "0.35em")
        .text(d => d);

    console.log("Chart rendered");

}
window.onload = init;