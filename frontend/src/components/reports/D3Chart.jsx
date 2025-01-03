import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const D3Chart = ({ data, title, type = 'bar' }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return; // Avoid rendering if data is empty

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous content

    // Set dimensions and margins
    const width = 500;
    const height = 300;
    const margin = { top: 40, right: 20, bottom: 50, left: 50 };

    // Create scales
    const xScale = d3 
    .scaleBand()
      .domain(data.map((d) => d.name))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .range([height - margin.bottom, margin.top]);

    if (type === 'bar') {
      // Create bars
      svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (d) => xScale(d.name))
        .attr('y', (d) => yScale(d.value))
        .attr('width', xScale.bandwidth())
        .attr('height', (d) => height - margin.bottom - yScale(d.value))
        .attr('fill', 'steelblue');
    } else if (type === 'line') {
        
      // Create line graph
      const line = d3.line()
        .x((d) => xScale(d.name) + xScale.bandwidth() / 2)
        .y((d) => yScale(d.value));

      svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 2)
        .attr('d', line);
    }

    // Add x-axis
    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    // Add y-axis
    svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale));

    // Add chart title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text(title); 

    // Add x-axis label with padding above
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - margin.bottom + 30) 
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('Categories');

    // Add y-axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', margin.left - 40)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('Count');
  }, [data, title, type]);

  return <svg ref={svgRef} width={500} height={350}></svg>;
};

export default D3Chart;