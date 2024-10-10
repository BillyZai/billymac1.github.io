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
                .attr("x", width)  // Start position for enter
                .attr("y", d => yScale(d))
                .attr("height", d => height - yScale(d))
                .attr("fill", "steelblue")
                .merge(bars)  // Merge enter and update selections
                .transition()
                .duration(1000)
                .attr("x", (d, i) => xScale(i))
                .attr("y", d => yScale(d))
                .attr("width", xScale.bandwidth())
                .attr("height", d => height - yScale(d));

            // Exit bars
            bars.exit()
                .transition()
                .duration(1000)
                .attr("x", width)
                .remove();
        }

        // Function to add a value
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

        // Initial chart render
        updateChart();

        // Add event listeners to buttons
        d3.select("#add").on("click", addValue);
        d3.select("#remove").on("click", removeValue);

        window.onload = init;