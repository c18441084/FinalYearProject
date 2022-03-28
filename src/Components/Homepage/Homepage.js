//import react from "react";
import './Homepage.css';
import { useState } from 'react';
import { logout } from "../../firebaseconfig";
import { Dropdown, Navbar, Container, Nav } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import settingsIcon from "../../SettingsIcon.png";
import Wallpaper from '../../Wallpaper.jpg';
import { latitude, longitude } from '../GlobalState/states';
import db2 from "../../firebaseconfig";
import FindMyOwner from '../Login/loginPictures/FindMyOwner2.png';
import { geocodeAPIkey } from '../../keys';
import GeoCode from 'react-geocode'

export default function Homepage(){
    
    const db = db2.ref("Posts");
    let postsArray = [];
    const [nearPosts, setNearPosts] = useState([]);

    function myAccount(){
        window.location = "/account";
    }

    function found(){
        window.location = "/found";
    }

    function lost(){
        window.location = '/lost';
    }

    function reportAPet(){
        window.location = "/found-pet-details"
    }

    function dogWardenService(){
        window.location = "/dog-warden-service";
    }

    function getLocation(){
        navigator.geolocation.getCurrentPosition(showPosition);
    }

    function showPosition(position){
        latitude.value = (position.coords.latitude);
        longitude.value = (position.coords.longitude);
        console.log(latitude.value, longitude.value);

        db.on("value", (snap) => {
            const postsFromDatabase = snap.val();
            for(let id in postsFromDatabase){
                let locationRef = db2.ref(`Posts/${id}/address`);
                locationRef.on("value", (snap) =>{
                    let address = snap.val();
                    let obj = {};
                    obj[id] = address
                    postsArray.push(obj);
                })
            }
        })

        gettingDistance();
    } 

    function gettingDistance(){
        /*db.on("value", (snap) => {
            const postsFromDatabase = snap.val();
            for(let id in postsFromDatabase){
                console.log(postsArray.`${id}`);
            }
        })*/
        console.log(postsArray);
        for(let i=0; i<postsArray.length; i++){
            Object.values(postsArray[i]).map((element) => {
                console.log(element);
                Geocode.fromAddress("Eiffel Tower").then(
                    (response) => {
                      const { lat, lng } = response.results[0].geometry.location;
                      console.log(lat, lng);
                    },
                    (error) => {
                      console.error(error);
                    }
                );
            })
        }
    }

    return(
        <div style= {{backgroundImage: `url(${Wallpaper})`, height: "auto"}}>
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
            <div id = "topbar" style={{backgroundColor: "white"}}>
                <h3 id = "RP">Recent Posts</h3>
                <h3 id = "PNM" onClick={() => getLocation()}>Posts near me</h3>
            </div>
            <div id = "RecentPosts">
                
            </div>
            <div id = "PostsNearMe">

            </div>
        </div>
    )
}