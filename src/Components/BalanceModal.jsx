import { IoIosClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { PiCaretUpDown } from "react-icons/pi";
import { balanceModal } from "../redux/slices/displaySlice";
import { balanceAdjust } from "../redux/slices/accountSlice";

const BalanceModal = () => {
  const [ticker, setTicker] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [toggle, setToggle] = useState(true);

  const open = "open";
  const close = "close";
  const dispatch = useDispatch();

  function handleClose() {
    dispatch(balanceModal(close));
  }

  function handleToggle() {
    setToggle((value) => !value);
  }

  function submit() {
    const adjust = document.getElementById("toggle").textContent;
    dispatch(
      balanceAdjust({
        type: adjust,
        amount: price,
      })
    );
    handleClose();
  }

  return (
    <section className="add-position-wrapper">
      <div className="add-position-form" id="balance-modal">
        <IoIosClose id="close-add-position" onClick={handleClose} />
        <label>Action:</label>
        <div className="action">
          <p id="toggle">{toggle ? "DEPOSIT" : "WITHDRAWL"}</p>
          <PiCaretUpDown id="chevron" onClick={handleToggle} />
        </div>
        <label>Amount:</label>
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
            className="balance-btn"
            id="buy"
            key="deposit"
            onClick={submit}
          >
            Submit
          </button>
        </div>
      </div>
    </section>
  );
};
export default BalanceModal;
