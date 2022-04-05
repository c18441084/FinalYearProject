import logo from './logo.svg';
import './App.css';
import Login from './Components/Login/Login';
import Homepage from './Components/Homepage/Homepage';
import Found from './Components/Found/Found';
import Lost from './Components/Lost/Lost';
import FoundPetDetails from './Components/FoundPetDetails/FoundPetDetails';
import MyAccount from './Components/MyAccount/MyAccount';
import DogWardenService from './Components/DogWardenService/DogWardenService';
import PostInfo from './Components/PostInfo/PostInfo'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "./firebaseconfig";

function App() {

  const [user] = useAuthState(auth);
  console.log(user);

  return (
    <div className ='app'>
      <BrowserRouter>
      {user === null? 
      <Routes>
        <Route path = "/FindMyOwner/login" element = {<Login />} />
      </Routes>
      :
      <Routes>
        <Route path = "/FindMyOwner/home" element = {<Homepage />} />
        <Route path = "/FindMyOwner/found" element = {<Found />} />
        <Route path = "/FindMyOwner/lost" element = {<Lost />} />
        <Route path = "/FindMyOwner/report-pet-details" element = {<FoundPetDetails />} />
        <Route path = "/FindMyOwner/account" element = {<MyAccount />} />
        <Route path = "/FindMyOwner/dog-warden-service" element={<DogWardenService />} />
        <Route path = "/FindMyOwner/post/:id" element={<PostInfo />} />
      </Routes>
    }
      </BrowserRouter>
    </div>
  );
}

export default App;