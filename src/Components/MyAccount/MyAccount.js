import { logout, storage } from "../../firebaseconfig";
import { Button, Modal, Dropdown, Row, Col, Card, Carousel, CarouselItem } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactTooltip from 'react-tooltip';
import settingsIcon from "../../SettingsIcon.png";
import { useEffect, useState } from "react";
import db2, { auth } from "../../firebaseconfig";
import { mdiCommentText } from '@mdi/js';
import { mdiCommentTextMultiple } from '@mdi/js';
import { mdiCardsHeartOutline } from '@mdi/js';
import { mdiTrashCanOutline } from '@mdi/js';
import { mdiDeleteEmptyOutline } from '@mdi/js';
import { mdiCommentOffOutline } from '@mdi/js';
import { mdiHeartOffOutline } from '@mdi/js';
import Icon from '@mdi/react';
import "./MyAccount.css";

export default function MyAccount(){

    const [userEmail, setUserEmail] = useState(); 
    const [usersPosts, setUsersPosts] = useState([]);
    const [commentsPosts, setCommentsPosts] = useState([]);
    const [favouritePosts, setFavouritePosts] = useState([]);
    const [show, setShow] = useState(false);
    const [addingCommentClicked, setAddingCommentClicked] = useState(0);
    const [comment, setComment] = useState("");
    const [showingComments, setShowingComments] = useState([]); 
    const [displayComments, setDisplayComments] = useState(false);
    const [commentShowCounter, setCommentShowCounter] = useState(0);
    const [closeComments, setCloseComments] = useState(false);

    const dbUser = db2.ref(`Posts`);

    useEffect(() => {
        const emails = auth.currentUser.email;
        setUserEmail(emails)
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

            let testArray = [];
            testArray[0] = commentsArray[0];
            for(let i=0; i<commentsArray.length; i++){
                let counter = 0;
                let id = commentsArray[i].id;
                for(let j=0; j<testArray.length; j++){
                    if(id == testArray[j].id){
                        counter = 1;
                    }
                }
                if(counter == 0 && commentsArray[i].posterEmail != emails){
                    testArray.push(commentsArray[i])
                }
            }
            
            setCommentsPosts(testArray);
        })


        dbUser.on("value", (snap) => {
            const favouritesFromDatabase = snap.val()
            const favsArray =[];
            for(let id in favouritesFromDatabase){
                const getpost = db2.ref(`Posts/${id}/favourites`);
                getpost.on('value', (snap) => {
                    const favourites = snap.val();
                    for(let favID in favourites){
                        const getUser = db2.ref(`Posts/${id}/favourites/${favID}`);
                        getUser.on('value', (snap) => {
                            const user = snap.val();
                            if(user.email == emails){
                                favsArray.push({id, ...favouritesFromDatabase[id]});
                            }
                        })
                    }
                })
            }
            setFavouritePosts(favsArray);
        })
    }, [])
    

    const handleClose = () => setShow(false);
    const handleShow = (id) => {
        setShow(true)
        setAddingCommentClicked(id);
    };

    async function addingComment(){
        let postID = 0;
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

    let counter = 0;
    async function showComments(id){
        counter = 0;
        const dbcomments = db2.ref(`Posts/${id}/comments`);
        dbcomments.on("value", (snapshot)=>{
            const commentsFromDatabase = snapshot.val();
            const commentsArray = [];
            for(let id in commentsFromDatabase){
                commentsArray.push({id, ...commentsFromDatabase[id]});
            }
            setShowingComments(commentsArray);
        })
        setDisplayComments(true);
        setCommentShowCounter(1);
    }

    function closingComments(){
        setDisplayComments(false);
        setCommentShowCounter(0);
    }

    function deletePosts(id){
        if(window.confirm("Are you sure you want to delete this post?")){
            const getURL = db2.ref(`Posts/${id}/image`);
            let url = "";
            getURL.on("value", (snap) => {
                url = snap.val();
            })
            var fileRef = storage.refFromURL(url);
            console.log("hi");
            console.log(fileRef);
            fileRef.delete();
            db2.ref(`Posts/${id}`).remove();
            alert("Post deleted successfully");
            window.location.reload(false);
        }
    }

    function deleteComment(postID, commentID){
        if(window.confirm("Are you sure you want to delete this comment?")){
            db2.ref(`Posts/${postID}/comments/${commentID}`).remove();
            alert("Comment deleted successfully");
            window.location.reload(false);
        }
        setCommentShowCounter(0);
    }

    function removeFavoruite(favID){
        if(window.confirm("Are you sure you want to delete this post from your favourites?")){
            const favRef = db2.ref(`Posts/${favID}/favourites`);
            favRef.on("value", (snap) => {
                let info = snap.val();
                let favsArray = [];
                for(let id in info){
                    const inside = db2.ref(`Posts/${favID}/favourites/${id}`)
                    inside.on("value", (snap) => {
                        let info2 = snap.val();
                        if(info2.email === userEmail){
                            db2.ref(`Posts/${favID}/favourites/${id}`).remove();
                        }
                    })
                }
            })
            alert("Post removed successfully");
            window.location.reload(false);
        }
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
                <Row>
                <Carousel variant="dark">
                {usersPosts[0]===undefined?<p>There are no posts</p> : usersPosts.map((post, index) => {
                    let mod = index % 2;
                    return(
                        <Carousel.Item>
                            <Col className="col-sm-3 ml-7" style={{marginLeft: "38%", marginBottom: "5%"}}>
                                <Card className="shadow-lg" border="info" style={{ width: '100%', borderRadius: "25px"/*, marginLeft:"1%"*/}}>
                                    <Card.Header style={{textAlign: "center"}}><h5>{post.status}</h5></Card.Header>
                                    <Card.Text style={{opacity: "0.5", textAlign: "center"}}>Posted by {post.posterName} at {post.postTime}</Card.Text>
                                    <Card.Img  variant="top" src={post.image} style={{border: "1px solid black", marginRight: "auto", marginLeft: "auto", height: "30vh", width: "20vw", borderRadius: "25px"}}/>
                                    <Card.Body>
                                        <Card.Text><h3 style={{display: "inline"}}>Type: </h3>{post.type}</Card.Text>
                                        {post.dogBreed != null?<Card.Text><h3 style={{display: "inline"}}>Breed: </h3>{post.dogBreed}</Card.Text>:null}
                                        <Card.Text><h3 style={{display: "inline"}}>Height: </h3>{post.height}cm</Card.Text>
                                        <Card.Text><h3 style={{display: "inline"}}>Colour: </h3>{post.colour.map(function(element) {return(<div style={{display: "inline", marginRight:"2%", border: "1px solid black", borderRadius: "25px", padding: "1%"}}>{element}</div>)})}</Card.Text>                                    {post.neutured != ""?<Card.Text><h3 style={{display: "inline"}}>The animal is: </h3>{post.neutured}</Card.Text>:null}
                                        {post.status === "FOUND"?<Card.Text><h3 style={{display: "inline"}}>Found at: </h3>{post.address}</Card.Text>:
                                        <Card.Text><h3 style={{display: "inline"}}>Last seen at: </h3>{post.address}</Card.Text>}

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
                                        {post.comments != null && commentShowCounter === 0?
                                            <div style={{display: "inline"}}>
                                                <Button data-tip data-for="showComment" variant="outline-primary" onClick={() => showComments(post.id)}>
                                                    <Icon path={mdiCommentTextMultiple} size={1}></Icon>
                                                </Button>
                                                <ReactTooltip id="showComment" place="top" effect="solid">View Comments</ReactTooltip>             
                                            </div>
                                        :null}
                                        {commentShowCounter === 1?
                                            <div style={{display: "inline"}}>
                                                {showingComments.map(function(comment){
                                                    if(post.postID === comment.postID && counter == 0){
                                                        counter = counter +1
                                                        return(
                                                            <div style={{display: "inline"}}>
                                                                <Button data-tip data-for="closeComment" variant="outline-primary" onClick = {() => closingComments()}>
                                                                    <Icon path={mdiCommentOffOutline} size={1}></Icon>
                                                                </Button>
                                                                <ReactTooltip id="closeComment" place="top" effect="solid">Close Comments</ReactTooltip>
                                                            </div>
                                                        )
                                                    }
                                                })}
                                            </div>
                                        :null}

                                        
                                        <Button data-tip data-for="addFavourites" variant="outline-danger">
                                            <Icon path={mdiCardsHeartOutline} size={1}></Icon>
                                        </Button>
                                        <ReactTooltip id="addFavourites" place="top" effect="solid">Add to Favourites</ReactTooltip>
                                        {auth.currentUser.email === post.posterEmail? 
                                            <div style={{display: "inline"}}>
                                                <Button data-tip data-for="deleteButton" variant="outline-danger" onClick={() => deletePosts(post.id)}>
                                                    <Icon path={mdiTrashCanOutline} size={1}></Icon>
                                                </Button>
                                                <ReactTooltip id="deleteButton" place="top" effect="solid">Delete Post</ReactTooltip>
                                            </div> 
                                        :null}
                                        {displayComments?
                                            <div>
                                                {showingComments.map(function(comment){
                                                    if(post.postID === comment.postID){
                                                        return(
                                                            <div>
                                                                <br />
                                                                <br />
                                                                <div id="commentForAccount">
                                                                    <b id="commentUserForAccount">{comment.commenterName}: </b>
                                                                    <p id="commentInfoForAccount">{comment.comment}<p id="commentTimeForAccount">Commented on {comment.commentTime}</p></p>
                                                                    {auth.currentUser.email === comment.email? 
                                                                            <div>
                                                                                <Button data-tip data-for="deleteButton" variant="outline-danger" onClick={() => deleteComment(post.id, comment.id)}>
                                                                                    <Icon path={mdiDeleteEmptyOutline} size={1}></Icon>
                                                                                </Button>
                                                                                <ReactTooltip id="deleteButton" place="top" effect="solid">Delete Comment</ReactTooltip>
                                                                            </div> 
                                                                        :null}
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                })}
                                            </div>
                                        :null}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Carousel.Item>
                       
                    )
                })}
                </Carousel>
            </Row>


                <Row>
                <h4>Commented on Posts</h4>
                {commentsPosts[0]===undefined?<p>There no commented posts</p>: commentsPosts.map(function(commentedPosts){
                    return(
                        <Col className="col-sm-3 ml-7">
                            <Card className="shadow-lg" border="info" style={{ width: '100%', borderRadius: "25px"/*, marginLeft:"1%"*/}}>
                                <Card.Header style={{textAlign: "center"}}><h5>{commentedPosts.status}</h5></Card.Header>
                                <Card.Text style={{opacity: "0.5", textAlign: "center"}}>Posted by {commentedPosts.posterName} at {commentedPosts.postTime}</Card.Text>
                                <Card.Img  variant="top" src={commentedPosts.image} style={{border: "1px solid black", marginRight: "auto", marginLeft: "auto", height: "30vh", width: "20vw", borderRadius: "25px"}}/>
                                <Card.Body>
                                    <Card.Text><h3 style={{display: "inline"}}>Type: </h3>{commentedPosts.type}</Card.Text>
                                    {commentedPosts.dogBreed != null?<Card.Text><h3 style={{display: "inline"}}>Breed: </h3>{commentedPosts.dogBreed}</Card.Text>:null}
                                    <Card.Text><h3 style={{display: "inline"}}>Height: </h3>{commentedPosts.height}cm</Card.Text>
                                    <Card.Text><h3 style={{display: "inline"}}>Colour: </h3>{commentedPosts.colour.map(function(element) {return(<div style={{display: "inline", marginRight:"2%", border: "1px solid black", borderRadius: "25px", padding: "1%"}}>{element}</div>)})}</Card.Text>                                    {commentedPosts.neutured != ""?<Card.Text><h3 style={{display: "inline"}}>The animal is: </h3>{commentedPosts.neutured}</Card.Text>:null}
                                    {commentedPosts.status === "FOUND"?<Card.Text><h3 style={{display: "inline"}}>Found at: </h3>{commentedPosts.address}</Card.Text>:
                                    <Card.Text><h3 style={{display: "inline"}}>Last seen at: </h3>{commentedPosts.address}</Card.Text>}

                                    <Button data-tip data-for="addComment" id={commentedPosts.id} variant="outline-primary" onClick={() => handleShow(commentedPosts.id)}>
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
                                    {commentedPosts.comments != null && commentShowCounter === 0?
                                        <div style={{display: "inline"}}>
                                            <Button data-tip data-for="showComment" variant="outline-primary" onClick={() => showComments(commentedPosts.id)}>
                                                <Icon path={mdiCommentTextMultiple} size={1}></Icon>
                                            </Button>
                                            <ReactTooltip id="showComment" place="top" effect="solid">View Comments</ReactTooltip>             
                                        </div>
                                    :null}
                                    {commentShowCounter === 1?
                                        <div style={{display: "inline"}}>
                                            {showingComments.map(function(comment){
                                                if(commentedPosts.postID === comment.postID && counter == 0){
                                                    counter = counter +1
                                                    return(
                                                        <div style={{display: "inline"}}>
                                                            <Button data-tip data-for="closeComment" variant="outline-primary" onClick = {() => closingComments()}>
                                                                <Icon path={mdiCommentOffOutline} size={1}></Icon>
                                                            </Button>
                                                            <ReactTooltip id="closeComment" place="top" effect="solid">Close Comments</ReactTooltip>
                                                        </div>
                                                    )
                                                }
                                            })}
                                        </div>
                                    :null}

                                    
                                    <Button data-tip data-for="addFavourites" variant="outline-danger">
                                        <Icon path={mdiCardsHeartOutline} size={1}></Icon>
                                    </Button>
                                    <ReactTooltip id="addFavourites" place="top" effect="solid">Add to Favourites</ReactTooltip>
                                    {auth.currentUser.email === commentedPosts.posterEmail? 
                                        <div style={{display: "inline"}}>
                                            <Button data-tip data-for="deleteButton" variant="outline-danger" onClick={() => deletePosts(commentedPosts.id)}>
                                                <Icon path={mdiTrashCanOutline} size={1}></Icon>
                                            </Button>
                                            <ReactTooltip id="deleteButton" place="top" effect="solid">Delete Post</ReactTooltip>
                                        </div> 
                                    :null}
                                    {displayComments?
                                        <div>
                                            {showingComments.map(function(comment){
                                                if(commentedPosts.postID === comment.postID){
                                                    return(
                                                        <div>
                                                            <br />
                                                            <br />
                                                            <div id="commentForAccount">
                                                                <b id="commentUserForAccount">{comment.commenterName}: </b>
                                                                <p id="commentInfoForAccount">{comment.comment}<p id="commentTimeForAccount">Commented on {comment.commentTime}</p></p>
                                                                {auth.currentUser.email === comment.email? 
                                                                        <div>
                                                                            <Button data-tip data-for="deleteButton" variant="outline-danger" onClick={() => deleteComment(commentedPosts.id, comment.id)}>
                                                                                <Icon path={mdiDeleteEmptyOutline} size={1}></Icon>
                                                                            </Button>
                                                                            <ReactTooltip id="deleteButton" place="top" effect="solid">Delete Comment</ReactTooltip>
                                                                        </div> 
                                                                    :null}
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            })}
                                        </div>
                                    :null}
                                </Card.Body>
                            </Card>
                        </Col>
                    )
                })}
                </Row>

                <Row>
                <h4>Favourites</h4>
                {favouritePosts[0]===undefined?<p>There no favourites posts</p> : favouritePosts.map(function(favPosts){
                    return(
                        <Col className="col-sm-3 ml-7">
                            <Card className="shadow-lg" border="info" style={{ width: '100%', borderRadius: "25px"/*, marginLeft:"1%"*/}}>
                                <Card.Header style={{textAlign: "center"}}><h5>{favPosts.status}</h5></Card.Header>
                                <Card.Text style={{opacity: "0.5", textAlign: "center"}}>Posted by {favPosts.posterName} at {favPosts.postTime}</Card.Text>
                                <Card.Img  variant="top" src={favPosts.image} style={{border: "1px solid black", marginRight: "auto", marginLeft: "auto", height: "30vh", width: "20vw", borderRadius: "25px"}}/>
                                <Card.Body>
                                    <Card.Text><h3 style={{display: "inline"}}>Type: </h3>{favPosts.type}</Card.Text>
                                    {favPosts.dogBreed != null?<Card.Text><h3 style={{display: "inline"}}>Breed: </h3>{favPosts.dogBreed}</Card.Text>:null}
                                    <Card.Text><h3 style={{display: "inline"}}>Height: </h3>{favPosts.height}cm</Card.Text>
                                    <Card.Text><h3 style={{display: "inline"}}>Colour: </h3>{favPosts.colour.map(function(element) {return(<div style={{display: "inline", marginRight:"2%", border: "1px solid black", borderRadius: "25px", padding: "1%"}}>{element}</div>)})}</Card.Text>                                    {favPosts.neutured != ""?<Card.Text><h3 style={{display: "inline"}}>The animal is: </h3>{favPosts.neutured}</Card.Text>:null}
                                    {favPosts.status === "FOUND"?<Card.Text><h3 style={{display: "inline"}}>Found at: </h3>{favPosts.address}</Card.Text>:
                                    <Card.Text><h3 style={{display: "inline"}}>Last seen at: </h3>{favPosts.address}</Card.Text>}

                                    <Button data-tip data-for="addComment" id={favPosts.id} variant="outline-primary" onClick={() => handleShow(favPosts.id)}>
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
                                    {favPosts.comments != null && commentShowCounter === 0?
                                        <div style={{display: "inline"}}>
                                            <Button data-tip data-for="showComment" variant="outline-primary" onClick={() => showComments(favPosts.id)}>
                                                <Icon path={mdiCommentTextMultiple} size={1}></Icon>
                                            </Button>
                                            <ReactTooltip id="showComment" place="top" effect="solid">View Comments</ReactTooltip>             
                                        </div>
                                    :null}
                                    {commentShowCounter === 1?
                                        <div style={{display: "inline"}}>
                                            {showingComments.map(function(comment){
                                                if(favPosts.postID === comment.postID && counter == 0){
                                                    counter = counter +1
                                                    return(
                                                        <div style={{display: "inline"}}>
                                                            <Button data-tip data-for="closeComment" variant="outline-primary" onClick = {() => closingComments()}>
                                                                <Icon path={mdiCommentOffOutline} size={1}></Icon>
                                                            </Button>
                                                            <ReactTooltip id="closeComment" place="top" effect="solid">Close Comments</ReactTooltip>
                                                        </div>
                                                    )
                                                }
                                            })}
                                        </div>
                                    :null}

                                    
                                    <Button data-tip data-for="removeFavourites" variant="outline-danger" onClick={() => removeFavoruite(favPosts.id)}>
                                        <Icon path={mdiHeartOffOutline} size={1}></Icon>
                                    </Button>
                                    <ReactTooltip id="removeFavourites" place="top" effect="solid">Remove From Favourites</ReactTooltip>
                                    {auth.currentUser.email === favPosts.posterEmail? 
                                        <div style={{display: "inline"}}>
                                            <Button data-tip data-for="deleteButton" variant="outline-danger" onClick={() => deletePosts(favPosts.id)}>
                                                <Icon path={mdiTrashCanOutline} size={1}></Icon>
                                            </Button>
                                            <ReactTooltip id="deleteButton" place="top" effect="solid">Delete Post</ReactTooltip>
                                        </div> 
                                    :null}
                                    {displayComments?
                                        <div>
                                            {showingComments.map(function(comment){
                                                if(favPosts.postID === comment.postID){
                                                    return(
                                                        <div>
                                                            <br />
                                                            <br />
                                                            <div id="commentForAccount">
                                                                <b id="commentUserForAccount">{comment.commenterName}: </b>
                                                                <p id="commentInfoForAccount">{comment.comment}<p id="commentTimeForAccount">Commented on {comment.commentTime}</p></p>
                                                                {auth.currentUser.email === comment.email? 
                                                                        <div>
                                                                            <Button data-tip data-for="deleteButton" variant="outline-danger" onClick={() => deleteComment(favPosts.id, comment.id)}>
                                                                                <Icon path={mdiDeleteEmptyOutline} size={1}></Icon>
                                                                            </Button>
                                                                            <ReactTooltip id="deleteButton" place="top" effect="solid">Delete Comment</ReactTooltip>
                                                                        </div> 
                                                                    :null}
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            })}
                                        </div>
                                    :null}
                                </Card.Body>
                            </Card>
                        </Col>
                    )
                })}
                </Row>
            </div>
        </div>
    )
}