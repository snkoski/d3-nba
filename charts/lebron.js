const loadData =
  d3.csv("../csv/lebron_career.csv")
  .then(data => {
    data.forEach((d) => {
      d["index"] = +d["index"];
      // d["name"] = +d["name"];
      d["date"] = new Date(d["date"]);
      d["ageY"] = +d["ageY"];
      d["ageD"] = +d["ageD"];
      // // d["location"] = +d["location"];
      // // d["team"] = +d["team"];
      // // d["opponent"] = +d["opponent"];
      // // d["gameResult"] = +d["gameResult"];
      // // d["margin"] = +d["margin"];
      // d["started"] = +d["started"];
      d["minutesPlayed"] = +d["minutesPlayed"];
      d["fg"] = +d["fg"];
      d["fga"] = +d["fga"];
      d["fg3"] = +d["fg3"];
      d["fg3a"] = +d["fg3a"];
      d["fg3pct"] = +d["fg3pct"];
      d["ft"] = +d["ft"];
      d["fta"] = +d["fta"];
      d["ftpct"] = +d["ftpct"];
      d["orb"] = +d["orb"];
      d["drb"] = +d["drb"];
      d["trb"] = +d["trb"];
      d["assists"] = +d["assists"];
      d["steals"] = +d["steals"];
      d["blocks"] = +d["blocks"];
      d["turnovers"] = +d["turnovers"];
      d["personalFouls"] = +d["personalFouls"];
      d["points"] = +d["points"];
      d["gameScore"] = +d["gameScore"];
      // d["plusMinus"] = +d["plusMinus"];
})
    return data;
  })

loadData.then(data => {
    initializeChart(data)
})

const addButtons = (data, size) => {
  const body = document.getElementsByTagName("body")[0]
  const keys = Object.keys(data)
  const gameNumbers = [size, Math.round(size / 2), 200, 82]
  let statDiv = document.createElement("div")
  let gamesDiv = document.createElement("div")


  // add buttons for each numeric key
  for (let i = 0; i < keys.length; i++) {
    if (typeof(data[keys[i]]) == "number") {
      let newButton = document.createElement("button")
      newButton.setAttribute("type", "button")
      newButton.setAttribute("class", "stat-btn")
      newButton.setAttribute("id", keys[i])
      let newText = document.createTextNode(keys[i])
      newButton.appendChild(newText)
      statDiv.appendChild(newButton)
    }
  }
  body.appendChild(statDiv)

  for (let i = 0; i < gameNumbers.length; i++) {
    let newButton = document.createElement("button")
    newButton.setAttribute("type", "button")
    newButton.setAttribute("class", "games-btn")
    newButton.setAttribute("id", "games-" + gameNumbers[i])
    let newText = document.createTextNode(gameNumbers[i])
    newButton.appendChild(newText)
    gamesDiv.appendChild(newButton)
  }
  body.appendChild(gamesDiv)
}

const initializeChart = data => {
  addButtons(data[0], data.length);
  let currentData = data;
// console.log(chart);
  console.log(data.length);
  const margin = {top:50, right:50, bottom:50, left:50};
  const width = window.innerWidth * 5 - margin.left - margin.right;
  const height = window.innerHeight - margin.top - margin.bottom;

  // const xMin = d3.min(data, d => d.date);
  // const xMax = d3.max(data, d => d.date);
  let yMin = d3.min(data, d => d.points);
  let yMax = d3.max(data, d => d.points);

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

  const minutesPlayedLine = d3.line()
    .x((d, i) => xScale(i))
    .y((d) => yScale(d.minutesPlayed))

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

  chartGroup.append("path")
    .datum(currentData)
    .attr("class", "point-path")
    .attr("id", "pointLine")
    .attr("fill", "none")
    .attr("stroke", "#ff0000")
    .attr("d", pointLine)

  chartGroup.append("path")
    .datum(currentData)
    .attr("class", "min-path")
    .attr("id", "minutesPlayedLine")
    .attr("fill", "none")
    .attr("stroke", "#66bb00")
    .attr("d", minutesPlayedLine)

  d3.selectAll(".stat-btn").on("click", function() {
    yMin = d3.min(data, d => d[this.id]);
    yMax = d3.max(data, d => d[this.id]);
    yScale.domain([yMin, yMax])

    svg.select(".y.axis")
      .transition()
      .duration(500)
      .call(yAxis)
  })

  d3.selectAll(".games-btn").on("click", function() {
    // console.log("XSCALE", this.innerText)
    xScale.domain([0, parseInt(this.innerText)])

    currentData = data.slice(data.length - parseInt(this.innerText))


    chartGroup.select(".point-path")
      .datum(currentData)
      // .enter()
      .transition()
      .duration(500)
      .attr("d", eval(d3.select(".point-path").attr("id")))

    chartGroup.select(".min-path")
      .datum(currentData)
      // .enter()
      .transition()
      .duration(500)
      .attr("d", eval(d3.select(".min-path").attr("id")))

      console.log(this.id);





    chartGroup.select(".x.axis")
      .transition()
      .duration(500)
      .call(xAxis)
  })


}
