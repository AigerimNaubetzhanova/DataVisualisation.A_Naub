async function buildPlot() {
    console.log("Hello world");
    const data = await d3.json("my_weather_data.json");
    //console.table(data);
    const dateParser = d3.timeParse("%Y-%m-%d");
    const yAccessor_cold = (d) => d.temperatureMin;
    const yAccessor_hot = (d) => d.temperatureHigh;
    const xAccessor = (d) => dateParser(d.date);
    // Функции для инкапсуляции доступа к колонкам набора данных

   var dimension = {
        width: window.innerWidth*0.9,
        height: 400,
        margin: {
            top: 100,
            left: 30,
            bottom: 30,
            right: 0
        }
    };


    dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right;
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;

   const wrapper = d3.select("#wrapper");
    const svg = wrapper.append("svg")
    svg.attr("height",dimension.height);
    svg.attr("width",dimension.width);

   const bounded = svg.append("g");
    bounded.style("transform",translate(${dimension.margin.left}px, ${dimension.margin.top}px));

   const yScaler = d3.scaleLinear()
        .domain(d3.extent(data,yAccessor_cold))
        .domain(d3.extent(data,yAccessor_hot))
        .range([dimension.boundedHeight,0]);

   // grid_window будет координатным полем где будет нарисован график
    const grid_window = yScaler(100);
    // grid будет граница координатного поля
    const grid = bounded
        .append("rect")
        .attr("x", 0)
        .attr("width", dimension.boundedWidth)
        .attr("y", grid_window)
        .attr("height", dimension.boundedHeight - grid_window)
        .attr("fill", "white");

   const xScaler = d3.scaleTime()
        .domain(d3.extent(data,xAccessor))
        .range([0,dimension.boundedWidth]);

   var low_temp_graph = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => yScaler(yAccessor_cold(d)))
        .curve(d3.curveBasis);
    var high_temp_graph = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => yScaler(yAccessor_hot(d)))
        .curve(d3.curveBasis);

   bounded.append("path")
        .attr("d",low_temp_graph(data))
        .attr("fill","none")
        .attr("stroke", "Blue")
        .attr("stroke-width", 2)

   bounded.append("path")
        .attr("d",high_temp_graph(data))
        .attr("fill","none")
        .attr("stroke", "Red")
        .attr("stroke-width", 2)

   const yaxis_scale = d3.axisLeft().scale(yScaler);
    const yAxis = bounded.append("g").call(yaxis_scale);
    // Generate X Axis
    const xaxis_scale = d3.axisBottom().scale(xScaler);
    const xAxis = bounded
        .append("g")
        //"%b - abbreviated month name.*  https://github.com/d3/d3-time-format
        .call(xaxis_scale.tickFormat(d3.timeFormat("%b,%y")))
        .style("transform", translateY(${dimension.boundedHeight}px));

   svg
        .append("g")
        .style("transform", translate(${50}px,${15}px))
        .append("text")
        .attr("class", "title")
        .attr("x", dimension.width / 2)
        .attr("y", dimension.margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "36px")
        .style("text-decoration", "underline");

}

buildPlot();