//import react from "react";
import './Homepage.css'
import { logout } from "../../firebaseconfig";

export default function Homepage(){

    function found(){
        window.location = "/found";
    }

    return(
        <div>
            <title>FindMyOwner</title>
            <div id = "Title">
                <h1>FindMyOwner</h1>
                <button id = "logout" onClick = {logout} >Log out</button>
            </div>
            <div id = "sidebar">
                <button id = "found" onClick={found}>
                    <h2>Found Pets</h2>
                </button>
                <a href = "#">
                    <h2>Lost Pets</h2>
                </a>
                <a href = "#">
                    <h2>Pet Clinics</h2>
                </a>
                <a href = "#">
                    <h2 id = "DWS">Dog Warden Service</h2>
                </a>
            </div>
            <div id = "topbar">
                <h3 id = "RP">Recent Posts</h3>
                <h3 id = "PNM">Posts near me</h3>
            </div>
            <div id = "RecentPosts">
                
            </div>
            <div id = "PostsNearMe">

            </div>
        </div>
    )
}