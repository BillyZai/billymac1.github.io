function init(){
    d3.csv("Task_2.4_data.csv").then(function(data){
        console.log(data);
        wombatSightings = data;

        barChart(wombatSightings);
    })

    var w = 500;
    var h = 130;
    var barPadding = 3;

    //D3 block
    var svg = d3.select("#chart")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

    function barChart(wombatSightings) {
        svg.selectAll("rect")
            .data(wombatSightings)
            .enter()
            .append("rect")
            .attr("x",function(d, i){
                return i * (w/wombatSightings.length);

            })
            .attr("y",function(d){
                return h - (d.wombats*4);
            })
            .attr("width",function(d){
                return (w/wombatSightings.length-barPadding);
            })
            .attr("height",function(d){
                return (d.wombats*4);
            })
            .attr("fill", function(d){
                return "rgb(135,206," + (d.wombats * 8) +")";
            });

        svg.selectAll("text")
            .data(wombatSightings)
            .enter()
            .append("text")
            .text(function(d){
                return d.wombats;

            })
            .attr("fill","black")
            .attr("x",function(d, i){
                return i * (w/wombatSightings.length) +10.5;
            })
            .attr("y",function(d){
                return h - (d.wombats *4)
            });

    }

}
window.onload = init;