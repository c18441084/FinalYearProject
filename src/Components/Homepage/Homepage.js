//import react from "react";
import './Homepage.css';
import { useState, useEffect } from 'react';
import { auth, logout } from "../../firebaseconfig";
import { Dropdown, Nav, Button, Col, Row, Card, Image } from "react-bootstrap";
import ReactTooltip from 'react-tooltip';
import 'bootstrap/dist/css/bootstrap.min.css';
import settingsIcon from "../../SettingsIcon.png";
import Wallpaper from '../../Wallpaper.jpg';
import { latitude, longitude } from '../GlobalState/states';
import db2 from "../../firebaseconfig";
import FindMyOwner from '../Login/loginPictures/FindMyOwner.png'
import { geocodeAPIkey } from '../../keys';
import Geocode from 'react-geocode';
import Icon from '@mdi/react';
import { mdiCardsHeartOutline } from '@mdi/js';
import { mdiPageNextOutline } from '@mdi/js';
import { mdiMagnify } from '@mdi/js';
import { mdiLeadPencil } from '@mdi/js';
import { mdiDogSide } from '@mdi/js';
import { mdiHome } from '@mdi/js';
import { mdiNearMe } from '@mdi/js';
import { mdiHistory } from '@mdi/js';
import {Link} from 'react-router-dom';

export default function Homepage(){

    const db = db2.ref("Posts");
    const [recentPosts, setRecentPosts] = useState([]);
    const [nearPosts, setNearPosts] = useState([]);

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
        window.location = "/FindMyOwner/report-pet-details"
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
            let recentArray = []
            for(let i=postsArray.length-1; i>postsArray.length-4; i--){
                recentArray.push(postsArray[i]);
            }
            setRecentPosts(recentArray);
        })
        navigator.geolocation.getCurrentPosition(showPosition);
    }, []);

    function showPosition(position){
        let distance = 0;
        latitude.value = (position.coords.latitude);
        longitude.value = (position.coords.longitude);
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
                        if(distance < 10){
                            postsArray.push({id, ...postsFromDatabase[id]});
                        }
                        },
                        (error) => {
                        console.error(error);
                        }
                    );
                })
            }
            setTimeout(() =>{
                setNearPosts(postsArray);
            }, 500)
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

    function changeMileRadius(miles){
        let mileRadius = miles;
        navigator.geolocation.getCurrentPosition(changePosition);
        function changePosition(position){
            let distance = 0;
            latitude.value = (position.coords.latitude);
            longitude.value = (position.coords.longitude);
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
                            console.log(mileRadius);
                            if(distance < mileRadius){
                                postsArray.push({id, ...postsFromDatabase[id]});
                            }
                            },
                            (error) => {
                            console.error(error);
                            }
                        );
                    })
                }
                setTimeout(() =>{
                    setNearPosts(postsArray);
                }, 800)
            })
    
        } 
    }

    return(
        <div style= {{height: "auto"}}>
            <title>FindMyOwner</title>
            <div id = "Title">
                <Image id="titleName" src={FindMyOwner} style={{marginLeft: "37%"}}></Image>
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
            <Nav id="sidebar" variant="dark" className='flex-column'>
                <Nav.Item>
                    <Nav.Link id="navButton" onClick={found}><Icon path ={mdiHome} size={2}></Icon> Found</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link id="navButton" onClick={lost}><Icon path ={mdiMagnify} size={2}></Icon> Lost</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link id="navButton" onClick={reportAPet}><Icon path ={mdiLeadPencil} size={2}></Icon> Report</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link id="navButton" onClick={dogWardenService}><Icon path ={mdiDogSide} size={2}></Icon> DWS</Nav.Link>
                </Nav.Item>
            </Nav>
            <div id = "topbar">
                <h3 id = "RP">Recent Posts <Icon path ={mdiHistory} size={1}></Icon></h3>
                <h3 id = "PNM">Posts near me <Icon path ={mdiNearMe} size={1}></Icon></h3>
            </div>
            <div style={{backgroundImage: `url(${Wallpaper})`}}>
            <div style={{marginLeft: "20%"}}>
                <Row>
                    <div id = "RecentPosts" style={{ backgroundImage: `url(${Wallpaper})`, position: "absolute", overflowX: "scroll", maxHeight: "90%", width: "42%", marginLeft: "-4.2%"}}>
                        {recentPosts.length >= 0? 
                            recentPosts.map(function(post){
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
                                                {post.neutured != ""?<Card.Text><h3 style={{display: "inline"}}>Neutered/Spayed: </h3>{post.neutured}</Card.Text>:null}
                                                {post.status === "FOUND"?<Card.Text><h3 style={{display: "inline"}}>Found at: </h3>{post.address}</Card.Text>:
                                                <Card.Text><h3 style={{display: "inline"}}>Last seen at: </h3>{post.address}</Card.Text>}

                                                <Link to ={{pathname: `/FindMyOwner/post/${post.id}`, state: {id: post.id}}} data-tip data-for="viewPostInfo">
                                                    <Button variant="outline-primary">
                                                        <Icon path={mdiPageNextOutline} size={1}></Icon>  
                                                    </Button>                      
                                                </Link>
                                                <ReactTooltip id="viewPostInfo" place="top" effect="solid">View Post Information</ReactTooltip>
                                                
                                                <Button data-tip data-for="addFavourites" variant="outline-danger" onClick={() => addFavourites(post.id)}>
                                                    <Icon path={mdiCardsHeartOutline} size={1}></Icon>
                                                </Button>
                                                <ReactTooltip id="addFavourites" place="top" effect="solid">Add to Favourites</ReactTooltip>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                            )
                        }): <h1>No Posts Recently Posted</h1>}
                    </div>

                    <div id = "PostsNearMe" style={{backgroundImage: `url(${Wallpaper})`, marginLeft: "37%", position: "absolute", borderLeft: "6px solid #00bfFF", overflowX: "scroll", maxHeight: "90%", width: "auto"}}>
                    <label for="miles">Posts within: </label>
                                    <select name="miles" id="miles" onInput={(e) => changeMileRadius(e.target.value)}>
                                        <option value="5">5 miles</option>
                                        <option value="10" selected="selected">10 miles</option>
                                        <option value="20">20 miles</option>
                                        <option value="50">50 miles</option>
                                    </select>
                        {nearPosts.length === 0? <h1>No Posts Within Region of 10 miles</h1> :
                        nearPosts.map(function(post){
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
                                            {post.neutured != ""?<Card.Text><h3 style={{display: "inline"}}>Neutered/Spayed: </h3>{post.neutured}</Card.Text>:null}
                                            {post.status === "FOUND"?<Card.Text><h3 style={{display: "inline"}}>Found at: </h3>{post.address}</Card.Text>:
                                            <Card.Text><h3 style={{display: "inline"}}>Last seen at: </h3>{post.address}</Card.Text>}

                                            <Link to ={{pathname: `/FindMyOwner/post/${post.id}`, state: {id: post.id}}} data-tip data-for="viewPostInfo">
                                                <Button variant="outline-primary">
                                                    <Icon path={mdiPageNextOutline} size={1}></Icon>  
                                                </Button>                      
                                            </Link>
                                            <ReactTooltip id="viewPostInfo" place="top" effect="solid">View Post Information</ReactTooltip>
                                            
                                            <Button  data-tip data-for="addFavourites" variant="outline-danger" onClick={() => addFavourites(post.id)}>
                                                <Icon path={mdiCardsHeartOutline} size={1}></Icon>
                                            </Button>
                                            <ReactTooltip id="addFavourites" place="top" effect="solid">Add to Favourites</ReactTooltip>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )
                        })}
                    </div>
                </Row>
            </div>
            </div>
        </div>
    )
}