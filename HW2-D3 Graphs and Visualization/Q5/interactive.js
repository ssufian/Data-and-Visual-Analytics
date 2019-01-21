//Add data directly into array
var data = [{club:'Manchester United',value:{year_2013:3165, year_2014:2810, year_2015:3100, year_2016:3317, year_2017:4583}},
			{club:'Chelsea',value:{year_2013:901, year_2014:868, year_2015:1370, year_2016:1661, year_2017:1845}},
			{club:'Manchester City',value:{year_2013:689, year_2014:863, year_2015:1380, year_2016:1921, year_2017:2083}},
			{club:'Liverpool',value:{year_2013:651, year_2014:704, year_2015:982, year_2016:1548, year_2017:1492}},
			{club:'Arsenal',value:{year_2013:1326, year_2014:1331, year_2015:1310, year_2016:2017, year_2017:1932}}]

//Create array of objects that sum the values across the years for each club
var data_sum = []

	data.forEach(function (d){
		d.club = d.club;
		d.val = +d.value.year_2013+d.value.year_2014+d.value.year_2015+d.value.year_2016+d.value.year_2017;
	data_sum.push({"club": d.club, "value": d.val})
	});

//Define borders and dimensions
var margin = {top: 50, right: 50, bottom: 50, left: 150},
	width = 800 - margin.left - margin.right,
	height = 400 - margin.top - margin.bottom;

//Append svg to canvas
var svg = d3.select("#area1").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Scale X
var x = d3.scale.linear()
		  .range([0, width])
		  .domain([0, d3.max(data_sum, function(d){
		  	return d.value;
		  })]);

//Scale Y ordinal because of names
var y = d3.scale.ordinal()
		  .domain(data_sum.map(function(d){
		  	return d.club;
		  }))
		  .rangeRoundBands([0, height], .2);

//Make y axis to show bar names
var yAxis = d3.svg.axis().scale(y).tickSize(0).orient("left");

var gy = svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)

//Create bars. On mouseover bar fill with grey and show line chart. On mouseout reset to default color and hide line chart by removing it.
var bars = svg.selectAll(".bar")
			.data(data_sum)
			.enter()
			.append("g");

	bars.append("rect")
		.attr("class", "bar")
		.attr("y", function (d) {
			return y(d.club);
		})
		.attr("height", y.rangeBand())
		.attr("x", 0)
		.attr("width", function (d){
			return x(d.value);
		})
		.attr("fill", "#196486")   
		.on("mouseover", function(d){
			d3.select(this).attr("fill","grey");
			data.forEach(function(i){
				if(i.club == d.club){
					//passes i as a parameter to line function. i includes value of club for each year. It's our original data.
					return line(i);
				}
			});


		})
		.on("mouseout", function(d){
			d3.select(this).attr("fill", "#196486");
			d3.select("#area2").selectAll("*").remove();
		});

	//Add value labels to the bar graph with position x just to the right of bar beginning
	bars.append("text")
		.attr("class", "label")
		.attr("y", function (d){
			return y(d.club) + y.rangeBand()/2 + 4;
		})
		.attr("x", 10)
		.text(function (d) {
			return "$"+d.value;
		});

//Function that passes the selected object value for the club on mouseover 

function line(club){

//Retreive value of club per year from parameter that's passed
var y_13 = club["value"]["year_2013"];
var y_14 = club["value"]["year_2014"];
var y_15 = club["value"]["year_2015"];
var y_16 = club["value"]["year_2016"];
var y_17 = club["value"]["year_2017"];

//Array for the value of that club for each year
var years = [y_13, y_14, y_15, y_16, y_17];

var data1 = []
var step;
var year = 2013;

//Create array of objects that contain each year and value of that club for that year
for (step = 0; step < 5; step++){
	data1.push({"Year": new Date(year,0), "Value": years[step]});
 	year++;
 }

//Set dimensions
var margin = {top: 30, right: 20, bottom: 50, left: 50},
	width = 260 - margin.left - margin.right,
	height = 230 - margin.top - margin.bottom;

//Add svg1, the line chart
var svg1 = d3.select("#area2")
			 .append("svg")
			 .attr("width", width + margin.left + margin.right)
			 .attr("height", height + margin.top + margin.bottom)
				 .append("g")
			 .attr("transform","translate(" + margin.left + "," + margin.top + ")");

//Set the scales

//Time scale for the years
var x = d3.time.scale().domain(d3.extent(data1, function(d) { return d.Year; })).range([0, width]).nice();

var y = d3.scale.linear().domain([d3.min(data1, function(d){ return d.Value; }), 
								  d3.max(data1, function(d){ return d.Value; })])
									.range([height,0]).nice();

//Define the axes
//Time axis displays year only once. One time a year.
var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(d3.time.years, 1).tickFormat(d3.time.format("%Y"));

var yAxis = d3.svg.axis().scale(y).orient("left").ticks(4);

//Create values for the line
var valueline = d3.svg.line()
				  .x(function(d) { 
				  	return x(d.Year);})
				  .y(function(d) { return y(d.Value);});

//Draw the line
svg1.append("path")
   .attr("class", "line")
   .attr("d", valueline(data1));

//Add x-axis for line chart
svg1.append("g")
.attr("class", "x axis")
.attr("transform", "translate(0," + height + ")")
.call(xAxis)
.append("text")
.attr("x", width+10)
.attr("y", height/3)
.style("text-anchor", "end")
.text("Year");

//Add y-axis for line chart
svg1.append("g")
.attr("class", "y axis")
.call(yAxis)
.append("text")
.attr("x", -5)
.attr("y", -15)
.style("text-anchor", "end")
.text("Value");

}
