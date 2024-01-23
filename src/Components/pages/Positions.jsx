import Navbar from "../Navbar";
import StockRow from "../StockRow";
import { useSelector } from "react-redux";
import { balanceModal, trader } from "../../redux/slices/displaySlice";
import { useDispatch } from "react-redux";
import * as d3 from "d3";
import { useRef, useEffect, useState } from "react";

export const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const Positions = () => {
  const positions = useSelector((state) => state.account.positions);
  const cashBalance = useSelector((state) => state.account.cashBalance);
  const open = "open";
  const dispatch = useDispatch();
  const svgRef = useRef();
  const [pL, setPL] = useState(0);
  const [invested, setInvested] = useState(0);
  let accountBalance = cashBalance + pL + invested;

  const data = positions.map((pos) => {
    return {
      property: pos.ticker,
      value: (pos.tradeTotal / accountBalance) * 100,
    };
  });

  const cashData = {
    property: "cash",
    value: (cashBalance / accountBalance) * 100,
  };

  (function () {
    if (cashBalance > 0) {
      data.push(cashData);
    }
  })();

  useEffect(() => {
    const interval = setInterval(() => {
      let sumPL = 0;
      let sumInvested = 0;
      for (let i = 0; i < positions.length; i++) {
        if (positions[i].direction === "LONG") {
          sumInvested = sumInvested + positions[i].tradeTotal;
          sumPL =
            sumPL +
            (positions[i].mark - positions[i].price) * positions[i].quantity;
        } else {
          sumInvested += positions[i].tradeTotal;
          sumPL =
            sumPL +
            (positions[i].price - positions[i].mark) * positions[i].quantity;
        }
      }
      setPL(sumPL);

      setInvested(sumInvested);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // -------d3-----------//
  useEffect(() => {
    const w = 350;
    const h = 350;
    const radius = w / 2;
    const svg = d3
      .select(svgRef.current)
      .attr("width", w)
      .attr("height", h)
      .style("overflow", "visible")
      .style("position", "absolute")
      .style("top", "73%")
      .style("left", "13%");

    const formatData = d3.pie().value((d) => d.value)(data);
    const arc1 = d3
      .arc()
      .innerRadius(radius / 2)
      .outerRadius(radius);
    const color = d3.scaleOrdinal().range(d3.schemeSet2);
    const hoverArc = d3
      .arc()
      .innerRadius(radius / 2)
      .outerRadius(radius * 1.1);

    svg
      .selectAll()
      .data(formatData)
      .join("path")
      .attr("d", arc1)
      .attr("fill", (d) => color(d.value))
      .style("opacity", 1)
      .on("mouseover", function (d, i) {
        d3.select(this).transition().duration(500).attr("d", hoverArc);
      })
      .on("mouseout", function (d, i) {
        d3.select(this).transition().duration(500).attr("d", arc1);
      });

    svg
      .selectAll()
      .data(formatData)
      .join("text")
      .text((d) => d.data.property)
      .attr("transform", (d) => `translate(${arc1.centroid(d)})`)
      .style("text-anchor", "middle");
  }, [data]);

  // -------d3-----------//

  function handleOpen() {
    dispatch(balanceModal(open));
  }

  function openTrade() {
    dispatch(trader(open));
  }

  return (
    <main className="positions-main">
      <Navbar />
      <div className="row">
        <div className="positions-col balances">
          <div className="balances-info">
            <p>Account Balance</p>
            <p>{money.format(accountBalance)}</p>
            <p>Cash Balance</p>
            <p>{money.format(cashBalance)}</p>
            <button className="edit-balance-btn" onClick={handleOpen}>
              Edit Balance
            </button>
          </div>
          <div className="pie-chart">
            <svg className="chart" ref={svgRef}></svg>
          </div>
        </div>
        <div className="positions-col positions">
          <table className="positions-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Quantitiy</th>
                <th>Trade Price</th>
                <th>Mark</th>
                <th>P/L</th>
                <th>Invested</th>
              </tr>
            </thead>
            {positions.length > 0 && <StockRow />}
          </table>
        </div>
      </div>
    </main>
  );
};

export default Positions;
