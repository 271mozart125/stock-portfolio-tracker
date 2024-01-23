import Navbar from "../Navbar";
import { useEffect, useState } from "react";
import { newsKey } from "../../key";

const Home = () => {
  const [news, setNews] = useState([]);
  useEffect(() => {
    fetch(
      "https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=financial_markets&apikey=" +
        newsKey
    )
      .then((res) => res.json())
      .then((data) => {
        const newsData = [];
        for (let key in data.feed) {
          newsData.push({
            title: data.feed[key].title,
            summary: data.feed[key].summary,
            image: data.feed[key].banner_image,
            url: data.feed[key].url,
          });
        }
        setNews(newsData);
      });
  }, []);
  return (
    <main className="home-wrapper">
      <Navbar />
      <section>
        {news.map((article) => {
          return (
            <div className="news-row" value={article.url} key={article.url}>
              <div className="news-col info">
                <h2>
                  <a href={article.url} target="_blank">
                    {article.title}
                  </a>
                </h2>
                <p className="summary">{article.summary}</p>
              </div>
              <div className="news-col image">
                <img src={article.image} alt={article.title} />
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
};

export default Home;
