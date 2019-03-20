const loadData =
  d3.csv("../csv/harden_points_fgp_result.csv")
  .then(data => {
    data.forEach((d) => {
      d["date"] = new Date(d["date"]);
      d["points"] = +d["points"];
      d["fgp"] = +d["fgp"];
      d["result"] = d["result"].slice(0, 1);
    })
    return data;
  })

loadData.then(data => {
  initializeChart(data)
})

const initializeChart = data => {
  console.log(data);
  const margin = {top:50, right:50, bottom:50, left:50};
  const width = window.innerWidth * 5 - margin.left - margin.right;
  const height = window.innerHeight - margin.top - margin.bottom;

  // const xMin = d3.min(data, d => d.date);
  // const xMax = d3.max(data, d => d.date);
  const yMin = d3.min(data, d => d.points);
  const yMax = d3.max(data, d => d.points);

  const xScale = d3.scaleLinear()
    .domain([0, data.length])
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([yMin, yMax])
    .range([height, 0]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  const pointLine = d3.line()
    .x((d, i) => xScale(i))
    .y((d) => yScale(d.points))

  var symbolGenerator = d3.symbol()
  .type(d3.symbolStar)
  .size(20);

  var pathData = symbolGenerator();

  const svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

  const chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

  chartGroup.append("g")
    .attr("class", "axis x")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis)

  chartGroup.append("g")
    .attr("class", "axis y")
    .attr("transform", `translate(0, 0)`)
    .call(yAxis)

  // chartGroup.append("path")
  //   .attr("fill", "none")
  //   .attr("stroke", "#ff0000")
  //   .attr("d", pointLine(data))

  chartGroup.selectAll("path")
  .data(data)
  .enter()
  .append("path")
	.attr('transform', function(d, i) {
		return 'translate(' + xScale(i) + ',' + yScale(d.points) + ')';
	})
	.attr('d', pathData);




}
