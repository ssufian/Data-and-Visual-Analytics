var w = 800;        //Set width of SVG
var h = 600;        //Set height of SVG
var xPadding = 100;  //Set padding for width
var yPadding = 100;  //Set padding for height

//Create SVG Element. 5 for each different scatterplot.
var svg = d3.select("#area1")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

             //Create SVG Element
var svg1 = d3.select("#area2")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

var svg2 = d3.select("#area3")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

var svg3 = d3.select("#area4")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

var svg4 = d3.select("#area5")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

//load csv file
d3.csv("diabetes.csv", function(error, data){
    if (error) throw error;
    data.forEach(function(d){
        //d.pregnant_times = +d.pregnant_times;
        d.plasma_glucose = +d.plasma_glucose;
        d.blood_pressure = +d.blood_pressure;
        //d.skin_thickness = +d.skin_thickness;
        d.insulin = +d.insulin;
        d.bmi = +d.bmi;
        //d.pedigree = +d.pedigree;
        //d.age = +d.age;
        d.class = +d.class;
    }
)

//########## Plasma Glucose vs. Insulin #############

//Scaling X axis
var xScale = d3.scale.linear()
                     .domain([0, d3.max(data, function(d) {return d.plasma_glucose;})])
                     .range([xPadding, w - xPadding]).nice();
//Scaling Y axis
var yScale = d3.scale.linear()
                     .domain([0, d3.max(data, function(d) {return d.insulin;})])
                     .range([h - yPadding, yPadding]).nice();

//Creating X-Axis Line
var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(8);

//Creating Y-Axis Line
var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(8);


//Creating data points. Blue circles for negative and red triangles for positive test for diabetes.
svg.selectAll(".point")
    .data(data)
  .enter().append("path")
          .attr("d", d3.svg.symbol().size(40).type(function (d){
            return d.class == 0 ? "circle" : "triangle-up";
            }
          ))
          .attr("transform", function(d) {
            return "translate(" + xScale([d.plasma_glucose]) + "," + yScale([d.insulin]) + ")"; 
          })
          .attr("fill", "transparent")
          .style("stroke", function(d){
            return d.class == 0 ? "blue" : "red";
          });

//Create X Axis
svg.append("g")
   .attr("class", "axis")
   .attr("transform", "translate(0," + (h - xPadding) + ")")
   .call(xAxis)
   .append("text")
    .attr("x", w-xPadding)
    .attr("y", -15)
    .style("text-anchor", "end")
    .text("Plasma Glucose")
    .style("font-size", "12px");
  

//Create Y Axis
svg.append("g")
   .attr("class", "axis")
   .attr("transform", "translate(" + yPadding + ",0)")
   .call(yAxis)
   .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -xPadding)
    .attr("y", 18)
    .style("text-anchor", "end")
    .text("Insulin")
    .style("font-size", "12px");

//Create title for scatterplot name
svg.append("text")
    .attr("x", (w/2))
    .attr("y", yPadding/2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-family", "sans-serif")
    .text("Plasma Glucose vs. Insulin");

//Create legends
//Negative blue circles
svg.append("text")
    .attr("x", w-40)
    .attr("y", yPadding)
    .style("font-size", "10px")
    .style("font-family", "sans-serif")
    .text("Negative");

svg.append("path")
    .attr("d", d3.svg.symbol().size(40).type("circle"))
    .attr("transform", "translate(" + (w - 50) + "," + (yPadding-4) + ")")
    .attr("fill", "transparent")
    .style("stroke", "blue");  

//Positive red triangles
svg.append("text")
    .attr("x", w-40)
    .attr("y", yPadding+15)
    .style("font-size", "10px")
    .style("font-family", "sans-serif")
    .text("Positive");

svg.append("path")
    .attr("d", d3.svg.symbol().size(40).type("triangle-up"))
    .attr("transform", "translate(" + (w - 50) + "," + (yPadding+11) + ")")
    .attr("fill", "transparent")
    .style("stroke", "red");          

//########## BMI vs. Blood Pressure ##############


//Scaling X axis
var xScale1 = d3.scale.linear()
                     .domain([0, d3.max(data, function(d) {return d.bmi;})])
                     .range([xPadding, w - xPadding]).nice();
//Scaling Y axis
var yScale1 = d3.scale.linear()
                     .domain([0, d3.max(data, function(d) {return d.blood_pressure;})])
                     .range([h - yPadding, yPadding]).nice();

//Creating X-Axis Line
var xAxis1 = d3.svg.axis().scale(xScale1).orient("bottom").ticks(8);

//Creating Y-Axis Line
var yAxis1 = d3.svg.axis().scale(yScale1).orient("left").ticks(8);


//Creating data points
svg1.selectAll(".point")
    .data(data)
  .enter().append("path")
          .attr("d", d3.svg.symbol().size(40).type(function (d){
            return d.class == 0 ? "circle" : "triangle-up";
            }
          ))
          .attr("transform", function(d) {
            return "translate(" + xScale1([d.bmi]) + "," + yScale1([d.blood_pressure]) + ")"; 
          })
          .attr("fill", "transparent")
          .style("stroke", function(d){
            return d.class == 0 ? "blue" : "red";
          });

//Create X Axis
svg1.append("g")
   .attr("class", "axis")
   .attr("transform", "translate(0," + (h - xPadding) + ")")
   .call(xAxis1)
   .append("text")
    .attr("x", w-xPadding)
    .attr("y", -15)
    .style("text-anchor", "end")
    .text("BMI")
    .style("font-size", "12px");
  

//Create Y Axis
svg1.append("g")
   .attr("class", "axis")
   .attr("transform", "translate(" + yPadding + ",0)")
   .call(yAxis1)
   .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -xPadding)
    .attr("y", 18)
    .style("text-anchor", "end")
    .text("Blood Pressure")
    .style("font-size", "12px");

//Create title for scatterplot name
svg1.append("text")
    .attr("x", (w/2))
    .attr("y", yPadding/2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-family", "sans-serif")
    .text("BMI vs. Blood Pressure");

//Create legends

//Negative blue circles
svg1.append("text")
    .attr("x", w-40)
    .attr("y", yPadding)
    .style("font-size", "10px")
    .style("font-family", "sans-serif")
    .text("Negative");

svg1.append("path")
    .attr("d", d3.svg.symbol().size(40).type("circle"))
    .attr("transform", "translate(" + (w - 50) + "," + (yPadding-4) + ")")
    .attr("fill", "transparent")
    .style("stroke", "blue");  

//Positive red triangles
svg1.append("text")
    .attr("x", w-40)
    .attr("y", yPadding+15)
    .style("font-size", "10px")
    .style("font-family", "sans-serif")
    .text("Positive");

svg1.append("path")
    .attr("d", d3.svg.symbol().size(40).type("triangle-up"))
    .attr("transform", "translate(" + (w - 50) + "," + (yPadding+11) + ")")
    .attr("fill", "transparent")
    .style("stroke", "red");          


//########## Q3.b ##########################

 //Scaling X axis
var xScale2 = d3.scale.linear()
                     .domain([0, d3.max(data, function(d) {return d.plasma_glucose;})])
                     .range([xPadding, w - xPadding]).nice();
//Scaling Y axis
var yScale2 = d3.scale.linear()
                     .domain([0, d3.max(data, function(d) {return d.insulin;})])
                     .range([h - yPadding, yPadding]).nice();

//Creating X-Axis Line
var xAxis2 = d3.svg.axis().scale(xScale2).orient("bottom").ticks(8);

//Creating Y-Axis Line
var yAxis2 = d3.svg.axis().scale(yScale2).orient("left").ticks(8);

//Creating scale for size proportional to the product of plasma and insulin values
var sizeS = d3.scale.linear()
                   .domain([d3.min(data, function(d) {return (d.plasma_glucose*d.insulin)}), 

                            d3.max(data, function(d) {return (d.plasma_glucose*d.insulin)})])
                   .range([10,100]);

//Creating data points
svg2.selectAll(".point")
    .data(data)
  .enter().append("path")
          .attr("d", d3.svg.symbol().size(function(d){return sizeS(d.plasma_glucose*d.insulin)}).type(function (d){
            return d.class == 0 ? "circle" : "triangle-up";
            }
          ))
          .attr("transform", function(d) {
            return "translate(" + xScale2([d.plasma_glucose]) + "," + yScale2([d.insulin]) + ")"; 
          })
          .attr("fill", "transparent")
          .style("stroke", function(d){
            return d.class == 0 ? "blue" : "red";
          });

//Create X Axis
svg2.append("g")
   .attr("class", "axis")
   .attr("transform", "translate(0," + (h - xPadding) + ")")
   .call(xAxis2)
   .append("text")
    .attr("x", w-xPadding)
    .attr("y", -15)
    .style("text-anchor", "end")
    .text("Plasma Glucose")
    .style("font-size", "12px");
  

//Create Y Axis
svg2.append("g")
   .attr("class", "axis")
   .attr("transform", "translate(" + yPadding + ",0)")
   .call(yAxis2)
   .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -xPadding)
    .attr("y", 18)
    .style("text-anchor", "end")
    .text("Insulin")
    .style("font-size", "12px");

//Create title for scatterplot name
svg2.append("text")
    .attr("x", (w/2))
    .attr("y", yPadding/2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-family", "sans-serif")
    .text("Plasma Glucose vs. Insulin (scaled symbols)");

//Create legend

//Negative blue circles
svg2.append("text")
    .attr("x", w-40)
    .attr("y", yPadding)
    .style("font-size", "10px")
    .style("font-family", "sans-serif")
    .text("Negative");

svg2.append("path")
    .attr("d", d3.svg.symbol().size(40).type("circle"))
    .attr("transform", "translate(" + (w - 50) + "," + (yPadding-4) + ")")
    .attr("fill", "transparent")
    .style("stroke", "blue");  

//Positive red triangles
svg2.append("text")
    .attr("x", w-40)
    .attr("y", yPadding+15)
    .style("font-size", "10px")
    .style("font-family", "sans-serif")
    .text("Positive");

svg2.append("path")
    .attr("d", d3.svg.symbol().size(40).type("triangle-up"))
    .attr("transform", "translate(" + (w - 50) + "," + (yPadding+11) + ")")
    .attr("fill", "transparent")
    .style("stroke", "red");          
//########## Q3(c)i #######################

//Scaling X axis
var xScale3 = d3.scale.linear()
                     .domain([0, d3.max(data, function(d) {return d.plasma_glucose;})])
                     .range([xPadding, w - xPadding]).nice();

//Scaling Y axis. Square Root Scale.
var yScale3 = d3.scale.sqrt()
                     .domain([0, d3.max(data, function(d) {return d.insulin;})])
                     .range([h - yPadding, yPadding]).nice();

//Creating X-Axis Line
var xAxis3 = d3.svg.axis().scale(xScale3).orient("bottom").ticks(8);

//Creating Y-Axis Line
var yAxis3 = d3.svg.axis().scale(yScale3).orient("left").ticks(8);


//Create data points
svg3.selectAll(".point")
    .data(data)
  .enter().append("path")
          .attr("d", d3.svg.symbol().size(40).type(function (d){
            return d.class == 0 ? "circle" : "triangle-up";
            }
          ))
          .attr("transform", function(d) {
            return "translate(" + xScale3([d.plasma_glucose]) + "," + yScale3([d.insulin]) + ")"; 
          })
          .attr("fill", "transparent")
          .style("stroke", function(d){
            return d.class == 0 ? "blue" : "red";
          });

//Create X Axis
svg3.append("g")
   .attr("class", "axis")
   .attr("transform", "translate(0," + (h - xPadding) + ")")
   .call(xAxis3)
   .append("text")
    .attr("x", w-xPadding)
    .attr("y", -15)
    .style("text-anchor", "end")
    .text("Plasma Glucose")
    .style("font-size", "12px");
  

//Create Y Axis
svg3.append("g")
   .attr("class", "axis")
   .attr("transform", "translate(" + yPadding + ",0)")
   .call(yAxis3)
   .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -xPadding)
    .attr("y", 18)
    .style("text-anchor", "end")
    .text("Insulin")
    .style("font-size", "12px");

//Create title for scatterplot name
svg3.append("text")
    .attr("x", (w/2))
    .attr("y", yPadding/2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-family", "sans-serif")
    .text("Plasma Glucose vs. Insulin (square-root-scaled)");

//Create legend

//Negative blue circles
svg3.append("text")
    .attr("x", w-40)
    .attr("y", yPadding)
    .style("font-size", "10px")
    .style("font-family", "sans-serif")
    .text("Negative");

svg3.append("path")
    .attr("d", d3.svg.symbol().size(40).type("circle"))
    .attr("transform", "translate(" + (w - 50) + "," + (yPadding-4) + ")")
    .attr("fill", "transparent")
    .style("stroke", "blue");  

//Positive red triangles
svg3.append("text")
    .attr("x", w-40)
    .attr("y", yPadding+15)
    .style("font-size", "10px")
    .style("font-family", "sans-serif")
    .text("Positive");

svg3.append("path")
    .attr("d", d3.svg.symbol().size(40).type("triangle-up"))
    .attr("transform", "translate(" + (w - 50) + "," + (yPadding+11) + ")")
    .attr("fill", "transparent")
    .style("stroke", "red");       

//########## Q3(c)ii ###############

//Scale X-axis
var xScale4 = d3.scale.linear()
                     .domain([0, d3.max(data, function(d) {return d.plasma_glucose;})])
                     .range([xPadding, w - xPadding])
                     .nice();

//Scale Y-axis. Log scale. Min domain set to 0.01 since 0 isn't allowed.
var yScale4 = d3.scale.log()
                     .domain([0.01, d3.max(data, function(d) {return d.insulin;})])
                     .range([h - yPadding, yPadding])
                     .nice();

//Creating X-Axis Line
var xAxis4 = d3.svg.axis().scale(xScale4).orient("bottom").ticks(8);

//Creating Y-Axis Line
var yAxis4 = d3.svg.axis().scale(yScale4).orient("left").ticks(8);


//Create data points and filter out insulin values less than 0 so log(0) isn't undefined.
svg4.selectAll(".point")
    .data(data)
  .enter().append("path")
  .filter(function(d) { return d.insulin > 0;})
          .attr("d", d3.svg.symbol().size(40).type(function (d){
            return d.class == 0 ? "circle" : "triangle-up";
            }
          ))
          .attr("transform", function(d) {
            return "translate(" + xScale4([d.plasma_glucose]) + "," + yScale4([d.insulin]) + ")"; 
          })
          .attr("fill", "transparent")
          .style("stroke", function(d){
            return d.class == 0 ? "blue" : "red";
          });

//Create X Axis
svg4.append("g")
   .attr("class", "axis")
   .attr("transform", "translate(0," + (h - xPadding) + ")")
   .call(xAxis4)
   .append("text")
    .attr("x", w-xPadding)
    .attr("y", -15)
    .style("text-anchor", "end")
    .text("Plasma Glucose")
    .style("font-size", "12px");
  

//Create Y Axis
svg4.append("g")
   .attr("class", "axis")
   .attr("transform", "translate(" + yPadding + ",0)")
   .call(yAxis4)
   .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -xPadding)
    .attr("y", 18)
    .style("text-anchor", "end")
    .text("Insulin")
    .style("font-size", "12px");

//Create title for scatterplot name
svg4.append("text")
    .attr("x", (w/2))
    .attr("y", yPadding/2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-family", "sans-serif")
    .text("Plasma Glucose vs. Insulin (log-scaled)");

//Create legend

//Negative blue circles
svg4.append("text")
    .attr("x", w-40)
    .attr("y", yPadding)
    .style("font-size", "10px")
    .style("font-family", "sans-serif")
    .text("Negative");

svg4.append("path")
    .attr("d", d3.svg.symbol().size(40).type("circle"))
    .attr("transform", "translate(" + (w - 50) + "," + (yPadding-4) + ")")
    .attr("fill", "transparent")
    .style("stroke", "blue");  

//Positive red triangles
svg4.append("text")
    .attr("x", w-40)
    .attr("y", yPadding+15)
    .style("font-size", "10px")
    .style("font-family", "sans-serif")
    .text("Positive");

svg4.append("path")
    .attr("d", d3.svg.symbol().size(40).type("triangle-up"))
    .attr("transform", "translate(" + (w - 50) + "," + (yPadding+11) + ")")
    .attr("fill", "transparent")
    .style("stroke", "red");      	

});

