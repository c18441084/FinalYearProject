import db2, {logout, getDownloadURL} from "../../firebaseconfig";
import './Found.css'
import { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { Module } from "webpack";

export default function Found(){

    const [posts, setPosts] = useState([]);
    const [showCommentTextArea, setShowCommentTextArea] = useState(false);

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

    function addComment(){
        setShowCommentTextArea(true);
    }

    function addingComment(id){
        console.log(id);
        console.log("worked");
        //setShowCommentTextArea(true);
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
                            <img id="postImage" src={element.image}></img>
                            <div id="info">
                                <div id="postType"><h3 style={{display: "inline"}}>Type: </h3>{element.type}</div>
                                <div id="postBreed"><h3 style={{display: "inline"}}>Breed: </h3>{element.dogBreed}</div>
                                <div id="postHeight"><h3 style={{display: "inline"}}>Height: </h3>{element.height}cm</div>
                                <div id="postColour"><h3 style={{display: "inline"}}>Colour: </h3>{element.colour}</div>
                                <div id="postNeutured"><h3 style={{display: "inline"}}>The animal is: </h3>{element.neutured}</div>
                                <button id="comment" onClick={() => addingComment(element.id)}>Add Comment</button>
                                <Button onClick={() => addComment}>Add Comment</Button>
                                <Modal show={showCommentTextArea} >
                                    <Modal.Header>Comment Below</Modal.Header>
                                    <Modal.Body><textarea id="comment" name="comment"></textarea></Modal.Body>
                                    <Module.Footer>
                                        <button onClick={() => addingComment(element.id)}></button>
                                    </Module.Footer>
                                </Modal>
                                
                            </div>
                        </div>
                    )
                })}
            </div>

            {/*{showCommentTextArea?
                <div>
                    <button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#myModal">Open Modal</button>

                    <div id="myModal" class="modal fade" role="dialog">
                    <div class="modal-dialog">

                        <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                            <h4 class="modal-title">Modal Header</h4>
                        </div>
                        <div class="modal-body">
                            <p>Some text in the modal.</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                        </div>

                    </div>
                    </div>
                </div>
            :null}*/}
        </div>
    )
}