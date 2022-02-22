import logo from './logo.svg';
import './App.css';
import Login from './Components/Login/Login'
import Homepage from './Components/Homepage/Homepage';
import Found from './Components/Found/Found';
import Register from './Components/Register/Register'
import FoundPetDetails from './Components/FoundPetDetails/FoundPetDetails'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "./firebaseconfig";

function App() {

  const [user] = useAuthState(auth);

  //console.log(user);


  return (
    <div className ='app'>
      <BrowserRouter>
      {user == null? 
      <Routes>
        <Route path = "/" element = {<Login />} />
        <Route path = "/register" element = {<Register />} />
      </Routes>
      :
      <Routes>
        <Route path = "/home" element = {<Homepage />} />
        <Route path = "/found" element = {<Found />} />
        <Route path = "/found-pet-details" element = {<FoundPetDetails />} />
      </Routes>
    }
      </BrowserRouter>
    </div>
  );
}

export default App;
