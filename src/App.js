import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MintPage from "./screens/MintPage";
import Main from "./screens/Main";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Main></Main>}></Route>
          <Route path="/MintTest" element={<MintPage></MintPage>}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
