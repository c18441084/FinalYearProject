//import react from "react";
import './Homepage.css'

export default function Homepage(){

    return(
        <div>
            <title>FindMyOwner</title>
            <div id = "Title">
                <h1>FindMyOwner</h1>
            </div>
            <div id = "sidebar">
                <a href = "/Found">
                    <h2>Found Pets</h2>
                </a>
                <a href = "#">
                    <h2>Lost Pets</h2>
                </a>
                <a href = "#">
                    <h2>About Us</h2>
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