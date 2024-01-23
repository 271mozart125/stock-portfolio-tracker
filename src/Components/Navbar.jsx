import { RiStockFill } from "react-icons/ri";
import { FaRegNewspaper } from "react-icons/fa6";

import { GiBuyCard } from "react-icons/gi";
import { useDispatch } from "react-redux";
import { trader } from "../redux/slices/displaySlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const open = "open";
  const dispatch = useDispatch();
  const [ticker, setTicker] = useState("");
  const navigate = useNavigate();

  function handleOpen() {
    dispatch(trader(open));
  }
  return (
    <nav className="nav-bar">
      <h1>
        <a href="">Portfolio.</a>
      </h1>
      <form
        onSubmit={(e) => navigate("/company/" + ticker)}
        className="search-bar"
      >
        <input
          className="search"
          type="text"
          value={ticker}
          required
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
        />
        <button type="submit" className="search-btn">
          Search
        </button>
      </form>

      <div className="nav-links" id="navLinks">
        <ul>
          <li>
            <a href="/" className="mobile">
              <FaRegNewspaper />
            </a>
            <a href="/" className="desktop">
              News
            </a>
          </li>
          <li>
            <a className="mobile" id="trade">
              <GiBuyCard onClick={handleOpen} />
            </a>
            <a id="desktop-trade" className="desktop" onClick={handleOpen}>
              Trade
            </a>
          </li>
          <li>
            <a href="/positions" className="mobile">
              <RiStockFill />
            </a>
            <a href="/positions" className="desktop">
              Positions
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
