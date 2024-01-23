import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { key } from "../../key";
import Navbar from "../Navbar";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const CompanyPage = () => {
  let { search } = useParams();
  const navigate = useNavigate();
  const [ticker, setTicker] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stockData, setStockData] = useState([]);
  const [news, setNews] = useState([]);

  const renderLineChart = (
    <LineChart
      className="line-chart"
      width={1500}
      height={400}
      data={stockData}
      margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
    >
      <Line type="monotone" dataKey="close" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis dataKey="name" />
      <YAxis dataKey="close" domain={["dataMin", "dataMax"]} />
      <Tooltip />
    </LineChart>
  );
  const todayDate = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    Promise.all([
      fetch(
        `https://api.polygon.io/v2/aggs/ticker/${search}/range/1/day/2023-02-09/${todayDate}?adjusted=true&sort=asc&limit=365&apiKey=${key}`
      ),
      fetch(
        `https://api.polygon.io/v3/reference/tickers/${search}?apiKey=${key}`
      ),
      fetch(
        `https://api.polygon.io/v2/reference/news?ticker=${search}&apiKey=${key}`
      ),
    ])
      .then((responses) => {
        return Promise.all(responses.map((response) => response.json()));
      })
      .then((data) => {
        let dataArr = [];
        console.log(data);

        setName(data[1].results.name);
        setTicker(data[1].results.ticker);
        setDescription(data[1].results.description);
        //chart //

        for (
          let i = data[0].results.length - 1;
          i > data[0].results.length - 51;
          i--
        ) {
          dataArr.unshift({
            name: new Date(data[0].results[i].t).toLocaleDateString("en-US"),
            close: data[0].results[i].c,
          });
        }
        setStockData(dataArr);
        setNews(data[2].results);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <main className="company-page-wrapper">
      <Navbar />
      <div className="company-page">
        <section className="chart-section">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2 style={{ color: "var(--text-color)", margin: "20px" }}>
              {ticker}
            </h2>
            <button
              onClick={(e) => navigate("/valuation/" + search)}
              className="search-btn"
              style={{ margin: "20px", background: "var(--dark)" }}
              id="valuation-route"
            >
              Valuation
            </button>
          </div>
          <div className="chart">{renderLineChart}</div>
        </section>
        <section className="company-info">
          <h3>{name}</h3>
          <p style={{ marginTop: "20px", padding: "10px" }}>{description}</p>
        </section>
        <section className="company-news">
          {news.map((article) => {
            return (
              <div className="news-row">
                <div className="news-col info">
                  <h2>
                    <a href={article.articl_url} target="_blank">
                      {article.title}
                    </a>
                  </h2>
                  <p className="summary">{article.description}</p>
                </div>
                <div className="news-col image">
                  <img src={article.image_url} alt="" />
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
};

export default CompanyPage;
