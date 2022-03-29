import { logout, storage } from "../../firebaseconfig";
import { Button, Dropdown, Row, Col, Card, Carousel, Image } from "react-bootstrap";
import {Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactTooltip from 'react-tooltip';
import settingsIcon from "../../SettingsIcon.png";
import { useEffect, useState } from "react";
import db2, { auth } from "../../firebaseconfig";
import { mdiCardsHeartOutline } from '@mdi/js';
import { mdiTrashCanOutline } from '@mdi/js';
import { mdiHeartOffOutline } from '@mdi/js';
import { mdiPageNextOutline } from '@mdi/js';
import Icon from '@mdi/react';
import "./MyAccount.css";
import Wallpaper from '../../Wallpaper.jpg';
import FindMyOwner from '../Login/loginPictures/FindMyOwner.png'

export default function MyAccount(){

    const [userEmail, setUserEmail] = useState(); 
    const [usersPosts, setUsersPosts] = useState([]);
    const [commentsPosts, setCommentsPosts] = useState([]);
    const [favouritePosts, setFavouritePosts] = useState([]);

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

    async function deletePosts(id){
        if(window.confirm("Are you sure you want to delete this post?")){
            const getURL = db2.ref(`Posts/${id}/image`);
            let url = "";
            getURL.on("value", (snap) => {
                url = snap.val();
            })
            await storage.refFromURL(url).delete();
            await db2.ref(`Posts/${id}`).remove();
            alert("Post deleted successfully");
            window.location.reload(false);
        }
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
        window.location = "/FindMyOwner/home";
    }
   
    return(
        <div style= {{backgroundImage: `url(${Wallpaper})`, height: "auto"}}>
            <title>FindMyOwner</title>
            <div id = "Title">
                <Image id="titleName" onClick={home} src={FindMyOwner} style={{marginLeft: "37%"}}></Image>
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
                    <Card className="shadow lg"style={{marginLeft: "5%", width: "90%", borderRadius: "25px"}}>
                        <Card.Header style={{textAlign: "center", borderTopRightRadius: "25px", borderTopLeftRadius: "25px", backgroundColor: "lightblue", width:"102%", marginLeft: "-1%"}}>Posts made by me</Card.Header>
                        <Carousel variant="dark">
                        {usersPosts[0]===undefined?<p>There are no posts</p> : usersPosts.map((post, index) => {
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
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Carousel.Item>
                            )
                        })}
                        </Carousel>
                    </Card>
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
                                    <Card.Text><h3 style={{display: "inline"}}>Colour: </h3>{commentedPosts.colour.map(function(element) {return(<div style={{display: "inline", marginRight:"2%", border: "1px solid black", borderRadius: "25px", padding: "1%"}}>{element}</div>)})}</Card.Text>                                    
                                    {commentedPosts.neutured != ""?<Card.Text><h3 style={{display: "inline"}}>Neutered/Spayed: </h3>{commentedPosts.neutured}</Card.Text>:null}
                                    {commentedPosts.status === "FOUND"?<Card.Text><h3 style={{display: "inline"}}>Found at: </h3>{commentedPosts.address}</Card.Text>:
                                    <Card.Text><h3 style={{display: "inline"}}>Last seen at: </h3>{commentedPosts.address}</Card.Text>}

                                    <Link to ={{pathname: `/FindMyOwner/post/${commentedPosts.id}`, state: {id: favouritePosts.id}}} data-tip data-for="viewPostInfo">
                                        <Button variant="outline-primary">
                                            <Icon path={mdiPageNextOutline} size={1}></Icon>  
                                        </Button>                      
                                    </Link>
                                    <ReactTooltip id="viewPostInfo" place="top" effect="solid">View Post Information</ReactTooltip>
                                    
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
                                    <Card.Text><h3 style={{display: "inline"}}>Colour: </h3>{favPosts.colour.map(function(element) {return(<div style={{display: "inline", marginRight:"2%", border: "1px solid black", borderRadius: "25px", padding: "1%"}}>{element}</div>)})}</Card.Text>                                    
                                    {favPosts.neutured != ""?<Card.Text><h3 style={{display: "inline"}}>Neutered/Spayed: </h3>{favPosts.neutured}</Card.Text>:null}
                                    {favPosts.status === "FOUND"?<Card.Text><h3 style={{display: "inline"}}>Found at: </h3>{favPosts.address}</Card.Text>:
                                    <Card.Text><h3 style={{display: "inline"}}>Last seen at: </h3>{favPosts.address}</Card.Text>}

                                    <Link to ={{pathname: `/FindMyOwner/post/${favPosts.id}`, state: {id: favPosts.id}}} data-tip data-for="viewPostInfo">
                                        <Button variant="outline-primary">
                                            <Icon path={mdiPageNextOutline} size={1}></Icon>  
                                        </Button>                      
                                    </Link>
                                    <ReactTooltip id="viewPostInfo" place="top" effect="solid">View Post Information</ReactTooltip>

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