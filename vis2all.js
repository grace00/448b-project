(function autoexecute() {
    var margin = {top: 20, right: 20, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#milestone")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom + 50)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
                
    // load and format the data
    d3.csv("./Vis2_Data.csv",
        function(d){
            // console.log(d);
            return { month : d3.timeParse("%b")(d.date), value : d.value, m : d.milestone, color : parseInt(d.color) }
    }).then(
        function(data) {
            const milestonedata = d3.group(data, d => d.m);
            console.log(milestonedata)

            // Add X axis
            const x = d3.scaleTime()
            .domain(d3.extent(data, d => d.month))
            .range([ 0, width ]);

            svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom()
                .tickFormat(d3.timeFormat("%b"))
                .scale(x))
            // Add Y axis
            const y = d3.scaleLinear()
            .domain( [0, 400.0])
            .range([ height, 35 ]);

            svg.append("g")
            .call(d3.axisLeft(y));

            // Add Graph title
            svg.append("text")
                .attr("x", (width / 2))             
                .attr("y", 0 - (margin.top / 2) + 10)
                .attr("text-anchor", "middle")  
                .style("font-size", "16px") 
                .style("text-decoration", "underline")  
                .text("All Couples");

            const color = d3.scaleOrdinal()
                .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

            // Add the lines
            svg
            .append("g")
            .selectAll(".line")
            .data(milestonedata)
            .join("path")
                .attr("fill", "none")
                .attr("opacity", function(d, key) {
                    if (key == 0) { 
                        return 1
                    } else { return 0.2}
                })
                .attr("stroke", function(d){ return color(d[0]) })
                .attr("stroke-width", 1)
                .attr("class", function(d){ 
                    return d[0]; 
                }) // assign ID
                .attr("d", function(d){
                    return d3.line()
                        .x(function(d) { return x(d.month); })
                        .y(function(d) { return y(+d.value); })(d[1])
                })

            // Add X axis label:
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("font-size", 15)
                .attr("x", width - 170)
                .attr("y", height + margin.top + 20)
                .text("Month");

            // Y axis label:
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("font-size", 15)
                .attr("y", -margin.left+15)
                .attr("x", -margin.top-130)
                .text("Frequency")

            const showTooltip = function(event, d) {
                tooltip
                .transition()
                .duration(200)
                tooltip
                .style("opacity", 1)
                .html("Freq: " + d.value)
                .style("left", (event.x)+10 + "px")
                .style("top", (event.y)+10 + "px")
            }

            const moveTooltip = function(event, d) {
                tooltip
                .style("left", (event.x)+10 + "px")
                .style("top", (event.y)+10 + "px")
            }

            const hideTooltip = function(event, d) {
                tooltip
                .transition()
                .duration(200)
                .style("opacity", 0)
            }
            
            // Add the points - working code below
            svg
            .append("g")
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
                .attr("cx", function(d) { return x(d.month) } )
                .attr("cy", function(d) { return y(d.value) } )
                .attr("r", 4)
                .attr("class", function(d) {
                    if (d.m === "Meet") {return "dotsMeet"}	
                    else if (d.m === "Begin") {return "dotsBegin"}
                    else if (d.m === "Live") {return "dotsLive"}
                    else if (d.m === "Marry") {return "dotsMarry"}
                    else { return "dotsSeparate" }
                })
                .attr("fill", function(d) {
                    if (d.m === "Meet") {return "red"}	
                    else if (d.m === "Begin") {return "blue"}
                    else if (d.m === "Live") {return "green"}
                    else if (d.m === "Marry") {return "purple"}
                    else { return "orange" } 			
                })
                .attr("opacity", function(d) {
                    if (d.m === "Meet") {
                        return 1
                    } else return 0.2
                })
            .on("mouseover", showTooltip)
            .on("mousemove", moveTooltip)
            .on("mouseout", hideTooltip)

            // create a tooltip div that is hidden by default:
            const tooltip = d3.select("#milestone")
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "black")
                .style("border-radius", "5px")
                .style("padding", "10px")
                .style("color", "white")
                .style("position", "absolute")

            // Add the legend
            var size = 20
            milestonedata.forEach( function(d,key) {
                // add legend rectangle
                d3.select("#mylegend")
                .append("rect")
                    .attr("x", 100)
                    .attr("y", 100 + d[0].color*(size+5)) // 100 is where the first dot appears. 25 is the distance between dots
                    .attr("width", size)
                    .attr("height", size)
                    .style("fill", function() {
                        if (key === "Meet") {
                            return color(key)
                        } else {
                            return "white"
                        }
                    })
                    .style("stroke", color(key))
                    .attr("class", "rects")
                    .style("stroke-width", 1)
                    .on("click", function(d){
                        // Get opacity value of current line
                        var curOpacityLine = d3.select("." + key).style('opacity');
                        var curOpacityDots = d3.select(".dots" + key).style('opacity');

                        // get decorationo of current legend element
                        var curDecor = d3.select(this).style('fill');
                        
                        var newDecor = "white";
                        if (curDecor === newDecor) {
                            newDecor = color(key);
                        }
                        d3.select(this).style("fill", newDecor);

                        // Toggle line visibility based on the ID
                        var newOpacityLine = 0.2
                        if (curOpacityLine == 0.2) {
                            newOpacityLine = 1
                        }
                        d3.selectAll("." + key)
                            .transition().duration(100) 
                            .style("opacity", newOpacityLine);
                        
                        // Toggle dots visibility 
                        var newOpacityDots = 0.2
                        if (curOpacityDots == 0.2) {
                            newOpacityDots = 1
                        }
                        d3.selectAll(".dots" + key)
                            .transition().duration(100) 
                            .style("opacity", newOpacityDots);
                    })

                // add legend text
                d3.select("#mylegend")
                .append("text")
                    .attr("x", 106 + size*1.2)
                    .attr("y", 100 + d[0].color*(size+5) + (size/2)) // 100 is where the first dot appears. 25 is the distance between dots
                    .style("fill", color(key))
                    .text(function() {
                        if (key === "Meet") {
                            return "First Met";
                        } else if (key === "Begin") {
                            return "Relat. Started"
                        } else if (key === "Live") {
                            return "Moved-in"
                        } else if (key === "Marry") {
                            return "Got Married"
                        } else if (key === "Separate") {
                            return "Separated"
                        }
                    })
                    .attr("text-anchor", "left")
                    .style("alignment-baseline", "middle")
                    .style("user-select", "none")
            });
        }
    )
})();