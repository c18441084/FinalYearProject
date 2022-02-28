import db2, {logout, getDownloadURL, ref} from "../../firebaseconfig";
import './Found.css'
import { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth } from '../../firebaseconfig';

export default function Found(){

    const [posts, setPosts] = useState([]);
    const [comment, setComment] = useState("");
    const [showingComments, setShowingComments] = useState([]); 
    const [displayComments, setDisplayComments] = useState(false);

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
    }, [])

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  

    async function addingComment(id){
        const dbcomments = db2.ref(`Posts/${id}/comments`)
        //setName(auth.currentUser.displayName);
        const name = auth.currentUser.displayName;
        const email = auth.currentUser.email;
        const date = Date().toLocaleString();
        const datesplit = date.split(" ");
        const day = datesplit[2];
        const month = datesplit[1];
        const timeSeconds = datesplit[4];
        const timesplit = timeSeconds.split(":");
        const time = (timesplit[0]+":"+timesplit[1]);
        const commentTime = time+" "+day+"th "+month;
        const submit = {
            name,
            email, 
            comment,
            commentTime
        }
        console.log(name);
        await dbcomments.push(submit);
        handleClose();
    }

    async function showComments(id){
        const dbcomments = db2.ref(`Posts/${id}/comments`);
        dbcomments.on("value", (snapshot)=>{
            const commentsFromDatabase = snapshot.val();
            const commentsArray = [];
            for(let id in commentsFromDatabase){
                commentsArray.push(commentsFromDatabase[id]);
            }
            setShowingComments(commentsArray);
            //console.log(commentsArray);
        })
        setDisplayComments(true);
    }

    function closeComments(){
        setDisplayComments(false);
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
                                <div id="postTime">{element.postTime}</div>
                                <div id="postType"><h3 style={{display: "inline"}}>Type: </h3>{element.type}</div>
                                <div id="postBreed"><h3 style={{display: "inline"}}>Breed: </h3>{element.dogBreed}</div>
                                <div id="postHeight"><h3 style={{display: "inline"}}>Height: </h3>{element.height}cm</div>
                                <div id="postColour"><h3 style={{display: "inline"}}>Colour: </h3>{element.colour}</div>
                                <div id="postNeutured"><h3 style={{display: "inline"}}>The animal is: </h3>{element.neutured}</div>
                                <Button variant="primary" onClick={handleShow}>
                                    Add Comment
                                </Button>

                                <Modal show={show} onHide={handleClose}>
                                    <Modal.Header style={{background: "#F0F0F0"}}>
                                    <Modal.Title>Comment Below</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body><textarea id="commentBox" name="commentBox" onChange={(e) => setComment(e.target.value)}></textarea></Modal.Body>
                                    <Modal.Footer>
                                    <Button variant="secondary" onClick={() => addingComment(element.id)}>
                                        Submit
                                    </Button>
                                    <Button variant="primary" onClick={handleClose}>
                                        Close
                                    </Button>
                                    </Modal.Footer>
                                </Modal>
                                {element.comments != null?
                                    <div>
                                        <button id="commentsButton showCommentsButton" onClick={() => showComments(element.id)}>Show Comments</button>
                                    </div>
                                :null}
                                {displayComments?
                                    <div>
                                        <button id="commentsButton closeCommentsButton" onClick = {() => closeComments()}>Close Comments</button>
                                        <br />
                                        <br />

                                        {showingComments.map(function(element){
                                            return(
                                                <div id="comment">
                                                    <b id="commentUser">{element.name}: </b>
                                                    <p id="commentInfo">{element.comment}<p id="commentTime">Commented on {element.commentTime}</p></p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                :null}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}