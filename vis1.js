(function autoexecute() {
  // VISUALIZATION 1 CODE
        // set the dimensions and margins of the graph
        var margin_1 = { top: 20, right: 20, bottom: 10, left: 60 },
            width_1 = 460,
            height_1 = 130;

        // load and format the data
        d3.csv("./Vis1_Data.csv",
            function (d) {
                //console.log("data", d);
                return { method: d.Method, "Same-sex": d.same_sex, "Large age difference": d.large_age_diff, "Interracial": d.interracial, "All": d.all }
            }).then(
                function (data) {
                    const smallMultiple = d3.select("#meet");

                    const meetColumns = ["All", "Same-sex", "Large age difference", "Interracial"]
                    meetColumns.forEach(coupleType => {
                        drawBarChartMeet(smallMultiple, coupleType, data, "Title");
                    })
                }
            )

        drawBarChartMeet = function (container, coupleType, data, chartTitle) {
            // append the svg object to the body of the page
            var svg = container.append("svg");
            svg.attr("width", width_1 + margin_1.left + margin_1.right)
            svg.attr("height", height_1 + margin_1.top + margin_1.bottom)

            svg.attr("height", height_1 + margin_1.top + margin_1.bottom + 70)
            svg.append("g")
                .attr("transform",
                    "translate(" + margin_1.left + "," + margin_1.top + ")");

                    
            // Add X axis
            const xScale = d3.scaleBand()
                .domain(data.map(d => d.method))
                .range([0, width_1])
                .padding(0.2);

            svg.append("g")
            .attr("transform", `translate(${margin_1.left}, ${height_1})`)
                .call(d3.axisBottom(xScale))
                .selectAll("text")
                .attr("y", 10)
                .attr("x", 9)
                .attr("dy", ".35em")
                .attr("transform", "rotate(30)")
                .style("text-anchor", "start");

            // Add Y axis
            const yScale = d3.scaleLinear()
                .domain([0, 0.35])
                .range([height_1, 20]);
                
            svg.append("g")
                .call(d3.axisLeft(yScale).ticks())
                .attr("transform", `translate(${margin_1.left}, ${0})`)

            // add small multiple title
            svg.append("text")
                .attr("x", width_1 / 2 + margin_1.left)
                .attr("y", 12)
                .attr("text-anchor", "middle")
                .text(coupleType);

            // Add bars 
            const barGroup = svg.append("g") // create a group to keep the bars
                .attr("class", "barGroup")
                .attr("transform", `translate(${margin_1.left}, ${0})`); // shift all bars by the margin offset


            // Add rectangles here by binding the totalPopDataEntries array with rect elements
            barGroup.selectAll("rect")
                .data(data)
                .join("rect")
                .attr("class", "path")
                .attr("class", d => d.method)
                .attr("x", d => xScale(d.method))
                .attr("fill", "#B3B1EF")
                .attr("y", d => yScale(d[coupleType]))
                .attr("width", xScale.bandwidth())
                .attr("height", d => height_1 - yScale(d[coupleType] + 20))
                .on("mouseover", function (event, d) {
                    svg.select("#tooltip-text").text(`${Math.round(d[coupleType] * 100) / 100}`);
                    let positionOffest = 8;
                    svg.select("#tooltip")
                        // move the tooltip to where the cursor is
                        .attr("transform", `translate(${xScale(d.method) + margin_1.left - 7}, ${yScale(d[coupleType]) - 10})`)
                        .style("display", "block");
                    d3.select(this)
                        .attr("stroke", "#333333")
                        .attr("stroke-width", 1);
                })
                .on("mouseout", function (event, d) {
                    svg.select("#tooltip").style("display", "none");
                    d3.select(this).attr("stroke", "none");
                })

            /****** Tooltip Code ******/
            const tooltipGroup = svg.append("g")
                .attr("id", "tooltip")
                .style("display", "none")
                .append("text")
                .attr("id", "tooltip-text")
                .attr("x", 5)
                .attr("y", 0)
                .attr("font-size", "12px")
                .attr("font-weight", "bold")
        }
      })();