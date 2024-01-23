import { useSelector } from "react-redux";
import "./App.css";
import Positions from "./Components/pages/Positions";
import CompanyPage from "./Components/pages/CompanyPage";
import AddPositionModal from "./Components/AddPositionModal";
import BalanceModal from "./Components/BalanceModal";
import PriorTradeModal from "./Components/priorTradeModal";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Valuation from "./Components/pages/Valuation";
import Home from "./Components/pages/Home";

function App() {
  const addPosition = useSelector((state) => state.display.trading);
  const balanceModal = useSelector((state) => state.display.balance);
  const priorTrade = useSelector((state) => state.display.priorTrade);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/positions" element={<Positions />} />
          <Route path="/" element={<Home />} />
          <Route path="/company/:search" element={<CompanyPage />} />
          <Route path="/valuation/:search" element={<Valuation />} />
        </Routes>
      </BrowserRouter>

      {addPosition && <AddPositionModal />}
      {balanceModal && <BalanceModal />}
      {priorTrade && <PriorTradeModal />}
    </>
  );
}

export default App;
