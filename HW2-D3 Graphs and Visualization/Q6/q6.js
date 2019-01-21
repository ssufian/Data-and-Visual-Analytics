//Set dimensions
var margin = {top: 20, right: 20, bottom: 20, left: 20},
	width = 1000 - margin.left - margin.right,
	height = 600 - margin.top - margin.bottom;

//Ad svg to canvas
var svg = d3.select("#area1").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var path = d3.geo.path();

//Use queue to add multiple files at once
d3.queue()
	.defer(d3.json, "us.json")
	.defer(d3.csv, "median_ages.csv")
	.defer(d3.json, "median_earnings.json")
	.await(earning_calc);

//Pass data through the function
function earning_calc(error, us, ages, earnings){
	if (error) throw error;

	var med_agelist = {};
	var med_earnings = {};
	var max_earnings = [];

	//Created object of arrays. Keys are state id and arrays are different counties with median age. 
	ages.forEach(function (d) {
		med_agelist[+d.id] = [];
	});

	ages.forEach(function (d) {
		med_agelist[+d.id].push({"name" : d.name, "age" : +d.median_age});
	});

	//Sort the counties in each state by median age (ascending)
	for (var key in med_agelist) {
		med_agelist[key].sort(function(a,b){
			return a.age-b.age;
	})};

	//Create object for each state id (key) and median earnings (value) for map
	earnings.forEach(function (d){
		d.id = +d.id;
		d.median_earnings = +d.median_earnings;

		med_earnings[d.id] = +d.median_earnings;
		max_earnings.push(d.median_earnings);
	});

	//Create d3 tooltip
	var tip = d3.tip()
			.attr("class", "tooltip")
			.html(function(d) {
				var s = "";
				for (i = 0; i < Math.min(5,med_agelist[d.id].length); i++){   //min of 5 or less counties
					console.log(s);
					s += med_agelist[d.id][i]["name"] + " (Age: "+med_agelist[d.id][i]["age"] + ")" +"<br />";
				}

				return s;
			})
			.offset([150,200]);  //Offset the tooltip relative to calculated position [top, left]

	//Call tiptool on svg
	svg.call(tip);

	//On threshold scale, first color is from NaN to 0, so we only need 8 to create colors for our legend
	var colors = ['#e5f5f9','#ccece6','#99d8c9','#66c2a4','#41ae76','#238b45','#006d2c','#00441b'];

	//On threshold scale, last value is the max_earnings. In our legend it'll be 33,000 and up.
	var dom = [10000, 15000, 18000, 21000, 24000, 27000, 30000, 33000];

	//Threshold scale, with domain from 10,000 to 34,200, and range for 9 colors.
	var color = d3.scale.threshold()
			  .domain([10000, 15000, 18000, 21000, 24000, 27000, 30000, d3.max(max_earnings)])
			  .range(['#f7fcfd','#e5f5f9','#ccece6','#99d8c9','#66c2a4','#41ae76','#238b45','#006d2c','#00441b']);

	//Add the color values for states based on median earnings and also tiptool
	svg.append("g")
	   .attr("class", "states")
	   .selectAll("path")
	   .data(topojson.feature(us, us.objects.states).features)
	.enter().append("path")
	   .attr("d", path)
	   .style("fill", function(d) {
	   	return color(med_earnings[d.id]);})
	   .on("mouseover", tip.show)
	   .on("mouseout", tip.hide);

	//Add map of the U.S.
	svg.append("path")
	   .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !==b; }))
	   .attr("class", "states")
	   .attr("d", path);

	//Set coordinates for the legend and legend size
	var l_x = width + margin.left - 100,
		l_y = height/2.8 + margin.top,
		l_size = 20;

	//Append legend in svg
	var legend = svg.append("g")
					.attr("class", "legend");

	//Append legend color boxes
	var legend_box = legend.selectAll(".legend")
					.data(colors)
				   .enter().append("rect")
					.attr("x", l_x)
					.attr("y", function(d, i){ return l_y + (i * l_size);})
					.attr("width", l_size)
					.attr("height", l_size)
					.style("fill", function(d) { return d;})
					.style("stroke", "black")
					.style("stroke-width", 0.75);

	//Append legend text
	var legend_text = legend.selectAll("text").data(dom)
	    		   .enter().append("text")
	    			.attr("x", l_x + l_size+10)
	    			.attr("y", function(d, i) { return l_y + 14 + (i * l_size);})
	    			.text(function(d) {return "$"+d});

	//Append title of map
	var title = svg.append("text")
				  .attr("x", width/2.2 )
				  .attr("y", 20)
				  //.attr("text-anchor", "middle")
           		  .style("font-size", "24px")
                  .style("font-family", "sans-serif")
                  .text("Median Earnings by State");

}

	