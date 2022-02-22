import db2, {logout, getDownloadURL} from "../../firebaseconfig";
import './Found.css'
import { useState, useEffect } from "react";
import { resolvePath } from "react-router-dom";

export default function Found(){

    const [posts, setPosts] = useState([]);

    const [practiseImage, setPractiseImage] = useState([]);

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

        const array = []
        posts.map(function(element){
            array[element] = element;
            console.log(array[element]);
            let img = URL.createObjectURL(array[element].fileImagePic);
            let pic = new Image()
            pic.onload = () => {
                URL.revokeObjectURL(img);
                resolvePath(pic);
            }
            pic.src = img;
            array[element].fileImagePic = pic.src;
            console.log(array[element].fileImagePic)
        })

        setPosts(array);
        console.log(posts);
        //changingImage();

    }, [])

    async function changingImage(){
        posts.map(function(element){
            const imageURL = getDownloadURL(element.fileImagePic);
            console.log(imageURL);
            setPractiseImage[element] = imageURL;
        })
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

            <div>
                {posts.map(function(element){
                    return(
                        <div id="showingPosts">
                            <img src={element.fileImagePic}></img>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}