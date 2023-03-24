(function autoexecute() {
    // VISUALIZATION 3 CODE
    // set the dimensions and margins of the graph
    const width3 = 450,
        height3 = 450,
        margin3 = 40;

    // The radius of the pieplot is half the 3 or half the height (smallest one). I subtract a bit of margin.
    const radius = Math.min(width3, height3) / 4 - margin3

    // PIE CHART 1 - HISPANIC
    // append the svg object to the div called 'visualization3'
    let svgHispanic = d3.select("#visualization3")
    .append("svg")
        .attr("class", "svgHispanic")
        .attr("width", width3)
        .attr("height", height3)
    .append("g")
        .attr("class", "svgHispanic")
        .attr("transform", `translate(${width3/2},${height3/2})`);

    // PIE CHART 2 - RACE
    // append the svg object to the div called 'visualization3'
    let svgRace = d3.select("#visualization3")
    .append("svg")
        .attr("class", "svgRace")
        .attr("width", width3)
        .attr("height", height3)
    .append("g")
        .attr("class", "svgRace")
        .attr("transform", `translate(${width3/2},${height3/2})`);  

    // BOXPLOT 1 - AGE WHEN MET
    // set the dimensions and margins of the graph
    var marginBox = {top: 10, right: 30, bottom: 30, left: 40},
    widthBox = 400 - marginBox.left - marginBox.right,
    heightBox = 400 - marginBox.top - marginBox.bottom;

    // append the svg object to the body of the page
    let svgBox = d3.select("#visualization3")
    .append("svg")
        .attr("class", "svgBox")
        .attr("width", widthBox + marginBox.left + marginBox.right)
        .attr("height", heightBox + marginBox.top + marginBox.bottom)
    .append("g")
        .attr("class", "svgBox")
        .attr("transform",
            "translate(" + marginBox.left + "," + marginBox.top + ")");

    // load and format the data
    d3.csv("./Vis3_Data.csv",
        function(d){
            // const permutation = d["permutation"]
            // const gender = d["gender"]
            // const hispanic = d["hispanic"]
            // const race = d["race"]
            // const sexualOrientation = d["sexual_orientation"]
            // const count = d["count"]
            // const pHispanic = d["Hispanic"]
            // const pNonHispanic = d["Non-Hispanic"]
            // const pWhite = d["White"]
            // const pIndian = d["American Indian, Aleut, or Eskimo"]
            // const pAsian = d["Asian or Pacific Islander"]
            // const pBlack = d["Black or African American"]
            // const pOther = d["Other"]
            // const ageWhenMet = d["agewhenmet"]
            // const timeFromMetToRel = d["timefrommettorel"]
            // const ageWhenMarry = d["agewhenmarry"]
            return [ d["permutation"], 
                { "Hispanic": d["Hispanic"], "Non-Hispanic": d["Non-Hispanic"] },
                { "White": d["White"], 
                    "American Indian/Aleut/Eskimo": d["American Indian, Aleut, or Eskimo"],
                    "Asian/Pacific Islander": d["Asian or Pacific Islander"],
                    "Black/African American": d["Black or African American"],
                    "Other": d["Other"],
                },
                d["agewhenmet"],
                d["agewhenmarry"],
            ];
    }).then(
        function(d) {
            d3.select("#submit-button").on("click", 
                function () {
                    if (!d) {
                        return;
                    }

                    d3.selectAll(".svgHispanic").remove();
                    d3.selectAll(".svgRace").remove();
                    d3.selectAll(".svgBox").remove();

                    // PIE CHART 1 - HISPANIC
                    // append the svg object to the div called 'visualization3'
                    let svgHispanic = d3.select("#visualization3")
                    .append("svg")
                        .attr("class", "svgHispanic")
                        .attr("width", width3)
                        .attr("height", height3)
                    .append("g")
                        .attr("class", "svgHispanic")
                        .attr("transform", `translate(${width3/2},${height3/2})`);

                    // PIE CHART 2 - RACE
                    // append the svg object to the div called 'visualization3'
                    let svgRace = d3.select("#visualization3")
                    .append("svg")
                        .attr("class", "svgRace")
                        .attr("width", width3)
                        .attr("height", height3)
                    .append("g")
                        .attr("class", "svgRace")
                        .attr("transform", `translate(${width3/2},${height3/2})`);  

                    // append the svg object to the body of the page
                    let svgBox = d3.select("#visualization3")
                    .append("svg")
                        .attr("class", "svgBox")
                        .attr("width", widthBox + marginBox.left + marginBox.right)
                        .attr("height", heightBox + marginBox.top + marginBox.bottom)
                    .append("g")
                        .attr("class", "svgBox")
                        .attr("transform",
                            "translate(" + marginBox.left + "," + marginBox.top + ")");

                    const selectedGender = document.getElementById("select-gender").value;
                    const selectedSexualOrientation = document.getElementById("select-sexualorientation").value;
                    const selectedHispanic = document.getElementById("select-hispanic").value;
                    const selectedRace = document.getElementById("select-race").value;
                    console.log("selected values");
                    console.log(selectedGender, selectedSexualOrientation, selectedHispanic, selectedRace);

                    let foundPermutation = d.find(entry => entry[0] === (selectedGender + "," + selectedHispanic + "," + selectedRace + "," + selectedSexualOrientation));
                    console.log("found permutation");
                    console.log(foundPermutation);

                    if (foundPermutation === undefined) {
                        svgHispanic.append("text")
                            .attr("x", 10)             
                            .attr("y", margin3.top)
                            .attr("text-anchor", "middle")  
                            .style("font-size", "16px") 
                            .text("Aw, we don't have enough data for this! We'll work on it...");
                        return;
                    }

                    // PIE CHART 1 - HISPANIC
                    // set the color scale
                    const color = d3.scaleOrdinal()
                    .domain(["Hispanic", "Non-Hispanic"])
                    .range(d3.schemeDark2);

                    // Compute the position of each group on the pie:
                    const pie = d3.pie()
                    .sort(null) // Do not sort group by size
                    .value(d => d[1])
                    const data_ready = pie(Object.entries(foundPermutation[1]))

                    // The arc generator
                    const arc = d3.arc()
                    .innerRadius(radius * 0.5)         // This is the size of the donut hole
                    .outerRadius(radius * 0.8)

                    // Another arc that won't be drawn. Just for labels positioning
                    const outerArc = d3.arc()
                    .innerRadius(radius * 0.9)
                    .outerRadius(radius * 0.9)

                    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
                    svgHispanic
                    .selectAll('allSlices')
                    .data(data_ready)
                    .join('path')
                    .attr('d', arc)
                    .attr('fill', d => color(d.data[1]))
                    .attr("stroke", "white")
                    .style("stroke-width", "2px")
                    .style("opacity", 0.7)

                    // Add the polylines between chart and labels:
                    svgHispanic
                    .selectAll('allPolylines')
                    .data(data_ready)
                    .join('polyline')
                        .attr("stroke", "black")
                        .style("fill", "none")
                        .attr("stroke-width", 1)
                        .attr('points', function(d) {
                        const posA = arc.centroid(d) // line insertion in the slice
                        const posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
                        const posC = outerArc.centroid(d); // Label position = almost the same as posB
                        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
                        posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
                        return [posA, posB, posC]
                        })

                    // Add the polylines between chart and labels:
                    svgHispanic
                    .selectAll('allLabels')
                    .data(data_ready)
                    .join('text')
                        .text(d => d.data[0])
                        .attr('transform', function(d) {
                            const pos = outerArc.centroid(d);
                            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                            pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                            return `translate(${pos})`;
                        })
                        .style('text-anchor', function(d) {
                            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                            return (midangle < Math.PI ? 'start' : 'end')
                        })
                        .style("font-size", "12px")

                    // PIE CHART 2 - RACE

                    // set the color scale
                    const colorRace = d3.scaleOrdinal()
                    .domain(["White", "American Indian/Aleut/Eskimo", "Asian/Pacific Islander", "Black/African American", "Other"])
                    .range(d3.schemeDark2);

                    // Compute the position of each group on the pie:
                    const pieRace = d3.pie()
                    .sort(null) // Do not sort group by size
                    .value(d => d[1])
                    const data_readyRace = pieRace(Object.entries(foundPermutation[2]))
                    console.log("data ready race", data_readyRace);

                    // The arc generator
                    const arcRace = d3.arc()
                    .innerRadius(radius * 0.5)         // This is the size of the donut hole
                    .outerRadius(radius * 0.8)

                    // Another arc that won't be drawn. Just for labels positioning
                    const outerArcRace = d3.arc()
                    .innerRadius(radius * 0.9)
                    .outerRadius(radius * 0.9)

                    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
                    svgRace
                    .selectAll('allSlicesRace')
                    .data(data_readyRace)
                    .join('path')
                    .attr('d', arcRace)
                    .attr('fill', d => colorRace(d.data[1]))
                    .attr("stroke", "white")
                    .style("stroke-width", "2px")
                    .style("opacity", 0.7)

                    // Add the polylines between chart and labels:
                    svgRace
                    .selectAll('allPolylinesRace')
                    .data(data_readyRace)
                    .join('polyline')
                        .attr("stroke", "black")
                        .style("fill", "none")
                        .attr("stroke-width", 1)
                        .attr('points', function(d) {
                        const posA = arcRace.centroid(d) // line insertion in the slice
                        const posB = outerArcRace.centroid(d) // line break: we use the other arc generator that has been built only for that
                        const posC = outerArcRace.centroid(d); // Label position = almost the same as posB
                        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
                        posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
                        return [posA, posB, posC]
                        })

                    // Add the polylines between chart and labels:
                    svgRace
                    .selectAll('allLabelsRace')
                    .data(data_readyRace)
                    .join('text')
                        .text(d => d.data[0])
                        .attr('transform', function(d) {
                            const pos = outerArcRace.centroid(d);
                            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                            pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                            return `translate(${pos})`;
                        })
                        .style('text-anchor', function(d) {
                            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                            return (midangle < Math.PI ? 'start' : 'end')
                        })
                        .style("font-size", "12px")

                    // BOXPLOT 1 - AGE WHEN MET
                    // Compute summary statistics used for the box:
                    var data = JSON.parse(foundPermutation[3])
                    var data_sorted = data.sort(d3.ascending)
                    var q1 = d3.quantile(data_sorted, .25)
                    var median = d3.quantile(data_sorted, .5)
                    var q3 = d3.quantile(data_sorted, .75)
                    var interQuantileRange = q3 - q1
                    var min = data_sorted[0]
                    var max = data_sorted[Object.keys(data_sorted).length-1]

                    // Compute summary statistics used for the box:
                    var dataMarry = JSON.parse(foundPermutation[4])
                    var data_sortedMarry = dataMarry.sort(d3.ascending)
                    var q1Marry = d3.quantile(data_sortedMarry, .25)
                    var medianMarry = d3.quantile(data_sortedMarry, .5)
                    var q3Marry = d3.quantile(data_sortedMarry, .75)
                    var interQuantileRangeMarry = q3Marry - q1Marry
                    var minMarry = data_sortedMarry[0]
                    var maxMarry = data_sortedMarry[Object.keys(data_sortedMarry).length-1]

                    // Show the Y scale
                    var y = d3.scaleLinear()
                    .domain([0,maxMarry+5])
                    .range([heightBox, 0]);
                    svgBox.call(d3.axisLeft(y))

                    // a few features for the box
                    var center = 100
                    var width = 80

                    // Show the main vertical line
                    svgBox
                    .append("line")
                    .attr("x1", center)
                    .attr("x2", center)
                    .attr("y1", y(min) )
                    .attr("y2", y(max) )
                    .attr("stroke", "black")

                    // Show the box
                    svgBox
                    .append("rect")
                    .attr("x", center - width/2)
                    .attr("y", y(q3) )
                    .attr("height", (y(q1)-y(q3)) )
                    .attr("width", width )
                    .attr("stroke", "black")
                    .style("fill", "#69b3a2")

                    // show median, min and max horizontal lines
                    svgBox
                    .selectAll("toto")
                    .data([min, median, max])
                    .enter()
                    .append("line")
                    .attr("x1", center-width/2)
                    .attr("x2", center+width/2)
                    .attr("y1", function(d){ return(y(d))} )
                    .attr("y2", function(d){ return(y(d))} )
                    .attr("stroke", "black")

                    // a few features for the box
                    var centerMarry = 220
                    var widthMarry = 80

                    // Show the main vertical line
                    svgBox
                    .append("line")
                    .attr("x1", centerMarry)
                    .attr("x2", centerMarry)
                    .attr("y1", y(minMarry) )
                    .attr("y2", y(maxMarry) )
                    .attr("stroke", "black")

                    // Show the box
                    svgBox
                    .append("rect")
                    .attr("x", centerMarry - widthMarry/2)
                    .attr("y", y(q3Marry) )
                    .attr("height", (y(q1Marry)-y(q3Marry)) )
                    .attr("width", widthMarry )
                    .attr("stroke", "black")
                    .style("fill", "#4682b4")

                    // show median, min and max horizontal lines
                    svgBox
                    .selectAll("toto")
                    .data([minMarry, medianMarry, maxMarry])
                    .enter()
                    .append("line")
                    .attr("x1", centerMarry-widthMarry/2)
                    .attr("x2", centerMarry+widthMarry/2)
                    .attr("y1", function(d){ return(y(d))} )
                    .attr("y2", function(d){ return(y(d))} )
                    .attr("stroke", "black")
                    }
            );
        }
    );
})();