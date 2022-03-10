import { logout } from "../../firebaseconfig";
import { Button, Modal, Dropdown } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactTooltip from 'react-tooltip';
import settingsIcon from "../../SettingsIcon.png";
import { useEffect, useState } from "react";
import db2, { auth } from "../../firebaseconfig";
import { mdiCommentText } from '@mdi/js';
import { mdiCommentTextMultiple } from '@mdi/js';
import { mdiCardsHeartOutline } from '@mdi/js';
import Icon from '@mdi/react';
import "./MyAccount.css";

export default function MyAccount(){

    const [usersPosts, setUsersPosts] = useState([]);
    const [tempArray, setTempArray] = useState([]);
    const [commentsPosts, setCommentsPosts] = useState([]);
    const [show, setShow] = useState(false);
    const [addingCommentClicked, setAddingCommentClicked] = useState(0);
    const [comment, setComment] = useState("");
    const [showingComments, setShowingComments] = useState([]); 
    const [displayComments, setDisplayComments] = useState(false);

    const dbUser = db2.ref(`Posts`);

    useEffect(() => {
        const emails = auth.currentUser.email;
        dbUser.on("value", (snap) => {
            const postsFromDatabase = snap.val();
            const postsArray = [];
            for(let id in postsFromDatabase){
                const checkPost = db2.ref(`Posts/${id}/posterEmail`);
                checkPost.on("value", (snap) => {
                    const postEmail = snap.val();
                    if(postEmail ===  emails){
                        postsArray.push({id, ...postsFromDatabase[id]});
                    }
                })
            }
            setUsersPosts(postsArray);
        }); 

        dbUser.on("value", (snap) => {
            const commentsFromDatabase = snap.val();
            const commentsArray = [];
            for(let id in commentsFromDatabase){
                const getcomment = db2.ref(`Posts/${id}/comments`);
                getcomment.on("value", (snap) => {
                    const comments = snap.val();
                    for(let commentid in comments){
                        const getemail = db2.ref(`Posts/${id}/comments/${commentid}`);
                        getemail.on("value", (snap => {
                            const commentemail = snap.val();
                            if(commentemail.email === emails){
                                commentsArray.push({id, ...commentsFromDatabase[id]});
                            }
                        }))
                    }
                })
            }
            setTempArray(commentsArray)
        })
        for(let i=0; i<tempArray.length; i++){
            if(tempArray[i].posterEmail !== emails){
                if(commentsPosts.length === 0){
                    commentsPosts.push(tempArray[i]);
                }
                for(let j=0; j<commentsPosts.length; j++){
                    if(tempArray[i].id !== commentsPosts[j].id){
                        commentsPosts.push(tempArray[i]);
                    }
                }
            }
        }
    }, [])
    

    const handleClose = () => setShow(false);
    const handleShow = (id) => {
        setShow(true)
        console.log(id);
        setAddingCommentClicked(id);
        console.log(usersPosts);
        console.log(commentsPosts)
    };

    async function addingComment(){
        let postID = 0;
        console.log("Hello");
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

    function home(){
        window.location = "/home";
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
                        <Dropdown.Item href="#" onClick={logout}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            <div>
                <h4>Posts made by me</h4>
                {usersPosts.map(function(post){
                    if(post.dogBreed != null){
                        return(   
                            <div>
                                <div id="showingPostsForAccount">
                                    <img id="postImageForAccount" src={post.image}></img>
                                    <div id="infoForAccount">
                                        <div id="postTimeForAccount">Posted by {post.posterName} at {post.postTime}</div>
                                        <div id="postTypeForAccount"><h3 style={{display: "inline"}}>Type: </h3>{post.type}</div>
                                        <div id="postBreedForAccount"><h3 style={{display: "inline"}}>Breed: </h3>{post.dogBreed}</div>
                                        <div id="postHeightForAccount"><h3 style={{display: "inline"}}>Height: </h3>{post.height}cm</div>
                                        <div id="postColourForAccount"><h3 style={{display: "inline"}}>Colour: </h3>{post.colour}</div>
                                        <div id="postNeuturedForAccount"><h3 style={{display: "inline"}}>The animal is: </h3>{post.neutured}</div>
                                        <Button data-tip data-for="addComment" id={post.id} variant="outline-primary" onClick={() => handleShow(post.id)}>
                                            <Icon path={mdiCommentText} size={1}></Icon>                        
                                        </Button>
                                        <ReactTooltip id="addComment" place="top" effect="solid">Add Comment</ReactTooltip>  
        
                                        <Modal show={show} onHide={handleClose}>
                                            <Modal.Header style={{background: "#F0F0F0"}}>
                                            <Modal.Title>Comment Below</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body><textarea id="commentBoxForAccount" commenterName="commentBox" onChange={(e) => setComment(e.target.value)}></textarea></Modal.Body>
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
                                                {/*<button id="commentsButton" onClick={() => showComments(post.id)}>Show Comments</button>*/}
                                                <Button data-tip data-for="showComment" id={post.id} variant="outline-primary" onClick={() => showComments(post.id)}>
                                                    <Icon path={mdiCommentTextMultiple} size={1}></Icon>
                                                </Button>
                                                <ReactTooltip id="showComment" place="top" effect="solid">View Comments</ReactTooltip>
                                            </div>
                                        :null}
                                        <Button data-tip data-for="addFavourites" variant="outline-danger">
                                            <Icon path={mdiCardsHeartOutline} size={1}></Icon>
                                        </Button>
                                        <ReactTooltip id="addFavourites" place="top" effect="solid">Add to Favourites</ReactTooltip>
                                        {displayComments?
                                            <div>
                                                {showingComments.map(function(comment){
                                                    if(post.postID === comment.postID){
                                                        return(
                                                            <div>
                                                                <button id="commentsButtonForAccount" onClick = {() => closeComments()}>Close Comments</button>
                                                                <br />
                                                                <br />
                                                                <div id="commentForAccount">
                                                                    <b id="commentUserForAccount">{comment.commenterName}: </b>
                                                                    <p id="commentInfoForAccount">{comment.comment}<p id="commentTimeForAccount">Commented on {comment.commentTime}</p></p>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                })}
                                            </div>
                                        :null}
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    else{
                        return(
                            <div>
                                <div id="showingPostsForAccount">
                                    <img id="postImageForAccount" src={post.image}></img>
                                    <div id="infoForAccount">
                                        <div id="postTimeForAccount">Posted by {post.posterName} at {post.postTime}</div>
                                        <div id="postTypeForAccount"><h3 style={{display: "inline"}}>Type: </h3>{post.type}</div>
                                        <div id="postHeightForAccount"><h3 style={{display: "inline"}}>Height: </h3>{post.height}cm</div>
                                        <div id="postColourForAccount"><h3 style={{display: "inline"}}>Colour: </h3>{post.colour}</div>
                                        <div id="postNeuturedForAccount"><h3 style={{display: "inline"}}>The animal is: </h3>{post.neutured}</div>
                                        <Button data-tip data-for="addComment" id={post.id} variant="outline-primary" onClick={() => handleShow(post.id)}>
                                            <Icon path={mdiCommentText} size={1}></Icon>                        
                                        </Button>
                                        <ReactTooltip id="addComment" place="top" effect="solid">Add Comment</ReactTooltip>  
        
                                        <Modal show={show} onHide={handleClose}>
                                            <Modal.Header style={{background: "#F0F0F0"}}>
                                            <Modal.Title>Comment Below</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body><textarea id="commentBoxForAccount" commenterName="commentBox" onChange={(e) => setComment(e.target.value)}></textarea></Modal.Body>
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
                                        <Button data-tip data-for="addFavourites" variant="outline-danger">
                                            <Icon path={mdiCardsHeartOutline} size={1}></Icon>
                                        </Button>
                                        <ReactTooltip id="addFavourites" place="top" effect="solid">Add to Favourites</ReactTooltip>
                                        {displayComments?
                                            <div>
                                                {showingComments.map(function(comment){
                                                    if(post.postID === comment.postID){
                                                        return(
                                                            <div>
                                                                <button id="commentsButton closeCommentsButton" onClick = {() => closeComments()}>Close Comments</button>
                                                                <br />
                                                                <br />
                                                                <div id="commentForAccount">
                                                                    <b id="commentUserForAccount">{comment.commenterName}: </b>
                                                                    <p id="commentInfoForAccount">{comment.comment}<p id="commentTimeForAccount">Commented on {comment.commentTime}</p></p>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                })}
                                            </div>
                                        :null}
                                    </div>
                                </div>
                            </div>
                        )
                    }
                })}

                {/*--------------------------------------------------------------------------------------------*/}

                <h4>Commented on Posts</h4>
                {commentsPosts.map(function(commentedPosts){
                    return(
                        <div>
                            <div id="showingCommentedPostsForAccount">
                                <img id="postImageForAccount" src={commentedPosts.image}></img>
                                    <div id="infoForAccount">
                                        <div id="postTimeForAccount">Posted by {commentedPosts.posterName} at {commentedPosts.postTime}</div>
                                        <div id="postTypeForAccount"><h3 style={{display: "inline"}}>Type: </h3>{commentedPosts.type}</div>
                                        <div id="postBreedForAccount"><h3 style={{display: "inline"}}>Breed: </h3>{commentedPosts.dogBreed}</div>
                                        <div id="postHeightForAccount"><h3 style={{display: "inline"}}>Height: </h3>{commentedPosts.height}cm</div>
                                        <div id="postColourForAccount"><h3 style={{display: "inline"}}>Colour: </h3>{commentedPosts.colour}</div>
                                        <div id="postNeuturedForAccount"><h3 style={{display: "inline"}}>The animal is: </h3>{commentedPosts.neutured}</div>
                                        <Button id={commentedPosts.id} variant="outline-primary" onClick={(element) => handleShow(element.target.id)} data-tip data-for="addComment" >
                                            <Icon path={mdiCommentText} size={1}></Icon>                        
                                        </Button>
                                        <ReactTooltip id="addComment" place="top" effect="solid">Add Comment</ReactTooltip>  
        
                                        <Modal show={show} onHide={handleClose}>
                                            <Modal.Header style={{background: "#F0F0F0"}}>
                                            <Modal.Title>Comment Below</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body><textarea id="commentBoxForAccount" commenterName="commentBox" onChange={(e) => setComment(e.target.value)}></textarea></Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={() => addingComment()}>
                                                    Submit
                                                </Button>
                                                <Button variant="primary" onClick={handleClose}>
                                                    Close
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>
                                        {commentedPosts.comments != null?
                                            <div style={{display: "inline"}}>
                                                <Button data-tip data-for="showComment" id={commentedPosts.id} variant="outline-primary" onClick={() => showComments(commentedPosts.id)}>
                                                    <Icon path={mdiCommentTextMultiple} size={1}></Icon>
                                                </Button>
                                                <ReactTooltip id="showComment" place="top" effect="solid">View Comments</ReactTooltip>
                                            </div>
                                        :null}
                                        <Button data-tip data-for="addFavourites" variant="outline-danger">
                                            <Icon path={mdiCardsHeartOutline} size={1}></Icon>
                                        </Button>
                                        <ReactTooltip id="addFavourites" place="top" effect="solid">Add to Favourites</ReactTooltip>
                                        {displayComments?
                                            <div>
                                                {showingComments.map(function(comment){
                                                    if(commentedPosts.postID === comment.postID){
                                                        return(
                                                            <div>
                                                                <button id="commentsButton closeCommentsButton" onClick = {() => closeComments()}>Close Comments</button>
                                                                <br />
                                                                <br />
                                                                <div id="commentForAccount">
                                                                    <b id="commentUserForAccount">{comment.commenterName}: </b>
                                                                    <p id="commentInfoForAccount">{comment.comment}<p id="commentTimeForAccount">Commented on {comment.commentTime}</p></p>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                })}
                                            </div>
                                        :null}
                                    </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}