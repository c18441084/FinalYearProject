import logo from './logo.svg';
import './App.css';
import Login from './Components/Login/Login'
import Homepage from './Components/Homepage/Homepage';
import Found from './Components/Found/Found';
import Register from './Components/Register/Register'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "./firebaseconfig";

function App() {

  //const [user] = useAuthState(auth);

  return (
    <div className ='app'>
      <BrowserRouter>
        <Routes>
          <Route path = "/" element = {<Login />} />
          <Route path = "/register" element = {<Register />} />
          <Route path = "/home" element = {<Homepage />} />
          <Route path = "/found" element = {<Found />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
