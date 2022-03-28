//import react from "react";
import './Homepage.css';
import { useState, useEffect } from 'react';
import { auth, logout } from "../../firebaseconfig";
import { Dropdown, Navbar, Container, Nav, Button, Col, Row, Card, Modal } from "react-bootstrap";
import ReactTooltip from 'react-tooltip';
import 'bootstrap/dist/css/bootstrap.min.css';
import settingsIcon from "../../SettingsIcon.png";
import Wallpaper from '../../Wallpaper.jpg';
import { latitude, longitude } from '../GlobalState/states';
import db2 from "../../firebaseconfig";
import FindMyOwner from '../Login/loginPictures/FindMyOwner2.png';
import { geocodeAPIkey } from '../../keys';
import Geocode from 'react-geocode';
import Icon from '@mdi/react';
import { mdiCommentText } from '@mdi/js';
import { mdiCommentTextMultiple } from '@mdi/js';
import { mdiCardsHeartOutline } from '@mdi/js';
import { mdiDeleteEmptyOutline } from '@mdi/js';
import { mdiCommentOffOutline } from '@mdi/js';

export default function Homepage(){

    const db = db2.ref("Posts");
    const [recentPosts, setRecentPosts] = useState([]);
    const [nearPosts, setNearPosts] = useState([]);
    const [show, setShow] = useState(false);
    const [comment, setComment] = useState("");
    const [showingComments, setShowingComments] = useState([]); 
    const [displayComments, setDisplayComments] = useState(false);
    const [addingCommentClicked, setAddingCommentClicked] = useState(0);
    const [commentShowCounter, setCommentShowCounter] = useState(0);

    function myAccount(){
        window.location = "/FindMyOwner/account";
    }

    function found(){
        window.location = "/FindMyOwner/found";
    }

    function lost(){
        window.location = '/FindMyOwner/lost';
    }

    function reportAPet(){
        window.location = "/FindMyOwner/found-pet-details"
    }

    function dogWardenService(){
        window.location = "/FindMyOwner/dog-warden-service";
    }

    useEffect(() => {
        db.on("value", (snap) => {
            const postsFromDatabase = snap.val();
            let postsArray = [];
            for(let id in postsFromDatabase){
                postsArray.push({id, ...postsFromDatabase[id]})
            }
            setRecentPosts(postsArray);
            console.log(postsArray);
        })
        navigator.geolocation.getCurrentPosition(showPosition);        
    }, []);

    function showPosition(position){
        let distance = 0;
        latitude.value = (position.coords.latitude);
        longitude.value = (position.coords.longitude);
        console.log(latitude.value, longitude.value);
        Geocode.setApiKey(geocodeAPIkey);

        db.on("value", (snap) => {
            const postsFromDatabase = snap.val();
            let postsArray = [];
            for(let id in postsFromDatabase){
                let locationRef = db2.ref(`Posts/${id}/address`);
                locationRef.on("value", (snap) =>{
                    let address = snap.val();
                    Geocode.fromAddress(address).then(
                        async (response) => {
                        const { lat, lng } = await response.results[0].geometry.location;
                        address = `${lat},${lng}`;
                        distance = gettingDistance(latitude.value, longitude.value, address);
                        console.log(distance);
                        if(distance < 10){
                            console.log("howya");
                            postsArray.push({id, ...postsFromDatabase[id]});
                        }
                        },
                        (error) => {
                        console.error(error);
                        }
                    );
                })
            }
            setTimeout(() => {
                console.log(postsArray);
                setNearPosts(postsArray);
            }, 200)
        })

    } 

    function gettingDistance(userLat, userLng, postCoors){
        let split = postCoors.split(",");
        let postLat = split[0];
        let postLng = split[1];
        var R = 3958.8;
        var UserLat = userLat * (Math.PI/180);
        var PostLat = postLat * (Math.PI/180);
        var difflat = PostLat-UserLat;
        var difflon = (postLng-userLng) * (Math.PI/180);

        var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(UserLat)*Math.cos(PostLat)*Math.sin(difflon/2)*Math.sin(difflon/2)));
        return d;
    }
    
    const handleClose = () => setShow(false);
    const handleShow = async (id) => {
        setShow(true);
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

    function addFavourites(id){
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

    function deleteComment(postID, commentID){
        if(window.confirm("Are you sure you want to delete this comment?")){
            db2.ref(`Posts/${postID}/comments/${commentID}`).remove();
            alert("Comment deleted successfully");
        }
        setCommentShowCounter(1);
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

    return(
        <div style= {{height: "auto"}}>
            <title>FindMyOwner</title>
            <div id = "Title">
                <h1 id="titleName">FindMyOwner</h1>
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
                {/*<Navbar bg="dark" variant="dark" style={{height: "20vh"}}>
                    <Container>
                        <Navbar.Brand href="#home" style={{marginLeft: "40%"}}>
                            <img
                            alt=""
                            src={FindMyOwner}
                            width="250"
                            height="70"
                            className="d-inline-block align-top"
                            />{' '}
                        </Navbar.Brand>
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
                    </Container>
                </Navbar>*/}
            </div>
            <Nav id="sidebar" variant="dark" defaultActiveKey="/home" className='flex-column'>
                <Nav.Item>
                    <Nav.Link id="navButton" onClick={found}>Found&#62;</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link id="navButton" onClick={lost}>Lost</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link id="navButton" onClick={reportAPet}>Report a pet</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link id="navButton" onClick={dogWardenService}>DWS</Nav.Link>
                </Nav.Item>
            </Nav>
            <div id = "topbar">
                <h3 id = "RP">Recent Posts</h3>
                <h3 id = "PNM">Posts near me</h3>
            </div>
            <div style={{backgroundImage: `url(${Wallpaper})`}}>
            <div style={{marginLeft: "20%"}}>
                <Row>
                    <div id = "RecentPosts" style={{ backgroundImage: `url(${Wallpaper})`, position: "absolute", overflowX: "scroll", maxHeight: "90%", width: "42%", marginLeft: "-4.2%"}}>
                        {recentPosts.length >= 0? 
                            recentPosts.map(function(post){
                                console.log(post)
                                return(
                                    <Col className="col-sm-10" style={{  textAlign: "center", marginTop: "3%"}}>
                                        <Card className="shadow-lg" border="info" style={{width: '100%', borderRadius: "25px", marginLeft: "12%"}}>
                                            {post.status === "MISSING"?<Card.Header style={{textAlign: "center", backgroundColor: "lightyellow", borderTopLeftRadius: "25px", borderTopRightRadius: "25px"}}><h5>{post.status}</h5></Card.Header>: <Card.Header style={{textAlign: "center", backgroundColor: "lightblue", borderTopLeftRadius: "25px", borderTopRightRadius: "25px"}}><h5>{post.status}</h5></Card.Header>}
                                            <Card.Text style={{opacity: "0.5", textAlign: "center"}}>Posted by {post.posterName} at {post.postTime}</Card.Text>
                                            <Card.Img  variant="top" src={post.image} style={{border: "1px solid black", marginRight: "auto", marginLeft: "auto", height: "30vh", width: "20vw", borderRadius: "25px"}}/>
                                            <Card.Body>
                                                <Card.Text><h3 style={{display: "inline"}}>Type: </h3>{post.type}</Card.Text>
                                                {post.dogBreed != null?<Card.Text><h3 style={{display: "inline"}}>Breed: </h3>{post.dogBreed}</Card.Text>:null}
                                                <Card.Text><h3 style={{display: "inline"}}>Height: </h3>{post.height}cm</Card.Text>
                                                <Card.Text><h3 style={{display: "inline"}}>Colour: </h3>{post.colour.map(function(element) {return(<div style={{display: "inline", marginRight:"2%", border: "1px solid black", borderRadius: "25px", padding: "1%"}}>{element}</div>)})}</Card.Text>
                                                {post.neutured != ""?<Card.Text><h3 style={{display: "inline"}}>The animal is: </h3>{post.neutured}</Card.Text>:null}
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
                                                    <Modal.Body style={{height: "50vh"}}><textarea id="commentBoxForAccount" maxlength = "150" placeholder="Enter Comment. Max 150 characters" commenterName="commentBox" onChange={(e) => setComment(e.target.value)}></textarea></Modal.Body>
                                                    <Modal.Footer>
                                                        <Button variant="secondary" onClick={() => addingComment()}>
                                                            Submit
                                                        </Button>
                                                        <Button variant="primary" onClick={handleClose}>
                                                            Cancel
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

                                                
                                                <Button data-tip data-for="addFavourites" variant="outline-danger" onClick={() => addFavourites(post.id)}>
                                                    <Icon path={mdiCardsHeartOutline} size={1}></Icon>
                                                </Button>
                                                <ReactTooltip id="addFavourites" place="top" effect="solid">Add to Favourites</ReactTooltip>
                                                {displayComments?
                                                    <div>
                                                        {showingComments.map(function(comment){
                                                            if(post.postID === comment.postID){
                                                                return(
                                                                    <div>
                                                                        <hr></hr>
                                                                        <br />
                                                                        <br />
                                                                        <div id="commentForAccount">
                                                                            <b id="commentUserForAccount">{comment.commenterName}: </b>
                                                                            <p id="commentInfoForAccount" style={{display: "inline"}}>{comment.comment}<p id="commentTimeForAccount" style={{marginLeft: "5%"}}>Commented on {comment.commentTime}</p></p>
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
                            )
                        }): <h1>No Posts Recently Posted</h1>}
                    </div>

                    <div id = "PostsNearMe" style={{backgroundImage: `url(${Wallpaper})`, marginLeft: "37%", position: "absolute", borderLeft: "6px solid #00bfFF", overflowX: "scroll", maxHeight: "90%", width: "auto"}}>
                        {nearPosts.length >= 0? 
                            nearPosts.map(function(post){
                                console.log(post)
                                return(
                                    <Col className="col-sm-9" style={{ textAlign: "center", marginLeft: "10%", marginTop: "3%" }}>
                                        <Card className="shadow-lg" border="info" style={{ width: '100%', borderRadius: "25px"}}>
                                            {post.status === "MISSING"?<Card.Header style={{textAlign: "center", backgroundColor: "lightyellow", borderTopLeftRadius: "25px", borderTopRightRadius: "25px"}}><h5>{post.status}</h5></Card.Header>: <Card.Header style={{textAlign: "center", backgroundColor: "lightblue", borderTopLeftRadius: "25px", borderTopRightRadius: "25px"}}><h5>{post.status}</h5></Card.Header>}
                                            <Card.Text style={{opacity: "0.5", textAlign: "center"}}>Posted by {post.posterName} at {post.postTime}</Card.Text>
                                            <Card.Img  variant="top" src={post.image} style={{border: "1px solid black", marginRight: "auto", marginLeft: "auto", height: "30vh", width: "20vw", borderRadius: "25px"}}/>
                                            <Card.Body>
                                                <Card.Text><h3 style={{display: "inline"}}>Type: </h3>{post.type}</Card.Text>
                                                {post.dogBreed != null?<Card.Text><h3 style={{display: "inline"}}>Breed: </h3>{post.dogBreed}</Card.Text>:null}
                                                <Card.Text><h3 style={{display: "inline"}}>Height: </h3>{post.height}cm</Card.Text>
                                                <Card.Text><h3 style={{display: "inline"}}>Colour: </h3>{post.colour.map(function(element) {return(<div style={{display: "inline", marginRight:"2%", border: "1px solid black", borderRadius: "25px", padding: "1%"}}>{element}</div>)})}</Card.Text>
                                                {post.neutured != ""?<Card.Text><h3 style={{display: "inline"}}>The animal is: </h3>{post.neutured}</Card.Text>:null}
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
                                                    <Modal.Body style={{height: "50vh"}}><textarea id="commentBoxForAccount" maxlength = "150" placeholder="Enter Comment. Max 150 characters" commenterName="commentBox" onChange={(e) => setComment(e.target.value)}></textarea></Modal.Body>
                                                    <Modal.Footer>
                                                        <Button variant="secondary" onClick={() => addingComment()}>
                                                            Submit
                                                        </Button>
                                                        <Button variant="primary" onClick={handleClose}>
                                                            Cancel
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
                                                                console.log("howya");
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

                                                
                                                <Button data-tip data-for="addFavourites" variant="outline-danger" onClick={() => addFavourites(post.id)}>
                                                    <Icon path={mdiCardsHeartOutline} size={1}></Icon>
                                                </Button>
                                                <ReactTooltip id="addFavourites" place="top" effect="solid">Add to Favourites</ReactTooltip>
                                                {displayComments?
                                                    <div>
                                                        {showingComments.map(function(comment){
                                                            if(post.postID === comment.postID){
                                                                return(
                                                                    <div>
                                                                        <hr></hr>
                                                                        <br />
                                                                        <br />
                                                                        <div id="commentForAccount">
                                                                            <b id="commentUserForAccount">{comment.commenterName}: </b>
                                                                            <p id="commentInfoForAccount" style={{display: "inline"}}>{comment.comment}<p id="commentTimeForAccount" style={{marginLeft: "5%"}}>Commented on {comment.commentTime}</p></p>
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
                                )
                        }):<h1>No Posts Within Region of 10 miles</h1>}
                    </div>
                </Row>
            </div>
            </div>
        </div>
    )
}