function unpack(rows, index){
    return rows.map(row => row[index])
};

function getData(){
    d3.csv("assets/data/data.csv").then(function(data) {
        var poverty = data.map(d => d.poverty);
        var healthcare = data.map(d => d.healthcare);
        var state = data.map(d => d.state);
        poverty = +poverty;
        healthcare = +healthcare;
        state = +state;
    })
};

function init(){
    d3.csv("assets/data/data.csv").then(function(data) {
    var svgWidth = 960;
    var svgHeight = 500;
    
    var margin = {
      top: 20,
      right: 40,
      bottom: 60,
      left: 100
    };
    
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
    
    // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
    var svg = d3.select("#scatter")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);
    
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    getData();

    // console.log(poverty)
    // Create scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([0, 25])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, 30])
      .range([height, 0]);

    // Format the date and cast the force value to a number
    // data.forEach(function(d) {
    //   d.poverty = +d.poverty
    //   d.healtcare = +d.healtcare
    // });
    
    // // Create scale functions
    // var xLinearScale = d3.scaleLinear()
    //   .domain(d3.extent(data, d => +d.poverty))
    //   .range([0, width]);
      
    // var yLinearScale = d3.scaleLinear()
    //   .domain([0, d3.max(data, d => +d.healthcare)])
    //   .range([height,0]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
     .call(bottomAxis);

    chartGroup.append("g")
     .call(leftAxis);

    // Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("opacity", ".5")
    .classed("stateCircle", true)

    var circleText = chartGroup.selectAll("stateText")
    .data(data)
    .enter()
    .append("text")
    .attr("dx", d => xLinearScale(d.poverty))
    .attr("dy", d => yLinearScale(d.healthcare)+5)
    .text(d => d.abbr)
    .classed("stateText", true)
  

    // Initialize tool tip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healtcare}%`);
      });

    // Create tooltip in the chart
    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
    // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2) - 45)
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lack of Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Poverty (%)");
  }).catch(function(error) {
    console.log(error);

    });
};

init()

