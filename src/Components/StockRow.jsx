import { useSelector, useDispatch } from "react-redux";
import { money } from "./pages/Positions";
import { tradeSelect, getMark } from "../redux/slices/accountSlice";
import { priorTradeModal } from "../redux/slices/displaySlice";
import { useState, useEffect } from "react";
import { quoteKey } from "../key.jsx";

const StockRow = () => {
  const positions = useSelector((state) => state.account.positions);
  const short = { color: "red" };
  const long = { color: "green" };
  const dispatch = useDispatch();
  const open = "open";

  useEffect(
    () => {
      const interval = setInterval(() => {
        for (let i = 0; i < positions.length; i++) {
          fetch(
            `https://finnhub.io/api/v1/quote?symbol=${positions[i].ticker}&token=${quoteKey}`
          )
            .then((res) => res.json())
            .then((data) => {
              dispatch(
                getMark({
                  ticker: positions[i].ticker,
                  mark: data.c,
                })
              );
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }, 60000);
      return () => clearInterval(interval);
    },
    [],
    [positions]
  );

  function trader(x) {
    dispatch(
      tradeSelect({
        ticker: x,
      })
    );
    dispatch(priorTradeModal(open));
  }

  return (
    <tbody>
      {positions.map((pos) => {
        if (pos.direction === "LONG") {
          return (
            <tr
              key={pos.ticker}
              value={pos.ticker}
              onClick={(e) => trader(pos.ticker)}
            >
              <td style={long}>{pos.ticker}</td>
              <td style={long}>{pos.quantity}</td>
              <td style={long}>{money.format(pos.price)}</td>
              <td>{money.format(pos.mark)}</td>
              {pos.mark - pos.price > 0 ? (
                <td style={long}>
                  {money.format((pos.mark - pos.price) * pos.quantity)}
                </td>
              ) : (
                <td style={short}>
                  {money.format((pos.mark - pos.price) * pos.quantity)}
                </td>
              )}
              <td style={long}>{money.format(pos.tradeTotal)}</td>
            </tr>
          );
        } else if (pos.direction === "SHORT") {
          return (
            <tr
              key={pos.ticker}
              value={pos.ticker}
              onClick={(e) => trader(pos.ticker)}
            >
              <td style={short}>{pos.ticker}</td>
              <td style={short}>{pos.quantity}</td>
              <td style={short}>{money.format(pos.price)}</td>
              <td>{money.format(pos.mark)}</td>
              {pos.price - pos.mark > 0 ? (
                <td style={long}>
                  {money.format((pos.price - pos.mark) * pos.quantity)}
                </td>
              ) : (
                <td style={short}>
                  {money.format((pos.mark - pos.price) * pos.quantity)}
                </td>
              )}
              <td style={short}>{money.format(pos.tradeTotal)}</td>
            </tr>
          );
        }
      })}
    </tbody>
  );
};

export default StockRow;
