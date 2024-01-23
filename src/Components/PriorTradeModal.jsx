import { IoIosClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { priorTradeModal, trader } from "../redux/slices/displaySlice";
import { useState } from "react";
import { trade } from "../redux/slices/accountSlice";
import { money } from "./pages/Positions";

const PriorTradeModal = () => {
  const tradeInfo = useSelector((state) => state.account.selected);
  const [ticker, setTicker] = useState(tradeInfo.ticker);
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const open = "open";
  const close = "close";
  const dispatch = useDispatch();
  const long = { color: "green" };
  const short = { color: "red" };

  function handleClose() {
    dispatch(priorTradeModal(close));
  }

  function newPos(e) {
    if (e === "BUY") {
      dispatch(
        trade({
          action: e,
          ticker: ticker.toUpperCase(),
          quantity: 0 + quantity / 1,
          price: price,
          tradeTotal: price * quantity,
          direction: "LONG",
        })
      );
    } else if (e === "SELL") {
      dispatch(
        trade({
          action: e,
          ticker: ticker.toUpperCase(),
          quantity: 0 - quantity,
          price: price,
          tradeTotal: price * quantity,
          direction: "SHORT",
        })
      );
    }

    handleClose();
  }

  return (
    <section className="add-position-wrapper">
      <div className="add-position-form" id="prior-trade-form">
        <IoIosClose id="close-add-position" onClick={handleClose} />
        <div className="trade-info">
          <h1>Current Position</h1>
          <h2>{tradeInfo.ticker}</h2>
          <h4>{tradeInfo.direction}</h4>
          <h4>shares: {tradeInfo.quantity}</h4>
          <h4>Average Price: {money.format(tradeInfo.price)}</h4>
        </div>
        <label>Quantity:</label>
        <input
          type="number"
          required
          id="quantity"
          onChange={(e) => setQuantity(e.target.value)}
          value={quantity}
        />
        <label>Trade Price:</label>
        <input
          type="number"
          step={"0.01"}
          required
          id="Price"
          onChange={(e) => setPrice(e.target.value)}
          value={price}
        />
        <div className="add-position-btn">
          <button id="buy" key="BUY" onClick={(e) => newPos("BUY")}>
            BUY
          </button>
          <button id="sell" key="SELL" onClick={(e) => newPos("SELL")}>
            SELL
          </button>
        </div>
      </div>
    </section>
  );
};

export default PriorTradeModal;
