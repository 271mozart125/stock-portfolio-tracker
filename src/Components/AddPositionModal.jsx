import { IoIosClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { trader } from "../redux/slices/displaySlice";
import { useState } from "react";
import { trade } from "../redux/slices/accountSlice";

const AddPositionModal = () => {
  const [ticker, setTicker] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const open = "open";
  const close = "close";
  const dispatch = useDispatch();

  function handleClose() {
    dispatch(trader(close));
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
      <div className="add-position-form">
        <IoIosClose id="close-add-position" onClick={handleClose} />
        <label>Ticker:</label>
        <input
          type="text"
          id="ticker"
          onChange={(e) => setTicker(e.target.value)}
          value={ticker}
          required
        />
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
          <button
            id="buy"
            key="BUY"
            type="submit"
            onClick={(e) => newPos("BUY")}
          >
            BUY
          </button>
          <button
            id="sell"
            type="submit"
            key="SELL"
            onClick={(e) => newPos("SELL")}
          >
            SELL
          </button>
        </div>
      </div>
    </section>
  );
};

export default AddPositionModal;
