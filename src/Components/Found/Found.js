import { logout } from "../../firebaseconfig";
import './Found.css'

export default function Found(){
    return(
        <div>
            <title>FindMyOwner</title>
            <div id = "Title">
                <h1>FindMyOwner</h1>
                <button id = "logout" onClick = {logout} >Log out</button>
            </div>
        </div>
    )
}