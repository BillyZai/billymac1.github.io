var margin = {top: 20, right: 20, bottom: 30, left: 40};
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
        let data = d3.range(10).map(() => Math.floor(Math.random() * 25));
        const maxValue = 25;

        // Set up scales
        var xScale = d3.scaleBand()
            .range([0, width])
            .padding(0.1);

        var yScale = d3.scaleLinear()
            .range([height, 0]);

        // Function to update the chart
        function updateChart() {
            // Update data
            data = d3.range(10).map(() => Math.floor(Math.random() * maxValue));

            // Update scales
            xScale.domain(d3.range(data.length));
            yScale.domain([0, d3.max(data)]);


            // Update bars
            var bars = svg.selectAll(".bar")
                .data(data);

            bars.enter()
                .append("rect")
                .attr("class", "bar")
                .merge(bars)
                .transition()
                .duration(1000)
                .attr("x", (d, i) => xScale(i))
                .attr("y", d => yScale(d))
                .attr("width", xScale.bandwidth())
                .attr("height", d => height - yScale(d));

            bars.exit().remove();
        }

        // Initial chart render
        updateChart();

        // Add event listener to update button
        d3.select("#update").on("click", updateChart);

        window.onload = init; 