//import react from "react";
import './Homepage.css'
import { logout } from "../../firebaseconfig";
import { Dropdown, Navbar, Container, Nav } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import settingsIcon from "../../SettingsIcon.png";
export default function Homepage(){

    function found(){
        window.location = "/found";
    }

    function myAccount(){
        window.location = "/account";
    }

    function dogWardenService(){
        window.location = "/dog-warden-service";
    }

    return(
        <div>
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
            </div>
            {/*<div id = "sidebar">
                <button id = "found" onClick={found}>
                    <h2>Found Pets</h2>
                </button>
                <a href = "#">
                    <h2>Lost Pets</h2>
                </a>
                <a href = "#">
                    <h2>Pet Clinics</h2>
                </a>
                <a href = "#" onClick={dogWardenService}>
                    <h2 id = "DWS">Dog Warden Service</h2>
                </a>
            </div>*/}
            <Nav id="sidebar" defaultActiveKey="/home" className='flex-column'>
                <Nav.Item>
                    <Nav.Link id="navButton" onClick={found}>Found</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link id="navButton" >Lost</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                <Nav.Link id="navButton" onClick={dogWardenService}>DWS</Nav.Link>
                </Nav.Item>
            </Nav>
            <div id = "topbar">
                <h3 id = "RP">Recent Posts</h3>
                <h3 id = "PNM">Posts near me</h3>
            </div>
            <div id = "RecentPosts">
                
            </div>
            <div id = "PostsNearMe">

            </div>
        </div>
    )
}