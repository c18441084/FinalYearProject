import db2, {logout, getDownloadURL, ref} from "../../firebaseconfig";
import './Found.css'
import { useState, useEffect } from "react";
import { Button, Modal, Dropdown, DropdownButton, Navbar, Nav, Container } from "react-bootstrap";
import ReactTooltip from 'react-tooltip';
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth } from '../../firebaseconfig';
import settingsIcon from "../../SettingsIcon.png";
import { mdiCommentText } from '@mdi/js';
import { mdiCommentTextMultiple } from '@mdi/js';
import { mdiCardsHeartOutline } from '@mdi/js';
import Icon from '@mdi/react'


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
    const handleShow = async (id) => {
        console.log("id: " +id);
        setShow(true);
        setAddingCommentClicked(id);
    };
  
    function home(){
        window.location = "/home";
    }

    function myAccount(){
        window.location = "/account";
    }

    async function addingComment(){
        let postID = 0;
        console.log(addingCommentClicked);
        const dbcomments = db2.ref(`Posts/${addingCommentClicked}/comments`);
        db2.ref(`Posts/${addingCommentClicked}`).once("value", snap => {
            const infoFromPost = snap.val();
            console.log(infoFromPost);
            postID = infoFromPost.postID;
            console.log("postId: " + postID)
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
        console.log(submit.commenterName);
        console.log(submit.email);
        console.log(submit.comment);
        console.log(submit.commentTime);
        console.log(submit.postID);
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

    function addFavourites(id){
        console.log(id);
        const favouriteName = auth.currentUser.displayName;
        const favouriteEmail = auth.currentUser.email;
        const dbfavourites = db2.ref(`Posts/${id}/favourites`);
        const submit = {
            name: favouriteName,
            email: favouriteEmail
        }
        let alreadyinFavs = 0;
        dbfavourites.on("value", (snap) => {
            const data = snap.val();
            for(let id2 in data){
                const favRef = db2.ref(`Posts/${id}/favourites/${id2}`);
                favRef.on("value", (snapshot) => {
                    const email = snapshot.val();
                    console.log(email.email);
                    if(email.email == submit.email){
                        alreadyinFavs = 1;
                    }
                })
            }
        })
        if(alreadyinFavs === 0){
            dbfavourites.push(submit);
            alert("Added to Favourites");
        }
        else{
            alert("Already added to favourites");
        }
    }

    function filter(item){
        console.log(item)
        if(item == "reset"){
            db.on("value", (snapshot)=>{
                const postsFromDatabase = snapshot.val();
    
                const postsArray = [];
                for(let id in postsFromDatabase){
                    postsArray.push({id, ...postsFromDatabase[id]});
                }
                setPosts(postsArray);
            })
        }
        else{
            let filter = db2.ref(`Posts`);
            filter.on("value", (snap) => {
                const postsFromDatabase = snap.val();
                const filteredArray = [];
                for(let id in postsFromDatabase){
                    const type = db2.ref(`Posts/${id}/type`)
                    type.on("value", (snap) => {
                        const typeValue = snap.val();
                        if(typeValue == item){
                            filteredArray.push({id, ...postsFromDatabase[id]})
                        }
                    })
                }
                setPosts(filteredArray);
            })
        }

        console.log(posts);
    }

    return(
        <div>
            <title>FindMyOwner</title>
            <div id = "Title">
                <h1 id="titleName" href="#" onClick={home}>FindMyOwner</h1>
                <Dropdown id="SettingsButton">
                    <Dropdown.Toggle id="dropdown-button-dark-example1" variant="warning">
                        <img id="imageSettingsIcon" src={settingsIcon}></img>
                    </Dropdown.Toggle>

                    <Dropdown.Menu variant="dark">
                        <Dropdown.Item href="#" onClick={myAccount}>My Account</Dropdown.Item>
                        <Dropdown.Divider></Dropdown.Divider>
                        <Dropdown.Item href="#" onClick={logout}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <div>
                <button id = "reportFoundPet" onClick = {reportFoundPet}>I found a stray</button>
                <Dropdown id="filter">
                    <Dropdown.Toggle id="dropdown-button-dark-example1" variant="success">
                        <h5>Filter</h5>
                    </Dropdown.Toggle>

                    <Dropdown.Menu variant="dark">
                        <DropdownButton id="dropdown-button-dark-example2" variant="dark" style={{color: "white"}} drop="end" title="Animal">
                            <Dropdown.Item  eventKey="1" style={{color: "black"}} onClick={() => filter("dog")}>Dog</Dropdown.Item>
                            <Dropdown.Item variant="dark" style={{color: "black"}} eventKey="2" onClick={() => filter("cat")}>Cat</Dropdown.Item>
                            <Dropdown.Item variant="dark" style={{color: "black"}} eventKey="3" onClick={() => filter("other")}>Other</Dropdown.Item>
                        </DropdownButton>
                        <DropdownButton id="dropdown-button-dark-example3" variant="dark" style={{color: "white"}} drop="end" title="Colour">
                            <Dropdown.Item  eventKey="1" style={{color: "black"}} onClick={() => filter("brown")}>Brown</Dropdown.Item>
                            <Dropdown.Item variant="dark" style={{color: "black"}} eventKey="2" onClick={() => filter("Black")}>Black</Dropdown.Item>
                            <Dropdown.Item variant="dark" style={{color: "black"}} eventKey="3" onClick={() => filter("white")}>White</Dropdown.Item>
                        </DropdownButton>
                        <Dropdown.Divider></Dropdown.Divider>
                        <Dropdown.Item href="#"  onClick={() => filter("reset")}>Reset</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            <div>
                {posts.map(function(post){
                    return(
                        <div id="showingPosts">
                            {posts.length === 0? <div id="noPosts"><h3>No posts</h3></div>:null}
                            <img id="postImage" src={post.image}></img>
                            <div id="info">
                                <div id="postTime">Posted by {post.posterName} at {post.postTime}</div>
                                <div id="postType"><h3 style={{display: "inline"}}>Type: </h3>{post.type}</div>
                                {post.dogBreed != null?<div id="postBreed"><h3 style={{display: "inline"}}>Breed: </h3>{post.dogBreed}</div>: null}
                                <div id="postHeight"><h3 style={{display: "inline"}}>Height: </h3>{post.height}cm</div>
                                <div id="postColour"><h3 style={{display: "inline"}}>Colour: </h3>{post.colour}</div>
                                <div id="postNeutured"><h3 style={{display: "inline"}}>The animal is: </h3>{post.neutured}</div>
                                <Button data-tip data-for="addComment" id={post.id} variant="outline-primary" onClick={() => handleShow(post.id)}>
                                    <Icon path={mdiCommentText} size={1}></Icon>                        
                                </Button>
                                <ReactTooltip id="addComment" place="top" effect="solid">Add Comment</ReactTooltip>  

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
                                    <div style={{display: "inline"}}>
                                        <Button data-tip data-for="showComment" id={post.id} variant="outline-primary" onClick={() => showComments(post.id)}>
                                            <Icon path={mdiCommentTextMultiple} size={1}></Icon>
                                        </Button>
                                        <ReactTooltip id="showComment" place="top" effect="solid">View Comments</ReactTooltip>
                                    </div>
                                :null}
                                <Button data-tip data-for="addFavourites" variant="outline-danger" id={post.id} onClick={() => addFavourites(post.id)}>
                                    <Icon path={mdiCardsHeartOutline} size={1}></Icon>
                                </Button>
                                <ReactTooltip id="addFavourites" place="top" effect="solid">Add to Favourites</ReactTooltip>
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
                })}
            </div>
        </div>
    )
}