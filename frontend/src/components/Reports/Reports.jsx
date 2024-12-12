import React, { useEffect } from 'react';
import * as d3 from 'd3';

const Reports = () => {
  useEffect(() => {
    const data = [
      { task: 'Task 1', completion: 10 },
      { task: 'Task 2', completion: 15 },
      { task: 'Task 3', completion: 13 },
    ];

    const svg = d3.select('#bar-chart')
      .attr('width', 500)
      .attr('height', 300);

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.task))
      .range([0, 500])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.completion)])
      .range([300, 0]);

    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.task))
      .attr('y', d => yScale(d.completion))
      .attr('width', xScale.bandwidth())
      .attr('height', d => 300 - yScale(d.completion))
      .attr('fill', 'blue');
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl">Reports</h2>
      <svg id="bar-chart"></svg>
    </div>
  );
};

export default Reports;
