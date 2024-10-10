var margin = {top: 20, right: 20, bottom: 20, left: 20};
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
        let data = d3.range(12).map(() => Math.floor(Math.random() * 100));

        // Set up scales
        var xScale = d3.scaleBand()
            .range([0, width])
            .padding(0.1);

        var yScale = d3.scaleLinear()
            .range([height, 0]);

        // Function to update the chart
        function updateChart(transitionType) {
            // Update data
            data = d3.range(12).map(() => Math.floor(Math.random() * 100));

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
                .duration(2000)
                .delay((d, i) => {
                    if (transitionType === 'staggered') {
                        return i * (1000 / data.length);
                    }
                    return 0;
                })
                .ease(transitionType === 'elastic' ? d3.easeElasticOut : d3.easeCubicInOut)
                .attr("x", (d, i) => xScale(i))
                .attr("y", d => yScale(d))
                .attr("width", xScale.bandwidth())
                .attr("height", d => height - yScale(d));

            bars.exit().remove();
        }

        // Initial chart render
        updateChart();

        // Add event listeners to buttons
        d3.select("#update").on("click", () => updateChart());
        d3.select("#transition1").on("click", () => updateChart('elastic'));
        d3.select("#transition2").on("click", () => updateChart('staggered'));

        window.onload = init;