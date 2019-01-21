//**Citation** Followed example from: http://bl.ocks.org/tjdecke/5558084

//Set dimensions for heatmap
var margin = {top: 20, right: 90, bottom: 100, left: 100},
	width = 800 - margin.left - margin.right,
	height = 600 - margin.top - margin.bottom;

//Create arrays for default colors, houses, episodes, and seasons
var colors = ['#ffffd9','#edf8b1','#c7e9b4','#7fcdbb','#41b6c4','#1d91c0','#225ea8','#253494','#081d58'],
	houses = ["Baratheon", "Greyjoy", "Lannister", "Martell", "Stark", "Targaryen", "Tyrell"],
	episodes = ["1", "2", "3", "4", "5", "6", "7", "8", "9","10"],
	seasons = [1, 2, 3, 4, 5, 6];

//Set gridsize relative to width and 
var gridSize = Math.floor(width/10),
	legendElementWidth = gridSize/1.25,
	bucket = 9;

//Append svg to div area1
var svg = d3.select("#area1").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Add house labels along vertical axis
var houseLabels = svg.selectAll(".houseLabels")
					 .data(houses)
					 .enter().append("text")
					 .text(function (d) { return d; })
					 .attr("x", 0)
					 .attr("y", function (d, i) { return i * gridSize; })
        			 .style("text-anchor", "end")
       				 .attr("transform", "translate(-6," + gridSize / 1.5 + ")");

//Add episode labels along horizontal axis
var epLabels = svg.selectAll(".epLabels")
				  .data(episodes)
				  .enter().append("text")
				  .text(function(d) { return d; })
    			  .attr("x", function(d, i) { return i * gridSize; })
      			  .attr("y", 8 * gridSize - 30)
      			  .style("text-anchor", "middle")
        		  .attr("transform", "translate(" + gridSize / 2 + ", -6)");

//Add title label for vertical axis
var houseTitle = svg.append("text")
					.text("House")
					.attr("x", -6)
					.attr("y", 0)
        			.style("text-anchor", "end")
        			.style("font-weight", "bold")
        			.style("font-size", "16px");

//Add title label for horizontal axis       			
var epTitle = svg.append("text")
				 .text("Episode")
				 .attr("x", 11 * gridSize)
				 .attr("y", 8 * gridSize - 36)
				 .style("text-anchor", "end")
				 .style("font-weight", "bold")
				 .style("font-size", "16px");

//Add dropdown box text
var dropdown = d3.select("#area2")
			  .append("text")
			  .text("Season : ")

//Add dropdown box and perform function onchange when change
var select = d3.select("#area2")
				.append("select")
				.attr("class", "select")
				.on("change", onchange);

//Add Options for dropdown box
var options = select
				.selectAll("option")
 				.data(seasons).enter()
 				.append("option")
 				.text(function (d) { return d; });

//When dropdown box value is selected, runs newSelection function with selected value as a parameter
function onchange() {
 	selectValue = d3.select('select').property('value')
 	newSelection(selectValue);
    }

//Set default dropdown box selection to season 1    	
newSelection(1);   

//When dropdown box value is selected, the newSelection function takes the season value as a parameter and creates objects of data from heatmap.csv where d.season equals season selected. Data for selected season is displayed on the heatmap.
function newSelection(a){
d3.csv("heatmap.csv", function(error, buckets){
	if (error) throw error;

	//Create array to store long data objects
	var long_data = [];

	//Change data to integers
	buckets.forEach(function(d) {
		d.Baratheon = +d.Baratheon || 0;
		d.Greyjoy = +d.Greyjoy || 0;
		d.Lannister = +d.Lannister || 0;
		d.Martell = +d.Martell || 0;
		d.Stark = +d.Stark || 0;
		d.Targaryen = +d.Targaryen || 0;
		d.Tyrell = +d.Tyrell || 0;
		d.episode = +d.episode;
		d.season = +d.season;

		//Change data from wide data to long data
		if (d.season == a){
		long_data.push({"House": "Baratheon", "id": 1, "Value": d.Baratheon, "Episode": d.episode, "Season": d.season})
		long_data.push({"House": "Greyjoy", "id": 2, "Value": d.Greyjoy, "Episode": d.episode, "Season": d.season})
		long_data.push({"House": "Lannister", "id": 3, "Value": d.Lannister, "Episode": d.episode, "Season": d.season})
		long_data.push({"House": "Martell", "id": 4, "Value": d.Martell, "Episode": d.episode, "Season": d.season})
		long_data.push({"House": "Stark", "id": 5, "Value": d.Stark, "Episode": d.episode, "Season": d.season})
		long_data.push({"House": "Targaryen", "id": 6, "Value": d.Targaryen, "Episode": d.episode, "Season": d.season})
		long_data.push({"House": "Tyrell", "id": 7, "Value": d.Tyrell, "Episode": d.episode, "Season": d.season})
	    }
	});

	//Create quantile color scale outputting bucket of color based on appearences 
	var colorScale = d3.scale.quantile()
							 .domain([0, bucket - 1, d3.max(long_data, function (d) {
							 		return d.Value;})])						
							 .range(colors);

	//Appending each of the cards for the heatmap
	var cards = svg.selectAll(".episodes")
				   .data(long_data)
				   .enter().append("rect")
				   .attr("x", function(d) { return (d.Episode - 1) * gridSize; })
        			.attr("y", function(d) { return (d.id - 1) * gridSize; })
        			.attr("rx", 4)
        			.attr("ry", 4)
       				 .attr("width", gridSize)
       				 .attr("height", gridSize)
       				 .style("fill", function(d) { return colorScale(d.Value);})
       				 .style("stroke", "white")
       				 .style("stroke-width", 2);

    //Create color legend
    var legend = svg.selectAll(".legend")
    				.data([0].concat(colorScale.quantiles()), function(d) {return d; });


	legend.enter().append("g")
				  .attr("class", "legend");

	//Add color legend
	legend.append("rect")
		  .attr("x", function(d,i) {return legendElementWidth * i; })
		  .attr("y", 8.5*gridSize)
		  .attr("width", legendElementWidth)
		  .attr("height", gridSize/4)
		  .style("fill", function(d,i) {return colors[i]; })
		  .style("stroke","black")
		  .style("stroke-width", 1);

	//Add No of appearences above color legend
	legend.append("text")
		  .text(function(d) {return Math.round(d)})
		  .attr("x", function(d, i) { return legendElementWidth * i; })
		  .attr("y", 8.5*gridSize - 5);

	//Add title for legend
	legend.append("text")
		  .text("No of Appearances")
		  .attr("x", 0)
		  .attr("y", 8.5*gridSize - 25);

	//Exit to remove legend once new value is selected
	legend.exit().remove();
});
}