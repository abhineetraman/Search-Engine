import './App.css';
import Login from './components/login';

import { HashRouter, BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './components/home';
import Signup from './components/signup';


function App() {
  //dynamic typic

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
