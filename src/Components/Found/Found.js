import { logout } from "../../firebaseconfig";
import './Found.css'

export default function Found(){

    function reportFoundPet(){
        window.location = "/found-pet-details";
    }

    return(
        <div>
            <title>FindMyOwner</title>
            <div id = "Title">
                <h1>FindMyOwner</h1>
                <button id = "logout" onClick = {logout} >Log out</button>
            </div>
            <div>
                <button id = "reportFoundPet" onClick = {reportFoundPet}>I found a stray</button>
            </div>
        </div>
    )
}