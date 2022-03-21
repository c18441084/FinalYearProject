import db2, {logout, getDownloadURL, ref} from "../../firebaseconfig";
import './Found.css'
import { useState, useEffect } from "react";
import { Button, Modal, Dropdown, DropdownButton, Card, ListGroup, Form } from "react-bootstrap";
import ReactTooltip from 'react-tooltip';
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth } from '../../firebaseconfig';
import settingsIcon from "../../SettingsIcon.png";
import { mdiCommentText } from '@mdi/js';
import { mdiCommentTextMultiple } from '@mdi/js';
import { mdiCardsHeartOutline } from '@mdi/js';
import Icon from '@mdi/react'


export default function Found(){

    const [posts, setPosts] = useState([]);
    const [show, setShow] = useState(false);
    const [comment, setComment] = useState("");
    const [showingComments, setShowingComments] = useState([]); 
    const [displayComments, setDisplayComments] = useState(false);
    const [addingCommentClicked, setAddingCommentClicked] = useState(0);
    const [filterSearch, setFilterSearch] = useState([]);
    const [showFilterChoices, setShowFilterChoices] = useState(false);
    const [breedList, setBreedList] = useState([]);
    const [heightRange, setHeightRange] = useState([]);


    const db = db2.ref("Posts");

    function reportFoundPet(){
        window.location = "/found-pet-details";
    }

    useEffect(() => {
        db.on("value", (snapshot)=>{
            const postsFromDatabase = snapshot.val();

            const postsArray = [];
            for(let id in postsFromDatabase){
                postsArray.push({id, ...postsFromDatabase[id]});
            }
            setPosts(postsArray);
        })
        componentDidMount();
        async function componentDidMount(){
            const response = await fetch("https://dog.ceo/api/breeds/list/all");
            const data = await response.json();
            setBreedList(data.message);
        }
    }, [])

    const handleClose = () => setShow(false);
    const handleShow = async (id) => {
        console.log("id: " +id);
        setShow(true);
        setAddingCommentClicked(id);
    };
  
    function home(){
        window.location = "/home";
    }

    function myAccount(){
        window.location = "/account";
    }

    async function addingComment(){
        let postID = 0;
        console.log(addingCommentClicked);
        const dbcomments = db2.ref(`Posts/${addingCommentClicked}/comments`);
        db2.ref(`Posts/${addingCommentClicked}`).once("value", snap => {
            const infoFromPost = snap.val();
            console.log(infoFromPost);
            postID = infoFromPost.postID;
            console.log("postId: " + postID)
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
        console.log(submit.commenterName);
        console.log(submit.email);
        console.log(submit.comment);
        console.log(submit.commentTime);
        console.log(submit.postID);
        await dbcomments.push(submit);
        handleClose();
    }

    async function showComments(id){
        const dbcomments = db2.ref(`Posts/${id}/comments`);
        dbcomments.on("value", (snapshot)=>{
            const commentsFromDatabase = snapshot.val();
            const commentsArray = [];
            for(let id in commentsFromDatabase){
                commentsArray.push(commentsFromDatabase[id]);
            }
            setShowingComments(commentsArray);
        })
        setDisplayComments(true);
    }

    function closeComments(){
        setDisplayComments(false);
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

    function filter(item, arrayNum, minHeight, maxHeight){
        console.log(item);
        let originalPosts = [];
        let filterType = [];
        let filterBreed = [];
        let filterHeight = [];
        let filterColour = []; 
        let filterNeutured = [];
        let tempArray = [];
        let itemsFilteredNum = 0;
        db.on("value", (snapshot)=>{
            const postsFromDatabase = snapshot.val();

            const postsArray = [];
            for(let id in postsFromDatabase){
                postsArray.push({id, ...postsFromDatabase[id]});
            }
            setPosts(postsArray);
            originalPosts = postsArray;
        })

        if(item == "reset"){
            setFilterSearch([]);
            return;
        }

        filterSearch[arrayNum] = item;

        if(filterSearch[3] === ""){
            filterSearch[3] = undefined;
        }

        for(let i=0; i<filterSearch.length; i++){
            if(i === 0){
                if(filterSearch[i] != undefined){
                    itemsFilteredNum = itemsFilteredNum + 1;
                    let filter = db2.ref(`Posts`);
                    filter.on("value", (snap) => {
                        const postsFromDatabase = snap.val();
                        const filteredArray = [];
                        for(let id in postsFromDatabase){
                            const type = db2.ref(`Posts/${id}/type`)
                            type.on("value", (snap) => {
                                const typeValue = snap.val();
                                if(typeValue == filterSearch[i]){
                                    filteredArray.push({id, ...postsFromDatabase[id]})
                                }
                            })
                        }
                        filterType = filteredArray;
                    })
                }
            }

            if(i === 1){
                if(filterSearch[i] != undefined){
                    itemsFilteredNum = itemsFilteredNum + 1;
                    let filter = db2.ref(`Posts`);
                    filter.on("value", (snap) => {
                        const postsFromDatabase = snap.val();
                        const filteredArray = [];
                        for(let id in postsFromDatabase){
                            const type = db2.ref(`Posts/${id}/dogBreed`)
                            type.on("value", (snap) => {
                                const typeValue = snap.val();
                                if(typeValue == filterSearch[i]){
                                    filteredArray.push({id, ...postsFromDatabase[id]})
                                }
                            })
                        }
                        filterBreed = filteredArray;
                    })
                }
            }

            if(i === 2){
                if(filterSearch[i] != undefined){
                    itemsFilteredNum = itemsFilteredNum + 1;
                    let filter = db2.ref(`Posts`);
                    filter.on("value", (snap) => {
                        const postsFromDatabase = snap.val();
                        const filteredArray = [];
                        for(let id in postsFromDatabase){
                            const type = db2.ref(`Posts/${id}/colour`)
                            type.on("value", (snap) => {
                                const typeValue = snap.val();
                                if(typeValue == filterSearch[i]){
                                    filteredArray.push({id, ...postsFromDatabase[id]})
                                }
                            })
                        }
                        filterColour = filteredArray;
                    })
                }
            }

            if(i === 3){
                if(filterSearch[i] != undefined || filterSearch[i] == ""){
                    if(filterSearch[i] === "height"){
                        itemsFilteredNum = itemsFilteredNum + 1;
                        let filter = db2.ref(`Posts`);
                        filter.on("value", (snap) => {
                            const postsFromDatabase = snap.val();
                            const filteredArray = [];
                            for(let id in postsFromDatabase){
                                const type = db2.ref(`Posts/${id}/height`)
                                type.on("value", (snap) => {
                                    const typeValue = snap.val();
                                    if(typeValue > minHeight && typeValue < maxHeight){
                                        filteredArray.push({id, ...postsFromDatabase[id]})
                                    }
                                })
                            }
                            filterHeight = filteredArray;
                        })
                        heightRange[0] = minHeight;
                        heightRange[1] = maxHeight;
                    }
                    else{
                        itemsFilteredNum = itemsFilteredNum + 1;
                        let filter = db2.ref(`Posts`);
                        filter.on("value", (snap) => {
                            const postsFromDatabase = snap.val();
                            const filteredArray = [];
                            for(let id in postsFromDatabase){
                                const type = db2.ref(`Posts/${id}/height`)
                                type.on("value", (snap) => {
                                    const typeValue = snap.val();
                                    if(typeValue == filterSearch[i]){
                                        filteredArray.push({id, ...postsFromDatabase[id]})
                                    }
                                })
                            }
                            filterHeight = filteredArray;
                        })
                    }
                }
            }

            if(i === 4){
                if(filterSearch[i] != undefined){
                    itemsFilteredNum = itemsFilteredNum + 1;
                    let filter = db2.ref(`Posts`);
                    filter.on("value", (snap) => {
                        const postsFromDatabase = snap.val();
                        const filteredArray = [];
                        for(let id in postsFromDatabase){
                            const type = db2.ref(`Posts/${id}/neutured`)
                            type.on("value", (snap) => {
                                const typeValue = snap.val();
                                if(typeValue == filterSearch[i]){
                                    filteredArray.push({id, ...postsFromDatabase[id]})
                                }
                            })
                        }
                        filterNeutured = filteredArray;
                    })
                }
            }
        }

        for(let i=0; i<originalPosts.length; i++){
            let id = originalPosts[i].id;
            let counter = 0;
            for(let j=0; j<filterType.length; j++){
                if(id === filterType[j].id){
                    counter = counter + 1;
                }
            }
            for(let j=0; j<filterBreed.length; j++){
                if(id === filterBreed[j].id){
                    counter = counter + 1;
                }
            }
            for(let j=0; j<filterHeight.length; j++){
                if(id === filterHeight[j].id){
                    counter = counter + 1;
                }
            }
            for(let j=0; j<filterColour.length; j++){
                if(id === filterColour[j].id){
                    counter = counter + 1;
                }
            }
            for(let j=0; j<filterNeutured.length; j++){
                if(id === filterNeutured[i].id){
                    counter = counter + 1;
                }
            }

            if(counter === itemsFilteredNum){
                tempArray.push(originalPosts[i]);
            }
        }
        setPosts(tempArray);
        setShowFilterChoices(true);
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
                        <Dropdown.Item href="#" onClick={myAccount}>My Account</Dropdown.Item>
                        <Dropdown.Divider></Dropdown.Divider>
                        <Dropdown.Item href="#" onClick={logout}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <button id = "reportFoundPet" onClick = {reportFoundPet}>I found a stray</button>
            <div>
                <Dropdown id="filter" style={{display: "inline"}}>
                    <Dropdown.Toggle id="dropdown-button-dark-example1" variant="success">
                        <h5>Filter</h5>
                    </Dropdown.Toggle>

                    <Dropdown.Menu variant="dark">
                        <DropdownButton id="dropdown-button-dark-example2" variant="dark" style={{color: "white"}} drop="end" title="Animal">
                            <Dropdown.Item variant="dark" style={{color: "black"}} eventKey="1" onClick={() => filter("dog", 0)}>Dog</Dropdown.Item>
                            <Dropdown.Item variant="dark" style={{color: "black"}} eventKey="2" onClick={() => filter("cat", 0)}>Cat</Dropdown.Item>
                            <Dropdown.Item variant="dark" style={{color: "black"}} eventKey="3" onClick={() => filter("other" , 0)}>Other</Dropdown.Item>
                        </DropdownButton>
                        <DropdownButton id="dropdown-button-dark-example2" variant="dark" style={{color: "white"}} drop="end" title="Breed">
                            <ListGroup style={{overflow: "scroll", maxheight: "50%"}}>
                            {Object.keys(breedList).map(function (element){
                                return (
                                    <ListGroup.Item  eventKey="1" style={{color: "black"}} onClick={() => filter(element, 1)}>
                                        {element}
                                    </ListGroup.Item>
                                )
                            })}
                            </ListGroup>
                        </DropdownButton>
                        <DropdownButton id="dropdown-button-dark-example3" variant="dark" style={{color: "white"}} drop="end" title="Colour">
                            <Dropdown.Item variant="dark" style={{color: "black"}} eventKey="1" onClick={() => filter("Black", 2)}>Black</Dropdown.Item>
                            <Dropdown.Item variant="dark" style={{color: "black"}} eventKey="2" onClick={() => filter("Brown", 2)}>Brown</Dropdown.Item>
                            <Dropdown.Item variant="dark" style={{color: "black"}} eventKey="3" onClick={() => filter("Gold", 2)}>Gold</Dropdown.Item>
                            <Dropdown.Item variant="dark" style={{color: "black"}} eventKey="4" onClick={() => filter("Gray", 2)}>Gray</Dropdown.Item>
                            <Dropdown.Item variant="dark" style={{color: "black"}} eventKey="5" onClick={() => filter("Red", 2)}>Red</Dropdown.Item>
                            <Dropdown.Item variant="dark" style={{color: "black"}} eventKey="6" onClick={() => filter("White", 2)}>White</Dropdown.Item>
                        </DropdownButton>
                        <DropdownButton id="dropdown-button-dark-example2" variant="dark" style={{color: "white"}} drop="end" title="Height">
                            <Form.Control type="number" placeholder="Enter Height" onChange={(element) => filter(element.target.value, 3)}/>
                            <Dropdown.Item variant="dark" style={{color: "black"}} eventKey="2" onClick={() => filter("height", 3,  0, 10)}>0cm-10cm</Dropdown.Item>
                            <Dropdown.Item variant="dark" style={{color: "black"}} eventKey="3" onClick={() => filter("height", 3, 10, 20)}>10cm-20cm</Dropdown.Item>
                            <Dropdown.Item variant="dark" style={{color: "black"}} eventKey="4" onClick={() => filter("height", 3, 20, 30)}>20cm-30cm</Dropdown.Item>
                            <Dropdown.Item variant="dark" style={{color: "black"}} eventKey="5" onClick={() => filter("height", 3, 30, 40)}>30cm-40cm</Dropdown.Item>
                            <Dropdown.Item variant="dark" style={{color: "black"}} eventKey="6" onClick={() => filter("height", 3, 40, 50)}>40cm-50cm</Dropdown.Item>
                            <Dropdown.Item variant="dark" style={{color: "black"}} eventKey="7" onClick={() => filter("height", 3, 50, 60)}>50cm-60cm</Dropdown.Item>
                            <Dropdown.Item variant="dark" style={{color: "black"}} eventKey="8" onClick={() => filter("height", 3, 60, 70)}>60cm-70cm</Dropdown.Item>
                        </DropdownButton>
                        <Dropdown.Divider></Dropdown.Divider>
                        <Dropdown.Item href="#"  onClick={() => filter("reset")}>Reset</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                {showFilterChoices?  
                    filterSearch.map(function(item){
                        if(item != undefined){
                            if(item === "height"){

                            }
                            else{
                                return(
                                    <Card style={{width: "8%", borderRadius: "15px", display: "inline"}}>
                                        {item}
                                        <Button size="sm" id={item}>X</Button>
                                    </Card>
                                )
                            }
                        }
                    })
                :null}
            </div>

            <div>
                {posts.map(function(post){
                    return(
                        <div id="showingPosts">
                            {posts.length === 0? <div id="noPosts"><h3>No posts</h3></div>:null}
                            <img id="postImage" src={post.image}></img>
                            <div id="info">
                                <div id="postTime">Posted by {post.posterName} at {post.postTime}</div>
                                <div id="postType"><h3 style={{display: "inline"}}>Type: </h3>{post.type}</div>
                                {post.dogBreed != null?<div id="postBreed"><h3 style={{display: "inline"}}>Breed: </h3>{post.dogBreed}</div>: null}
                                <div id="postHeight"><h3 style={{display: "inline"}}>Height: </h3>{post.height}cm</div>
                                <div id="postColour"><h3 style={{display: "inline"}}>Colour: </h3>{post.colour}</div>
                                <div id="postNeutured"><h3 style={{display: "inline"}}>The animal is: </h3>{post.neutured}</div>
                                <Button data-tip data-for="addComment" id={post.id} variant="outline-primary" onClick={() => handleShow(post.id)}>
                                    <Icon path={mdiCommentText} size={1}></Icon>                        
                                </Button>
                                <ReactTooltip id="addComment" place="top" effect="solid">Add Comment</ReactTooltip>  

                                <Modal show={show} onHide={handleClose}>
                                    <Modal.Header style={{background: "#F0F0F0"}}>
                                    <Modal.Title>Comment Below</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body><textarea id="commentBox" commenterName="commentBox" onChange={(e) => setComment(e.target.value)}></textarea></Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => addingComment()}>
                                            Submit
                                        </Button>
                                        <Button variant="primary" onClick={handleClose}>
                                            Close
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                                {post.comments != null?
                                    <div style={{display: "inline"}}>
                                        <Button data-tip data-for="showComment" id={post.id} variant="outline-primary" onClick={() => showComments(post.id)}>
                                            <Icon path={mdiCommentTextMultiple} size={1}></Icon>
                                        </Button>
                                        <ReactTooltip id="showComment" place="top" effect="solid">View Comments</ReactTooltip>
                                    </div>
                                :null}
                                <Button data-tip data-for="addFavourites" variant="outline-danger" id={post.id} onClick={() => addFavourites(post.id)}>
                                    <Icon path={mdiCardsHeartOutline} size={1}></Icon>
                                </Button>
                                <ReactTooltip id="addFavourites" place="top" effect="solid">Add to Favourites</ReactTooltip>
                                {displayComments?
                                    <div>
                                        {showingComments.map(function(comment){
                                            if(post.postID == comment.postID){
                                                return(
                                                    <div>
                                                        <button id="commentsButton closeCommentsButton" onClick = {() => closeComments()}>Close Comments</button>
                                                        <br />
                                                        <br />
                                                        <div id="comment">
                                                            <b id="commentUser">{comment.commenterName}: </b>
                                                            <p id="commentInfo">{comment.comment}<p id="commentTime">Commented on {comment.commentTime}</p></p>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })}
                                    </div>
                                :null}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}