import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MatchBrowserPage from "./pages/MatchBrowserPage";
import MatchDetailsPage from "./pages/MatchDetailsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/matches" element={<MatchBrowserPage />} />
        <Route path="/match/:id" element={<MatchDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
