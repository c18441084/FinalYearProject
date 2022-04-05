import db2, { logout, storage, auth } from "../../firebaseconfig";
import { Button, Dropdown, Row, Col, Card, Carousel, Image } from "react-bootstrap";
import {Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactTooltip from 'react-tooltip';
import settingsIcon from "../../SettingsIcon.png";
import { useEffect, useState } from "react";
import { mdiCardsHeartOutline } from '@mdi/js';
import { mdiTrashCanOutline } from '@mdi/js';
import { mdiHeartOffOutline } from '@mdi/js';
import { mdiPageNextOutline } from '@mdi/js';
import { mdiMicrosoftXboxControllerMenu } from '@mdi/js';
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

    function addFavourites(id){
        console.log(id);
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
                    console.log(email.email);
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

    function home(){
        window.location = "/FindMyOwner/home";
    }

    function found(){
        window.location = "/FindMyOwner/found"
    }

    function lost(){
        window.location = "/FindMyOwner/lost";
    }

    function report(){
        window.location = "/FindMyOwner/report-pet-details";
    }

    function dws(){
        window.location = "/FindMyOwner/dog-warden-service";

    }
   
    return(
        <div style= {{backgroundImage: `url(${Wallpaper})`, minHeight: "100vh"}}>
            <title>FindMyOwner</title>
            <div id = "Title">
                <Dropdown id="MenuButton">
                    <Dropdown.Toggle variant="warning" size="lg">
                        <Icon path={mdiMicrosoftXboxControllerMenu} size={1}></Icon>
                    </Dropdown.Toggle>
                    <Dropdown.Menu variant="dark">
                        <Dropdown.Item onClick={home} >Home</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={found}>Found</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={lost}>Lost</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={report}>Report a Pet</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={dws}>DWS</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown> 
                <Image id="titleName" onClick={home} src={FindMyOwner} style={{marginLeft: "30%"}}></Image>
                <Dropdown id="SettingsButton">
                    <Dropdown.Toggle variant="warning" size="lg">
                        <img id="imageSettingsIcon" src={settingsIcon}></img>
                    </Dropdown.Toggle>

                    <Dropdown.Menu variant="dark">
                        <Dropdown.Item href="#" onClick={logout}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            <div>
                <Row style={{marginTop: "2%"}}>
                    <Card className="shadow lg"style={{marginLeft: "2%", width: "30%", borderRadius: "25px"}}>
                        <Card.Header style={{textAlign: "center", borderTopRightRadius: "25px", borderTopLeftRadius: "25px", width:"106%", marginLeft: "-3%", backgroundColor: "lightgray"}}><b>Posts made by me</b></Card.Header>
                        {usersPosts[0]===undefined?                       
                            <Card.Text style={{marginLeft: "25%", marginTop: "70%"}}><b>No posts posted</b></Card.Text> 
                            : 
                            <Carousel variant="dark" interval={null}>
                                {usersPosts.map((post, index) => {
                                return(
                                    <Carousel.Item>
                                        <Col className="col-sm-10 mb-5 mt-2" style={{marginLeft: "8.5%"}}>
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
                            
                                                    <Button data-tip data-for="addFavourites" variant="outline-danger" onClick={() => addFavourites(post.id)}>
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
                        </Carousel>}
                    </Card>
                
                    <Card className="shadow lg" style={{marginLeft: "2%", width: "30%", borderRadius: "25px"}}>
                        <Card.Header style={{textAlign: "center", borderTopRightRadius: "25px", borderTopLeftRadius: "25px", backgroundColor: "lightgray", width:"106%", marginLeft: "-3%"}}><b>Commented Posts</b></Card.Header>
                        {commentsPosts[0]===undefined?
                        <Card.Text style={{marginLeft: "25%", marginTop: "70%"}}><b>No posts have commented</b></Card.Text> 
                        : 
                        <Carousel variant="dark" interval={null}>
                            {commentsPosts.map(function(commentedPosts){
                                return(
                                    <Carousel.Item>
                                        <Col className="col-sm-10 mb-5 mt-2" style={{marginLeft: "8.5%"}}>
                                            <Card className="shadow-lg" border="info" style={{ width: '100%', borderRadius: "25px"}}>
                                                {commentedPosts.status === "MISSING"?<Card.Header style={{textAlign: "center", backgroundColor: "lightyellow", borderTopLeftRadius: "25px", borderTopRightRadius: "25px"}}><h5>{commentedPosts.status}</h5></Card.Header>: <Card.Header style={{textAlign: "center", backgroundColor: "lightblue", borderTopLeftRadius: "25px", borderTopRightRadius: "25px"}}><h5>{commentedPosts.status}</h5></Card.Header>}
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
                                                    
                                                    <Button data-tip data-for="addFavourites" variant="outline-danger" onClick={() => addFavourites(commentedPosts.id)}>
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
                                    </Carousel.Item>
                                )
                            })}
                        </Carousel>}
                    </Card>
                
                    <Card className="shadow lg"style={{marginLeft: "2%", width: "30%", borderRadius: "25px"}}>
                        <Card.Header style={{textAlign: "center", borderTopRightRadius: "25px", borderTopLeftRadius: "25px", backgroundColor: "lightgray", width:"106%", marginLeft: "-3%"}}><b>Favourites</b></Card.Header>
                        {favouritePosts[0]===undefined?
                        <Card.Text style={{marginLeft: "25%", marginTop: "70%"}}><b>There are no favourite posts</b></Card.Text> 
                        : 
                        <Carousel variant="dark" interval={null}>
                            {favouritePosts.map(function(favPosts){
                            return(
                                <Carousel.Item>
                                    <Col className="col-sm-10 mb-5 mt-2" style={{marginLeft: "8.5%"}}>
                                        <Card className="shadow-lg" border="info" style={{ width: '100%', borderRadius: "25px"/*, marginLeft:"1%"*/}}>
                                            {favPosts.status === "MISSING"?<Card.Header style={{textAlign: "center", backgroundColor: "lightyellow", borderTopLeftRadius: "25px", borderTopRightRadius: "25px"}}><h5>{favPosts.status}</h5></Card.Header>: <Card.Header style={{textAlign: "center", backgroundColor: "lightblue", borderTopLeftRadius: "25px", borderTopRightRadius: "25px"}}><h5>{favPosts.status}</h5></Card.Header>}
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
                                </Carousel.Item>
                            )
                        })}
                        </Carousel>}
                    </Card>
                </Row>
            </div>
        </div>
    )
}