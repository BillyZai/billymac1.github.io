function init() {
    const data = [45, 25, 20, 10, 6, 5]; 

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2; // Outer radius

    const svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);


    const pie = d3.pie()
        .sort(null)    
        .value(d => d); // Specify the value accessor function

    const arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(0);  // Inner radius for pie chart 

    const color = d3.scaleOrdinal(d3.schemeCategory10); // Using d3 native color scheme

    
    const arcs = svg.selectAll("arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc");

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => color(i));  

    arcs.append("text")
        .attr("transform", (d) => `translate(${arc.centroid(d)})`)
        .attr("class", "label")
        .text(d => d.data);

}
window.onload = init;
        