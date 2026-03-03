import { BrowserRouter, Routes, Route } from "react-router-dom";
import AccountList from "./pages/AccountList";
import AccountDetail from "./pages/AccountDetail";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AccountList />} />
        <Route path="/account/:id" element={<AccountDetail />} />
      </Routes>
    </BrowserRouter>
  );
}