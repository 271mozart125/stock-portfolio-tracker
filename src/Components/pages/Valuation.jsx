import NavBar from "../Navbar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { financialsKey, key, quoteKey } from "../../key";
import { money } from "./Positions";

const Valuation = () => {
  let { search } = useParams();
  const [incomeStatement, setIncomeStatement] = useState([]);
  const [growth, setGrowth] = useState("");
  const [discount, setDiscount] = useState("");
  const [perpetual, setPerpetual] = useState("");
  const [netMargin, setNetMargin] = useState("");
  const [cash, setCash] = useState(0);
  const [debt, setdebt] = useState(0);
  const [shares, setShares] = useState(0);
  const [price, setPrice] = useState(0);
  const [npv, setNpv] = useState(0);
  const [value, setValue] = useState(0);
  const [years, setYears] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(
        `https://financialmodelingprep.com/api/v3/income-statement/${search}?period=annual&apikey=` +
          financialsKey
      ),
      fetch(
        `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${search}?period=annual&apikey=` +
          financialsKey
      ),
      fetch(
        `https://api.polygon.io/v3/reference/tickers/${search}?apiKey=` + key
      ),
      fetch(
        `https://finnhub.io/api/v1/quote?symbol=${search}&token=${quoteKey}`
      ),
    ])

      .then((responses) => {
        return Promise.all(responses.map((response) => response.json()));
      })
      .then((data) => {
        const financials = [];
        for (let key in data[0]) {
          financials.push({
            year: data[0][key].date,
            revenue: data[0][key].revenue / 1000000,
            netIncome: data[0][key].netIncome / 1000000,
            netMargin:
              Math.round(
                (data[0][key].netIncome / data[0][key].revenue) * 100 * 10
              ) / 10,
          });
        }
        setCash(data[1][0].cashAndShortTermInvestments / 1000000);
        setdebt(data[1][0].totalDebt / 1000000);
        setShares(data[2].results.weighted_shares_outstanding / 1000000);
        setIncomeStatement(financials);
        setPrice(data[3].c);
      });
  }, []);

  function npvNetIncome(num) {
    let revenue = num;
    let netIncome = revenue * (netMargin / 100);
    let npv = 0;
    for (let i = 1; i <= years; i++) {
      revenue = revenue * (1 + growth / 100);

      netIncome = revenue * (netMargin / 100);
      npv += netIncome / (1 + discount / 100) ** i;
    }

    revenue =
      (revenue * (1 + perpetual / 100)) / (discount / 100 - perpetual / 100);

    netIncome = revenue * (netMargin / 100);

    npv += netIncome / (1 + discount / 100) ** years;
    console.log(npv);

    setNpv(npv);
    setValue((npv + cash - debt) / shares);
  }

  return (
    <main className="valuation-page">
      <NavBar />
      <h2
        style={{
          color: "var(--text-color)",
          margin: "10px",
          textAlign: "center",
        }}
      >
        {search}
      </h2>
      <p style={{ color: "var(--text-color)", textAlign: "center" }}>
        $ in millions
      </p>
      <div className="valuation-wrapper">
        <section className="income-statement">
          <div className="valuation-tables-container">
            <table className="valuation-tables" id="data">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Revenue</th>
                  <th>Net Income</th>
                  <th>Net Margin</th>
                </tr>
              </thead>
              {incomeStatement.length > 0 ? (
                <tbody>
                  {incomeStatement.map((data) => {
                    return (
                      <tr key={data.year}>
                        <td>{data.year}</td>
                        <td>{money.format(data.revenue)}</td>
                        <td>{money.format(data.netIncome)}</td>
                        <td>{data.netMargin + "%"}</td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td>Averages</td>
                    <td>
                      {money.format(
                        (incomeStatement[0].revenue +
                          incomeStatement[1].revenue +
                          incomeStatement[2].revenue +
                          incomeStatement[3].revenue +
                          incomeStatement[4].revenue) /
                          5
                      )}
                    </td>
                    <td>
                      {money.format(
                        (incomeStatement[0].netIncome +
                          incomeStatement[1].netIncome +
                          incomeStatement[2].netIncome +
                          incomeStatement[3].netIncome +
                          incomeStatement[4].netIncome) /
                          5
                      )}
                    </td>
                    <td>
                      {Math.round(
                        ((incomeStatement[0].netMargin +
                          incomeStatement[1].netMargin +
                          incomeStatement[2].netMargin +
                          incomeStatement[3].netMargin +
                          incomeStatement[4].netMargin) /
                          5) *
                          10
                      ) /
                        10 +
                        "%"}
                    </td>
                  </tr>
                </tbody>
              ) : null}
            </table>
            <table className="valuation-tables valuation-inputs" id="data">
              <thead>
                <tr>
                  <th>Growth %</th>
                  <th>Discount %</th>
                  <th>Perpetual Growth %</th>
                  <th>Net Margin %</th>
                  <th>Years to Maturity Yrs</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input
                      value={growth}
                      onChange={(e) => setGrowth(e.target.value)}
                      type="number"
                    />
                  </td>
                  <td>
                    <input
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      type="number"
                    />
                  </td>
                  <td>
                    <input
                      value={perpetual}
                      onChange={(e) => setPerpetual(e.target.value)}
                      type="number"
                    />
                  </td>
                  <td>
                    <input
                      value={netMargin}
                      onChange={(e) => setNetMargin(e.target.value)}
                      type="number"
                    />
                  </td>
                  <td>
                    <input
                      value={years}
                      onChange={(e) => setYears(e.target.value)}
                      type="number"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section className="income-statement">
          <div className="valuation-tables-container">
            <table className="valuation-tables" id="growth">
              <thead>
                <tr>
                  <th>Growth</th>
                  <th>Revenue</th>
                  <th>Net Income</th>
                  <th>Net Margin</th>
                </tr>
              </thead>
              {incomeStatement.length > 0 ? (
                <tbody>
                  <tr>
                    <td>3 Year Growth</td>
                    <td>
                      {Math.round(
                        (incomeStatement[0].revenue /
                          incomeStatement[2].revenue -
                          1) *
                          100 *
                          10
                      ) /
                        10 +
                        "%"}
                    </td>
                    <td>
                      {Math.round(
                        (incomeStatement[0].netIncome /
                          incomeStatement[2].netIncome -
                          1) *
                          100 *
                          10
                      ) /
                        10 +
                        "%"}
                    </td>
                    <td>
                      {Math.round(
                        (incomeStatement[0].netMargin /
                          incomeStatement[2].netMargin -
                          1) *
                          100 *
                          10
                      ) /
                        10 +
                        "%"}
                    </td>
                  </tr>
                  <tr>
                    <td>Avg per Year</td>
                    <td>
                      {Math.round(
                        (((incomeStatement[0].revenue /
                          incomeStatement[2].revenue -
                          1) *
                          100) /
                          3) *
                          10
                      ) /
                        10 +
                        "%"}
                    </td>
                    <td>
                      {Math.round(
                        (((incomeStatement[0].netIncome /
                          incomeStatement[2].netIncome -
                          1) *
                          100) /
                          3) *
                          10
                      ) /
                        10 +
                        "%"}
                    </td>
                    <td>
                      {Math.round(
                        (((incomeStatement[0].netMargin /
                          incomeStatement[2].netMargin -
                          1) *
                          100) /
                          3) *
                          10
                      ) /
                        10 +
                        "%"}
                    </td>
                  </tr>
                  <tr>
                    <td>5 Year Growth</td>
                    <td>
                      {Math.round(
                        (incomeStatement[0].revenue /
                          incomeStatement[4].revenue -
                          1) *
                          100 *
                          10
                      ) /
                        10 +
                        "%"}
                    </td>
                    <td>
                      {Math.round(
                        (incomeStatement[0].netIncome /
                          incomeStatement[4].netIncome -
                          1) *
                          100 *
                          10
                      ) /
                        10 +
                        "%"}
                    </td>
                    <td>
                      {Math.round(
                        (incomeStatement[0].netMargin /
                          incomeStatement[4].netMargin -
                          1) *
                          100 *
                          10
                      ) /
                        10 +
                        "%"}
                    </td>
                  </tr>
                  <tr>
                    <td>Avg per Year</td>
                    <td>
                      {Math.round(
                        (((incomeStatement[0].revenue /
                          incomeStatement[4].revenue -
                          1) *
                          100) /
                          5) *
                          10
                      ) /
                        10 +
                        "%"}
                    </td>
                    <td>
                      {Math.round(
                        (((incomeStatement[0].netIncome /
                          incomeStatement[4].netIncome -
                          1) *
                          100) /
                          5) *
                          10
                      ) /
                        10 +
                        "%"}
                    </td>
                    <td>
                      {Math.round(
                        (((incomeStatement[0].netMargin /
                          incomeStatement[4].netMargin -
                          1) *
                          100) /
                          5) *
                          10
                      ) /
                        10 +
                        "%"}
                    </td>
                  </tr>
                </tbody>
              ) : null}
            </table>
            <table className="valuation-tables" id="data">
              <thead>
                <tr>
                  <th>NPV</th>
                  <th>Cash</th>
                  <th>Debt</th>
                  <th>EV</th>
                  <th>Shares Outstanding</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{money.format(npv)}</td>
                  <td>{money.format(cash)}</td>
                  <td>{money.format(debt)}</td>
                  <td>{money.format(npv + cash - debt)}</td>
                  <td>{Math.round(shares * 10) / 10}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th>Current Price</th>
                  <th>Value</th>
                  <th></th>
                </tr>
                <tr>
                  <td>{money.format(price)}</td>
                  <td>{money.format(value)}</td>
                  <td>
                    <button
                      onClick={(e) => npvNetIncome(incomeStatement[0].revenue)}
                    >
                      Calculate
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Valuation;
