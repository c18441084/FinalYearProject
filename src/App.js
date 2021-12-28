import logo from './logo.svg';
import './App.css';
import Homepage from './Components/Homepage/Homepage';
import Found from './Components/Found/Found';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className ='app'>
      <BrowserRouter>
        <Routes>
          <Route path = "/" element = {<Homepage />} />
          <Route path = "/found" element = {<Found />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
