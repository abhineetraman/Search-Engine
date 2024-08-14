import logo from './logo.svg';
import './App.css';
import Login from './components/login';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { HashRouter, BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './components/home';


function App() {
  //dynamic typic

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<Login />}></Route>
          <Route path="/" element={<Home />}></Route>
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
