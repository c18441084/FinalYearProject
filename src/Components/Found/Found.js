import db2, {logout, getDownloadURL, ref} from "../../firebaseconfig";
import './Found.css'
import { useState, useEffect } from "react";
import { Button, Modal, Dropdown } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth } from '../../firebaseconfig';
import settingsIcon from "../../SettingsIcon.png";


export default function Found(){

    const [posts, setPosts] = useState([]);
    const [show, setShow] = useState(false);
    const [comment, setComment] = useState("");
    const [showingComments, setShowingComments] = useState([]); 
    const [displayComments, setDisplayComments] = useState(false);
    const [addingCommentClicked, setAddingCommentClicked] = useState(0);

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

    const handleClose = () => setShow(false);
    const handleShow = (id) => {
        setShow(true)
        setAddingCommentClicked(id);
    };
  
    function home(){
        window.location = "/home";
    }

    async function addingComment(){
        let postID = 0;
        console.log(addingCommentClicked);
        const dbcomments = db2.ref(`Posts/${addingCommentClicked}/comments`);
        db2.ref(`Posts/${addingCommentClicked}`).once("value", snap => {
            const infoFromPost = snap.val();
            postID = infoFromPost.postID;
        })
        const commenterName = auth.currentUser.displayName;
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
            commenterName,
            email, 
            comment,
            commentTime,
            postID,
        }
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
                <h1 id="titleName" href="#" onClick={home}>FindMyOwner</h1>
                {/*<button id = "logout" onClick = {logout} >Log out</button>*/}
                <Dropdown>
                    <Dropdown.Toggle style={{height: "20%", width: "5%", marginBottom: "5%", float: "right"}} id="dropdown-button-dark-example1" variant="warning">
                        <img id="imageSettingsIcon" src={settingsIcon}></img>
                    </Dropdown.Toggle>
                </Dropdown>
            </div>
            <div>
                <button id = "reportFoundPet" onClick = {reportFoundPet}>I found a stray</button>
            </div>

            <div>
                {posts.map(function(post){
                    if(post.dogBreed != null){
                        return(
                            <div id="showingPosts">
                                <img id="postImage" src={post.image}></img>
                                <div id="info">
                                    <div id="postTime">Posted by {post.posterName} at {post.postTime}</div>
                                    <div id="postType"><h3 style={{display: "inline"}}>Type: </h3>{post.type}</div>
                                    <div id="postBreed"><h3 style={{display: "inline"}}>Breed: </h3>{post.dogBreed}</div>
                                    <div id="postHeight"><h3 style={{display: "inline"}}>Height: </h3>{post.height}cm</div>
                                    <div id="postColour"><h3 style={{display: "inline"}}>Colour: </h3>{post.colour}</div>
                                    <div id="postNeutured"><h3 style={{display: "inline"}}>The animal is: </h3>{post.neutured}</div>
                                    <Button id={post.id} variant="primary" onClick={(element) => handleShow(element.target.id)}>
                                        Add Comment
                                    </Button>
    
                                    <Modal show={show} onHide={handleClose}>
                                        <Modal.Header style={{background: "#F0F0F0"}}>
                                        <Modal.Title>Comment Below</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body><textarea id="commentBox" commenterName="commentBox" onChange={(e) => setComment(e.target.value)}></textarea></Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={() => addingComment()}>
                                                Submit
                                            </Button>
                                            <Button variant="primary" onClick={handleClose}>
                                                Close
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                    {post.comments != null?
                                        <div>
                                            <button id="commentsButton showCommentsButton" onClick={() => showComments(post.id)}>Show Comments</button>
                                        </div>
                                    :null}
                                    {displayComments?
                                        <div>
                                            {showingComments.map(function(comment){
                                                if(post.postID == comment.postID){
                                                    return(
                                                        <div>
                                                            <button id="commentsButton closeCommentsButton" onClick = {() => closeComments()}>Close Comments</button>
                                                            <br />
                                                            <br />
                                                            <div id="comment">
                                                                <b id="commentUser">{comment.commenterName}: </b>
                                                                <p id="commentInfo">{comment.comment}<p id="commentTime">Commented on {comment.commentTime}</p></p>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            })}
                                        </div>
                                    :null}
                                </div>
                            </div>
                        )
                    }
                    else{
                        return(
                            <div id="showingPosts">
                                <img id="postImage" src={post.image}></img>
                                <div id="info">
                                    <div id="postTime">Posted by {post.posterName} at {post.postTime}</div>
                                    <div id="postType"><h3 style={{display: "inline"}}>Type: </h3>{post.type}</div>
                                    <div id="postHeight"><h3 style={{display: "inline"}}>Height: </h3>{post.height}cm</div>
                                    <div id="postColour"><h3 style={{display: "inline"}}>Colour: </h3>{post.colour}</div>
                                    <div id="postNeutured"><h3 style={{display: "inline"}}>The animal is: </h3>{post.neutured}</div>
                                    <Button id={post.id} variant="primary" onClick={(element) => handleShow(element.target.id)}>
                                        Add Comment
                                    </Button>
    
                                    <Modal show={show} onHide={handleClose}>
                                        <Modal.Header style={{background: "#F0F0F0"}}>
                                        <Modal.Title>Comment Below</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body><textarea id="commentBox" commenterName="commentBox" onChange={(e) => setComment(e.target.value)}></textarea></Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={() => addingComment()}>
                                                Submit
                                            </Button>
                                            <Button variant="primary" onClick={handleClose}>
                                                Close
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                    {post.comments != null?
                                        <div>
                                            <button id="commentsButton showCommentsButton" onClick={() => showComments(post.id)}>Show Comments</button>
                                        </div>
                                    :null}
                                    {displayComments?
                                        <div>
                                            {showingComments.map(function(comment){
                                                if(post.postID == comment.postID){
                                                    return(
                                                        <div>
                                                            <button id="commentsButton closeCommentsButton" onClick = {() => closeComments()}>Close Comments</button>
                                                            <br />
                                                            <br />
                                                            <div id="comment">
                                                                <b id="commentUser">{comment.commenterName}: </b>
                                                                <p id="commentInfo">{comment.comment}<p id="commentTime">Commented on {comment.commentTime}</p></p>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            })}
                                        </div>
                                    :null}
                                </div>
                            </div>
                        )
                    }
                    /*return(
                        <div id="showingPosts">
                            <img id="postImage" src={post.image}></img>
                            <div id="info">
                                <div id="postTime">Posted by {post.posterName} at {post.postTime}</div>
                                <div id="postType"><h3 style={{display: "inline"}}>Type: </h3>{post.type}</div>
                                <div id="postBreed"><h3 style={{display: "inline"}}>Breed: </h3>{post.dogBreed}</div>
                                <div id="postHeight"><h3 style={{display: "inline"}}>Height: </h3>{post.height}cm</div>
                                <div id="postColour"><h3 style={{display: "inline"}}>Colour: </h3>{post.colour}</div>
                                <div id="postNeutured"><h3 style={{display: "inline"}}>The animal is: </h3>{post.neutured}</div>
                                <Button id={post.id} variant="primary" onClick={(element) => handleShow(element.target.id)}>
                                    Add Comment
                                </Button>

                                <Modal show={show} onHide={handleClose}>
                                    <Modal.Header style={{background: "#F0F0F0"}}>
                                    <Modal.Title>Comment Below</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body><textarea id="commentBox" commenterName="commentBox" onChange={(e) => setComment(e.target.value)}></textarea></Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => addingComment()}>
                                            Submit
                                        </Button>
                                        <Button variant="primary" onClick={handleClose}>
                                            Close
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                                {post.comments != null?
                                    <div>
                                        <button id="commentsButton showCommentsButton" onClick={() => showComments(post.id)}>Show Comments</button>
                                    </div>
                                :null}
                                {displayComments?
                                    <div>
                                        {showingComments.map(function(comment){
                                            if(post.postID == comment.postID){
                                                return(
                                                    <div>
                                                        <button id="commentsButton closeCommentsButton" onClick = {() => closeComments()}>Close Comments</button>
                                                        <br />
                                                        <br />
                                                        <div id="comment">
                                                            <b id="commentUser">{comment.commenterName}: </b>
                                                            <p id="commentInfo">{comment.comment}<p id="commentTime">Commented on {comment.commentTime}</p></p>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })}
                                    </div>
                                :null}
                            </div>
                        </div>
                    )*/
                })}
            </div>
        </div>
    )
}