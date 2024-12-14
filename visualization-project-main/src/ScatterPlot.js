import React, {Component} from "react";
import * as d3 from "d3";

class ScatterPlot extends Component {
    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
    }

    componentDidMount() {
        this.drawChart();
    }

    componentDidUpdate() {
        this.drawChart();
    }

    drawChart() {
        const data = this.props.csv_data;

        // ensures that we only refresh when new valid data is loaded
        if (!data || data.length === 0) return;

        // dimensions of the scatter plot
        const margin = {top: 20, right: 20, bottom: 50, left: 35};
        const width = 370 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        d3.select(this.chartRef.current).selectAll("*").remove();

        /*Hollly data processing . headache here and with the scale bc of the dataset*/
        // it makes sense to hard code. short on time
        // real scale
        const xScale = d3.scaleLinear().domain([0, 450]).range([0, width]);
        const yScale = d3.scaleLinear().domain([0, 5]).range([height, 0]);

        const groupedData = d3.group(data, (d) => d.Brand);
        const averagedData = Array.from(groupedData, ([key, value]) => ({
            Brand: key,
            "Average Storage": d3.mean(value, (d) => +d["Storage (GB)"]),
            "Average Stars": d3.mean(value, (d) => +d.Stars)
        }));

        const svg = d3
            .select(this.chartRef.current)
            .append("svg")
            .attr("width", width + margin.left + margin.right+50)
            .attr("height", height + margin.top + margin.bottom + 100)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const container = svg
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // appending the xAxis Scale to the svg
        container
            .append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .style("font-size", "10px");

        // appending the yAxis Scale to the svg
        container
            .append("g")
            .call(d3.axisLeft(yScale))
            .selectAll("text")
            .style("font-size", "10px");

        // appending the x axis title
        svg
            .append("text")
            .attr("x", width - 300)
            .attr("y", height + 60)
            .attr("text-anchor", "center")
            .style("font-size", "12px")
            .text("Avg. Storage (GB)");

        // appending the y axis title
        svg
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", margin.left / 2 - 10)
            .attr("x", -(height / 2 + margin.top))
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .text("Avg. Stars");

        // appending the title on the scatter plot
        svg
            .append("text")
            .attr("x", width / 2 + margin.left)
            .attr("y", margin.top / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Avg. Storage (GB) vs Avg. Stars by Brand");

        // adds the vertical light lines for better visualization on the plot values
        container.append("g")
            .attr("class", "grid")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale).tickSize(-height).tickFormat(""));

        // adds the horizontal light lines for same reason as above
        container.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(""));

        // styles the measurement grid lines in the visualization
        svg.selectAll(".grid line")
            .style("stroke", "#e0e0e0")
            .style("stroke-opacity", "0.5")

        // the plots themselves
        container
            .selectAll("circle")
            .data(averagedData)
            .join("circle")
            .attr("cx", (d) => xScale(d["Average Storage"]))
            .attr("cy", (d) => yScale(d["Average Stars"]))
            .attr("r", 5)
            .attr("fill", "#69b3a2");


        // select title being output, will be changed later to color scale because it still cluters
        const brandTitleOutput = ["VOX", "KARBONN", "ITEL", "LAVA", "CMF", "GOOGLE", "APPLE", "HONOR", "XIAOMI"]
        container
            .selectAll("text.label")
            .data(averagedData.filter(d => brandTitleOutput.includes(d.Brand)))
            .join("text")
            .attr("class", "label")
            .attr("x", (d) => xScale(d["Average Storage"]) + 5)
            .attr("y", (d) => yScale(d["Average Stars"]) - 5)
            .style("font-size", "10px")
            .style("fill", "black")
            .text((d) => d.Brand);
    }

    render() {
        return <div ref={this.chartRef}></div>;
    }
}

export default ScatterPlot;
