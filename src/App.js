import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MintPage from "./screens/MintPage";
import Main from "./screens/Main";
import { AdminBamboo } from "./screens/AdminBamboo";
import { VerifyBamboo } from "./screens/VerifyBamboo";
import { CheckWhiteList } from "./screens/CheckWhiteList";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Main></Main>}></Route>
          <Route path="/MintTest" element={<MintPage></MintPage>}></Route>
          <Route
            path="/AdminBamboo"
            element={<AdminBamboo></AdminBamboo>}
          ></Route>
          <Route
            path="/VerifyBamboo"
            element={<VerifyBamboo></VerifyBamboo>}
          ></Route>
          <Route
            path="/CheckWhiteList"
            element={<CheckWhiteList></CheckWhiteList>}
          ></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
