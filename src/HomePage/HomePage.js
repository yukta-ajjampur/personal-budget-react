import React, { useEffect, useRef, useState } from "react";
import Axios from "axios";
import Chart from "chart.js/auto";
import * as d3 from "d3";

function HomePage() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null); // Store chart instance to destroy it later

  const [dataSource, setDataSource] = useState({
    datasets: [
      {
        data: [],
        backgroundColor: [
          "#ffcd56",
          "#ff6310",
          "#36a2eb",
          "#ff5777",
          "#33cc99",
          "#8a33rr",
          "#ff9f40",
        ],
      },
    ],
    labels: [],
  });

  function createBudgetBarChart(data) {
    // Set chart dimensions
    const width = 600;
    const height = 400;
    const margin = { top: 30, right: 20, bottom: 50, left: 80 };

    // Remove existing SVG to prevent duplication
    d3.select("#chart").select("svg").remove();

    // Create an SVG container
    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Define scales
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.title))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.budget)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Define a color scale for bars (random vibrant colors)
    const colorScale = d3.scaleOrdinal([
      "#ff4d4d",
      "#ffac40",
      "#00d5ff",
      "#8cff42",
      "#ff66b2",
      "#49offf",
      "#b266ff",
    ]);

    // Create X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-15)")
      .style("text-anchor", "end")
      .style("font-size", "14px")
      .style("fill", "#333");

    // Create Y axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Add bars with vibrant colors
    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.title))
      .attr("y", (d) => y(d.budget))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - margin.bottom - y(d.budget))
      .attr("fill", (d, i) => colorScale(i)) // Assigning colors dynamically
      .attr("rx", 5) // Rounded corners for style
      .attr("ry", 5);

    // Add labels on top of bars
    svg
      .selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (d) => x(d.title) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.budget) - 5)
      .attr("text-anchor", "middle")
      .attr("fill", "#222")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .text((d) => d.budget);
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await Axios.get("http://localhost:3001/budget");

        const updatedData = {
          datasets: [
            {
              data: res.data.myBudget.map((item) => item.budget),
              backgroundColor: [
                "#ffcd56",
                "#ff6384",
                "#36a2eb",
                "#fd6b19",
                "#4bc0c0",
                "#9966ff",
                "#ff9f40",
              ],
            },
          ],
          labels: res.data.myBudget.map((item) => item.title),
        };

        setDataSource(updatedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();

    // Fetch data from backend and create the chart
    Axios.get("http://localhost:3001/new-budget-endpoint")
      .then(function (res) {
        createBudgetBarChart(res.data.myBudget);
      })
      .catch(function (error) {
        console.error("Error fetching budget data:", error);
      });
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      // Destroy previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create new Chart instance and store it in ref
      chartInstance.current = new Chart(ctx, {
        type: "pie",
        data: dataSource,
      });
    }
  }, [dataSource]);

  return (
    <main className="center" id="main">
      <div className="page-area">
        <article>
          <h1>Stay on track</h1>
          <p>
            Do you know where you are spending your money? If you really stop to
            track it down, you would get surprised! Proper budget management
            depends on real data... and this app will help you with that!
          </p>
        </article>

        <article>
          <h1>Alerts</h1>
          <p>
            What if your clothing budget ended? You will get an alert. The goal
            is to never go over the budget.
          </p>
        </article>

        <article>
          <h1>Results</h1>
          <p>
            People who stick to a financial plan, budgeting every expense, get
            out of debt faster! Also, they to live happier lives... since they
            expend without guilt or fear... because they know it is all good and
            accounted for.
          </p>
        </article>

        <article>
          <h1>Free</h1>
          <p>This app is free!!! And you are the only one holding your data!</p>
        </article>

        <article>
          <h1>Stay on track</h1>
          <p>
            Do you know where you are spending your money? If you really stop to
            track it down, you would get surprised! Proper budget management
            depends on real data... and this app will help you with that!
          </p>
        </article>

        <article>
          <h1>Alerts</h1>
          <p>
            What if your clothing budget ended? You will get an alert. The goal
            is to never go over the budget.
          </p>
        </article>

        <article>
          <h1>Results</h1>
          <p>
            People who stick to a financial plan, budgeting every expense, get
            out of debt faster! Also, they to live happier lives... since they
            expend without guilt or fear... because they know it is all good and
            accounted for.
          </p>
        </article>

        <article>
          <h1>Chart</h1>
          <p>
            <canvas ref={chartRef} width="400" height="400"></canvas>
          </p>
        </article>

        <article>
          <h1>D3-Chart</h1>
          <p>This is the budget bar chart created with D3.</p>
          <div id="chart"></div>
        </article>
      </div>
    </main>
  );
}

export default HomePage;