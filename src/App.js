import logo from './logo.svg';
import './App.css';
import Login from './Components/Login/Login'
import Homepage from './Components/Homepage/Homepage';
import Found from './Components/Found/Found';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className ='app'>
      <BrowserRouter>
        <Routes>
          <Route path = "/" element = {<Login />} />
          <Route path = "/found" element = {<Found />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
