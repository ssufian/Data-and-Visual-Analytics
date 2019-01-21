            
            var w = 550;        //Set width of SVG
            var h = 550;        //Set height of SVG
            var xPadding = 50;  //Set padding for width
            var yPadding = 50;  //Set padding for height

            //Generating 50 random points
            var dataset = [];                                   //Initialize empty array
            for (var i = 0; i < 50; i++) {                      //Loop 50 times
                var xVal = Math.round(Math.random() * 100);     //New random x number (0-100)
                var yVal = Math.round(Math.random() * 100);     //New random y number (0-100)
                dataset.push([xVal , yVal]);                    //Add new x and y values to array
            }

            //Scaling circle radius
            var rScale = d3.scale.linear()
                                 .domain([d3.min(dataset, function(d){return d[0];}), d3.max(dataset, function(d) {return d[0];})])
                                 .range([1, 5]);

            //Scaling X axis
            var xScale = d3.scale.linear()
                                 .domain([0, d3.max(dataset, function(d) {return d[0];})])
                                 .range([xPadding, w - xPadding]);
            //Scaling Y axis
            var yScale = d3.scale.linear()
                                 .domain([0, d3.max(dataset, function(d) {return d[1];})])
                                 .range([h - yPadding, yPadding]);

            //Finding mean of radii
            var meanRScale = d3.mean(dataset, function(d) {return rScale(d[0])}); 

            //Creating X-Axis Line
            //Tick values show from 0 to 100 in intervals of 10. To 101 so that 100 shows up on the axis
            var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickValues(d3.range(0,101,10));

            //Creating Y-Axis Line
            var yAxis = d3.svg.axis().scale(yScale).orient("left").tickValues(d3.range(0,101,10));

            //Create SVG Element
            var svg = d3.select("body")
                        .append("svg")
                        .attr("width", w)
                        .attr("height", h)

            //Create Circles
            svg.selectAll("circle")
                        .data(dataset)
                        .enter()
                        .append("circle")
                        .attr("cx", function(d) {
                            return xScale(d[0]);
                        })
                        .attr("cy", function(d) {
                            return yScale(d[1]);
                        })
                        .attr("r", function(d)  {
                            return rScale(d[0]);        
                        })
                        .attr("fill", function(d){           
                            if (rScale(d[0]) > meanRScale){
                                return "blue";
                            } else {
                                return "green";
                            } 
                        });

            //Create X Axis
            svg.append("g")
               .attr("class", "axis")
               .attr("transform", "translate(0," + (h - xPadding) + ")")
               .call(xAxis);

            //Create Y Axis
            svg.append("g")
               .attr("class", "axis")
               .attr("transform", "translate(" + yPadding + ",0)")
               .call(yAxis);

            //Create label above the scatter plot with GT ID
            svg.append("text")
                .attr("x", (w/2))
                .attr("y", yPadding/2)
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .text("cgong42");