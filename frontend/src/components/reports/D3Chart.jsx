import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const D3Chart = ({ data, title, type = "bar" }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return; // Avoid rendering if data is empty

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous content

    // Set dimensions and margins
    const width = 350; // Adjusted width
    const height = 350; // Adjusted height
    const margin = { top: 40, right: 20, bottom: 120, left: 50 };

    // Create scales
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)]) // Dynamic based on data
      .range([height - margin.bottom, margin.top])
      .nice(); // Round the domain to nice values

    const color = "#1E7590"; // Set the desired color

    if (type === "bar") {
      // Create bars
      svg
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d) => xScale(d.name))
        .attr("y", (d) => yScale(d.value))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => height - margin.bottom - yScale(d.value))
        .attr("fill", color);
    } else if (type === "line") {
      // Create line graph
      const line = d3
        .line()
        .x((d) => xScale(d.name) + xScale.bandwidth() / 2)
        .y((d) => yScale(d.value));

      svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("d", line);
    }

    // Add x-axis
    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".30em")
      .attr("transform", "rotate(-45)");

    // Add y-axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale).ticks(9));

    // Add y-axis title based on chart type
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)") // Rotate the text for vertical alignment
      .attr("y", margin.left - 40) // Adjust y position
      .attr("x", -height / 2) // Center the title vertically
      .text(type === "line" ? "% Percentage" : "Count") // Set the title text based on type
      .style("font-size", "12px") // Set font size
      .style("fill", "#000"); // Set text color

    // Add chart title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text(title);

    // Add x-axis
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - margin.bottom + 110)
      .attr("text-anchor", "middle")
      .text("Categories");
  }, [data, title, type]);

  return <svg ref={svgRef} width={500} height={350}></svg>;
};

export default D3Chart;
