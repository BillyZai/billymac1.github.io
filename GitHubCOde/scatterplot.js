        var w = 500;
        var h = 300;  
        var padding = 60;

        var dataset = [
            [2, 8],
            [3, 5],
            [5, 17],
            [6, 6],
            [6, 12],
            [7, 20],
            [8, 22],
            [10, 11],
            [5, 12],
            [6, 16]  
        ];

       
        var xScale = d3.scaleLinear()
                       .domain([0, d3.max(dataset, function(d) { return d[0]; })])
                       .range([padding, w - padding]);

        var yScale = d3.scaleLinear()
                       .domain([0, d3.max(dataset, function(d) { return d[1]; })])
                       .range([h - padding, padding]);  // Flipping the range to have low Y values at the bottom

        var svg = d3.select("body")
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h);

      
        svg.selectAll("circle")
           .data(dataset)
           .enter()
           .append("circle")
           .attr("cx", function(d) { return xScale(d[0]); })
           .attr("cy", function(d) { return yScale(d[1]); })
           .attr("r", 5)
           .attr("fill", function(d) { return d[0] == 500 ? "red" : "slategrey"; });  // Highlight the last data point in red

        
        svg.selectAll("text")
           .data(dataset)
           .enter()
           .append("text")
           .text(function(d) { return d[0] + "," + d[1]; })
           .attr("x", function(d) { return xScale(d[0]) + 10; })  // Position label to the right of the circle
           .attr("y", function(d) { return yScale(d[1]); })
           .attr("fill", "green");

        
        var xAxis = d3.axisBottom()
                      .scale(xScale)
                      .ticks(10);

        var yAxis = d3.axisLeft()
                    .scale(yScale)
                    .ticks(5);

        svg.append("g")
           .attr("transform", "translate(0," + (h - padding) + ")")
           .call(xAxis);

           svg.append("g")
           .attr("transform", "translate(" + padding + ",0)")
           .call(yAxis);

           svg.append("text")
           .attr("text-anchor", "middle")
           .attr("x", w / 2)
           .attr("y", h - 10)  // Position just below the x-axis
           .attr("font-size", "14px")
           .attr("fill", "black")
           .text("Tree Age (year)");
        
        // Adding y-axis label
        svg.append("text")
           .attr("text-anchor", "middle")
           .attr("transform", "rotate(-90)")  
           .attr("x", -h / 2)  
           .attr("y", 20)  // Position to the left of the y-axis
           .attr("font-size", "14px")
           .attr("fill", "black")
           .text("Tree Height (m)");