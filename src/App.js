import logo from './logo.svg';
import './App.css';
import Homepage from './Components/Homepage/Homepage';
import Found from './Components/Found/Found';
import { Routes, Route, BrowserRouter } from 'react-router-dom';


function App() {

  return (
   <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<Homepage />} />
        <Route exact path = "/Found" element = {<Found />} />
      </Routes>
    </BrowserRouter>
  </div>


  );
}

export default App;
