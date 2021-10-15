import "./styles.css";
import { select, range, scaleOrdinal } from "d3";
import { useEffect, useRef, useState } from "react";

export default function App() {
  const svgRef = useRef(null);
  const makeFruit = (type) => ({ type, id: Math.random() });
  const [fruits, setFruits] = useState(() =>
    range(5).map(() => makeFruit("apple"))
  );

  const render = (selection, { fruits, width, height }) => {
    const colorScale = scaleOrdinal()
      .domain(["apple", "lemon"])
      .range(["#c11d1d", "#eae600"]);

    const radiusScale = scaleOrdinal()
      .domain(["apple", "lemon"])
      .range([80, 50]);

    const bowlWidth = 920;
    const bowlMarginLeft = (width - bowlWidth) / 2;

    const bowl = selection
      .selectAll("rect")
      .data([null])
      .enter()
      .append("rect")
      .attr("x", bowlMarginLeft)
      .attr("y", 110)
      .attr("width", bowlWidth)
      .attr("height", 300)
      .attr("rx", 300 / 2);

    const groups = selection.selectAll("g").data(fruits);
    const groupsEnter = groups.enter().append("g");
    groupsEnter
      .merge(groups)
      .attr(
        "transform",
        (d, i) => `translate(${bowlMarginLeft + i * 180 + 100}, ${height / 2})`
      );
    groups.exit().remove();

    groupsEnter
      .append("circle")
      .merge(groups.select("circle"))
      // .transition().duration(1000)
      // .attr(
      //   "transform",
      //   (d, i) => `translate(${i * 180 + 100}, ${height / 2})`
      // )
      .attr("fill", (d) => colorScale(d.type))
      .attr("r", (d) => radiusScale(d.type));

    groupsEnter
      .append("text")
      .merge(groups.select("text"))
      .attr("y", 120)
      .text((d) => d.type);
  };

  useEffect(() => {
    const { width, height } = svgRef.current.getBoundingClientRect();

    const svg = select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    render(svg, { fruits, width, height });
  }, [fruits]);

  useEffect(() => {
    setTimeout(() => {
      console.log("eat an apple");
      setFruits((prev) => prev.slice(0, -1));
    }, 1500);

    setTimeout(() => {
      console.log("switch an apple to lemon");

      setFruits((prev) =>
        prev.map((el, idx) => {
          if (idx === 1) {
            return { ...el, type: "lemon" };
          }
          return el;
        })
      );
    }, 3000);

    setTimeout(() => {
      setFruits((prev) => prev.filter((_, idx) => idx !== 2));
    }, 4000);
  }, []);

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <div>
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
}
