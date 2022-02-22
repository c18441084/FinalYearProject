import db2, {logout, getDownloadURL} from "../../firebaseconfig";
import './Found.css'
import { useState, useEffect } from "react";

export default function Found(){

    const [posts, setPosts] = useState([]);

    const db = db2.ref("Posts");

    function reportFoundPet(){
        window.location = "/found-pet-details";
    }

    useEffect(() => {
        db.on("value", (snapshot)=>{
            const postsFromDatabase = snapshot.val();

            const postsArray = [];
            for(let id in postsFromDatabase){
                postsArray.push({id, ...postsFromDatabase[id]});
            }
            setPosts(postsArray);
        })
        console.log(posts);
    }, [])


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

            <div>
                {posts.map(function(element){
                    return(
                        <div id="showingPosts">
                            <div>{element.dogBreed}</div>
                            <img src={element.image}></img>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}