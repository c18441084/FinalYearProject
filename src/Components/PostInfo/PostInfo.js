import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import './PostInfo.css';
import settingsIcon from "../../SettingsIcon.png";
import { Card, Dropdown } from 'react-bootstrap';
import db2, {logout} from '../../firebaseconfig';

export default function Homepage(){

    const {id} = useParams();
    const [postInfo, setPostInfo] = useState([]);
    const db = db2.ref(`Posts/${id}`);

    function myAccount(){
        window.location = "/FindMyOwner/account";
    }

    useEffect(() =>{
        db.on("value", (snapshot) => {
            const postsFromDatabase = snapshot.val();
            setPostInfo({id, ...postsFromDatabase});
        })
    }, [])

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

            <div id="PostInfoPostBox">
                <Card>
                    {postInfo.status === "MISSING"?
                    <Card.Text id="PostInfoStatus" style={{backgroundColor: 'lightyellow'}}><b>{postInfo.status}</b></Card.Text>
                    :
                    <Card.Text id="PostInfoStatus" style={{backgroundColor: 'lightblue'}}><b>{postInfo.status}</b></Card.Text>}
                    <Card.Img id="PostInfoImage" src={postInfo.image}></Card.Img>
                    <Card.Text><b>Status: </b>{postInfo.status}</Card.Text>
                </Card>
            </div>
        </div>
    )
}