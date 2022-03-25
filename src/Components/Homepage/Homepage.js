//import react from "react";
import './Homepage.css'
import { logout } from "../../firebaseconfig";
import { Dropdown, Navbar, Container, Nav } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import settingsIcon from "../../SettingsIcon.png";
import Wallpaper from '../../Wallpaper.jpg';
import FindMyOwner from '../Login/loginPictures/FindMyOwner2.png'

export default function Homepage(){

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

    return(
        <div style= {{backgroundImage: `url(${Wallpaper})`, height: "auto"}}>
            <title>FindMyOwner</title>
            <div /*id = "Title"*/>
                {/*<h1 id="titleName">FindMyOwner</h1>
                <Dropdown id="SettingsButton">
                    <Dropdown.Toggle id="dropdown-button-dark-example1" variant="warning">
                        <img id="imageSettingsIcon" src={settingsIcon}></img>
                    </Dropdown.Toggle>
                    <Dropdown.Menu variant="dark">
                        <Dropdown.Item href="#" onClick={myAccount}>My Account</Dropdown.Item>
                        <Dropdown.Divider></Dropdown.Divider>
                        <Dropdown.Item href="#" onClick={logout}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>*/}
                <Navbar bg="dark" variant="dark" style={{height: "20vh"}}>
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
                </Navbar>
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
                <h3 id = "PNM">Posts near me</h3>
            </div>
            <div id = "RecentPosts">
                
            </div>
            <div id = "PostsNearMe">

            </div>
        </div>
    )
}