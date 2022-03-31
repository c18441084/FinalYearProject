import { geocodeAPIkey } from '../../keys';
import Geocode from 'react-geocode';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import './PostInfo.css';
import settingsIcon from "../../SettingsIcon.png";
import { Card, Dropdown, Container, Button, Modal, Image } from 'react-bootstrap';
import db2, {logout, auth, storage} from '../../firebaseconfig';
import Icon from '@mdi/react';
import { mdiCommentText } from '@mdi/js';
import { mdiDeleteEmptyOutline } from '@mdi/js';
import { mdiCardsHeartOutline } from '@mdi/js';
import ReactTooltip from 'react-tooltip';
import Wallpaper from '../../Wallpaper.jpg';
import {latitude, longitude, animalType} from '../GlobalState/states';
import { mdiMapMarker } from '@mdi/js';
import {mdiTrashCanOutline} from '@mdi/js';
import { mdiShare } from '@mdi/js';
import GoogleMap from './GoogleMapsShowLocation';
import FindMyOwner from '../Login/loginPictures/FindMyOwner.png';
import { TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from 'react-share';

export default function Homepage(){


    const {id} = useParams();
    const [postInfo, setPostInfo] = useState([]);
    const [favsAmount, setFavsAmount] = useState();
    const [favouritedUsers, setFavouritedUsers] = useState([]);
    const [postInfoComments, setPostInfoComments] = useState([]);
    const db = db2.ref(`Posts`);
    const dbcomments = db2.ref(`Posts/${id}/comments`);
    const [comment, setComment] = useState("");
    const [show, setShow] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [closeMap, setCloseMap] = useState(true);
    const [url, setUrl] = useState();

    function myAccount(){
        window.location = "/FindMyOwner/account";
    }

    useEffect(() =>{
        setUrl(`http://localhost:3000/FindMyOwner/post/${id}`);
        db.on("value", (snapshot) => {
            const postsFromDatabase = snapshot.val();
            let postArray = [];
            for(let i in postsFromDatabase){
                if(i === id){
                    postArray.push({id, ...postsFromDatabase[id]});
                }
            }
            setPostInfo(postArray);
            animalType.value = postArray[0].type;
        })

        dbcomments.on("value", (snapshot) => {
            const commentsFromDatabase = snapshot.val();
            let commentsArray = []
            for(let id in commentsFromDatabase){
                commentsArray.push({id, ...commentsFromDatabase[id]});
            }
            setPostInfoComments(commentsArray/*.reverse()*/);
        })

        const dbFavs = db2.ref(`Posts/${id}/favourites`);
        dbFavs.on("value", (snapshot) => {
            const favsFromDatabase = snapshot.val();
            let favArraylength = [];
            let favArray = [];
            for(let i in favsFromDatabase){
                favArraylength.push({i, ...favArray[i]})
                const ref2 = db2.ref(`Posts/${id}/favourites/${i}`);
                ref2.on("value", snap =>{
                    const favData = snap.val();
                    favArray.push(favData.name);
                })
            }
            setFavsAmount(favArraylength.length);
            setFavouritedUsers(favArray);
        })
    }, [])

    function showLocation(address){
        setCloseMap(false);
        Geocode.setApiKey(geocodeAPIkey);
        Geocode.fromAddress(address).then(
            async (response) => {
            const { lat, lng } = await response.results[0].geometry.location;
            latitude.value = lat;
            longitude.value = lng;
            },
            (error) => {
            console.error(error);
            }
        );
        setShowMap(true);
    }

    const handleShow = () => {
        setShow(true);
    };
    const handleClose = () => setShow(false);

    async function addingComment(){
        let postID = 0;
        db2.ref(`Posts/${id}`).once("value", snap => {
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

    function addFavourites(){
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


    function deleteComment(commentID){
        console.log(commentID);
        if(window.confirm("Are you sure you want to delete this comment?")){
            db2.ref(`Posts/${id}/comments/${commentID}`).remove();
            alert("Comment deleted successfully");
        }
        //setCommentShowCounter(1);
    }

    async function deletePosts(){
        if(window.confirm("Are you sure you want to delete this post?")){
            const getURL = db2.ref(`Posts/${id}/image`);
            let url = "";
            getURL.on("value", (snap) => {
                url = snap.val();
            })
            await storage.refFromURL(url).delete();
            await db2.ref(`Posts/${id}`).remove();
            alert("Post deleted successfully");
            window.location = "/FindMyOwner/home";
        }
    }

    function home(){
        window.location = "/FindMyOwner/home";
    }

    return(
        <div id="PostInfoWholePage" style={{backgroundImage: `url(${Wallpaper})`, height: "100vh", width: "100%"}}>
            <title>FindMyOwner</title>
            <div id = "Title">
                <Image id="titleName" onClick={home} src={FindMyOwner} style={{marginLeft: "37%"}}></Image>
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

            <Card id="PostInfoPostBox" className="shadow-lg">
                {postInfo?.map(function(post){
                    return(
                        <div>
                            {post.status === "MISSING"?
                            <Card.Text id="PostInfoStatusBar" style={{backgroundColor: 'lightyellow'}}><b>{post.status}</b></Card.Text>
                            :
                            <Card.Text id="PostInfoStatusBar" style={{backgroundColor: 'lightblue'}}><b>{post.status}</b></Card.Text>}
                            <Card.Img id="PostInfoImage" src={post.image}></Card.Img>
                            <Card.Text id="PostInfoStatus"><b>Status: </b>{post.status}</Card.Text>
                            <Card.Text id="PostInfoType"><b>Type: </b>{post.type}</Card.Text>
                            {post.dogBreed?<Card.Text id="PostInfoDogBreed"><b>Breed: </b>{post.dogBreed}</Card.Text>:<Card.Text id="PostInfoDogBreed"><b>Breed: </b>Unknown</Card.Text>}
                            <Card.Text id="PostInfoHeight"><b>Height: </b>{post.height}cm</Card.Text>
                            <Card.Text id="PostInfoColour">{post.colour < 2?<b>Colour: </b> 
                            : 
                            <b>Colours: </b>}{post.colour?.map(function(element) {return(<div id="PostInfoColourDisplay">{element}</div>)})}</Card.Text>
                            <Card.Text id="PostInfoNeutured"><b>Neutured/Spayed: </b>{post.neutured}</Card.Text>
                            {post.status === "FOUND"?<Card.Text id="PostInfoAddress"><b>Found at: </b>{post.address}</Card.Text>
                            :
                            <Card.Text id="PostInfoAddress"><b>Last seen at: </b>{post.address}</Card.Text>}
                            <Button id="PostInfoShowMapButton" data-tip data-for="showMaps" onClick={() => showLocation(post.address)}>
                                <Icon path={mdiMapMarker} size={1}></Icon>
                            </Button>
                            <ReactTooltip id="showMaps" place="top" effect="solid">Show location on map</ReactTooltip>
                            <Modal show={showMap} onHide={closeMap}>
                                <Modal.Body style={{height: "50vh", width:"60vh", marginBottom: "5%"}}>
                                    <GoogleMap id = "googleMap" />
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button onClick={() => (setCloseMap(true), setShowMap(false))}>Close Map</Button>
                                </Modal.Footer>
                            </Modal>
                            <Card.Text id="PostInfoFavouritesAmount" data-tip data-for="viewFavs"><b>Favourited By: </b>{favsAmount} user(s)</Card.Text>
                            {favouritedUsers.length === 0?
                            <div></div>
                            : 
                            <ReactTooltip id="viewFavs" place="top" effect="solid">
                                {favouritedUsers.map(function(element){
                                    return(
                                        <div>
                                            {element}
                                        </div>
                                    )
                                })}
                            </ReactTooltip>}
                            <Card.Text id="PostInfoPosterName"><b>Poster: </b>{post.posterName}</Card.Text>
                            <div id="PostInfoButtons">
                                <Button id="PostInfoAddCommentButton" data-tip data-for="addComment" variant="outline-primary" onClick={() => handleShow()}>
                                    <Icon path={mdiCommentText} size={1}></Icon>                        
                                </Button>
                                <ReactTooltip id="addComment" place="top" effect="solid">Add Comment</ReactTooltip>  
                                <Button id="PostInfoAddFavouritesButton" data-tip data-for="addFavourites" variant="outline-danger" onClick={() => addFavourites()}>
                                    <Icon path={mdiCardsHeartOutline} size={1}></Icon>
                                </Button>
                                <ReactTooltip id="addFavourites" place="top" effect="solid">Add to Favourites</ReactTooltip>
                                {auth.currentUser.email === post.posterEmail? 
                                    <Button id="PostInfoDeletePostButton" data-tip data-for="deletePostButton" variant="outline-danger" onClick={() => deletePosts()}>
                                        <Icon path={mdiTrashCanOutline} size={1}></Icon>
                                        <ReactTooltip id="deletePostButton" place="top" effect="solid">Delete Post</ReactTooltip>
                                    </Button>
                                :null}
                                {/* <Button id="PostInfoShareButton" data-tip data-for="sharePost" variant="outline-primary" onClick={() => share()}>
                                    <Icon path={mdiShare} size={1}></Icon>
                                </Button> */}
                                <TwitterShareButton url={url}>
                                    <TwitterIcon size={32} round={true} />
                                </TwitterShareButton>
                                <ReactTooltip id="sharePost" place="top" effect="solid">Share post to Facebook</ReactTooltip>
                                <WhatsappShareButton url={url}>
                                    <WhatsappIcon size={32} round={true} />
                                </WhatsappShareButton>
                                <ReactTooltip id="sharePost" place="top" effect="solid">Share post to Facebook</ReactTooltip>
                            </div>
                        </div>
                    )
                })}
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
            </Card>

            <Card id="PostInfoCommentSection" className="shadow-lg">
                <Card.Header id="PostInfoCommentSectionHeader">Comments ({postInfoComments.length})</Card.Header>
                <Card.Body>
                    {postInfoComments.length === 0? 
                    <h1>No comments</h1> 
                    :
                        postInfoComments.map(function(element){
                            return(
                                <Container id="PostInfoCommentContainer">
                                    {auth.currentUser.email === element.email? 
                                        <div>
                                            <Button id="PostInfoDeleteCommentButton" data-tip data-for="deleteButton" variant="outline-danger" onClick={() => deleteComment(element.id)}>
                                                <Icon path={mdiDeleteEmptyOutline} size={1}></Icon>
                                            </Button>
                                            <ReactTooltip id="deleteButton" place="top" effect="solid">Delete Comment</ReactTooltip>
                                        </div> 
                                    :null}
                                    <Card.Text id="PostInfoCommenterName"><b>{element.commenterName}</b></Card.Text>
                                    <Card.Text id="PostInfoCommentTime">{element.commentTime}</Card.Text>
                                    <Card.Text id="PostInfoComment">{element.comment}</Card.Text>
                                </Container>
                            )
                        })
                    }
                </Card.Body>
            </Card>
        </div>
    )
}