import db2, {logout, getDownloadURL, ref} from "../../firebaseconfig";
import './Found.css'
import { useState, useEffect } from "react";
import { Button, Modal, Dropdown, DropdownButton, Card, ListGroup, Col, Form, Row } from "react-bootstrap";
import ReactTooltip from 'react-tooltip';
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth } from '../../firebaseconfig';
import settingsIcon from "../../SettingsIcon.png";
import { mdiCommentText } from '@mdi/js';
import { mdiCommentTextMultiple } from '@mdi/js';
import { mdiCardsHeartOutline } from '@mdi/js';
import { mdiDeleteEmptyOutline } from '@mdi/js';
import { mdiCommentOffOutline } from '@mdi/js';
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
    const [commentShowCounter, setCommentShowCounter] = useState(0);

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

    let counter = 0;
    async function showComments(id){
        counter = 0;
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
        setCommentShowCounter(1);
    }

    function closingComments(){
        setDisplayComments(false);
        setCommentShowCounter(0);
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

    function deleteComment(postID, commentID){
        if(window.confirm("Are you sure you want to delete this comment?")){
            db2.ref(`Posts/${postID}/comments/${commentID}`).remove();
            alert("Comment deleted successfully");
        }
        setCommentShowCounter(0);
    }
    
    function filter(item, arrayNum, minHeight, maxHeight){
        console.log(arrayNum);
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
        console.log(filterSearch)
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
                        if(maxHeight != null){
                            heightRange[0] = minHeight;
                            heightRange[1] = maxHeight;
                        }
                        itemsFilteredNum = itemsFilteredNum + 1;
                        let filter = db2.ref(`Posts`);
                        filter.on("value", (snap) => {
                            const postsFromDatabase = snap.val();
                            const filteredArray = [];
                            for(let id in postsFromDatabase){
                                const type = db2.ref(`Posts/${id}/height`)
                                type.on("value", (snap) => {
                                    const typeValue = snap.val();
                                    console.log(minHeight, maxHeight);
                                    if(typeValue >= heightRange[0] && typeValue <= heightRange[1]){
                                        filteredArray.push({id, ...postsFromDatabase[id]})
                                    }
                                })
                            }
                            filterHeight = filteredArray;
                        })
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
                if(id === filterNeutured[j].id){
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
                    <Dropdown.Toggle id="dropdown-button-dark-example1" variant="success" style={{borderRadius:"15px"}}>
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
                            <Dropdown.Item variant="dark" style={{color: "black"}} eventKey="2" onClick={() => filter("height", 3,  0, 9)}>0cm-9cm</Dropdown.Item>
                            <Dropdown.Item variant="dark" style={{color: "black"}} eventKey="3" onClick={() => filter("height", 3, 10, 19)}>10cm-19cm</Dropdown.Item>
                            <Dropdown.Item variant="dark" style={{color: "black"}} eventKey="4" onClick={() => filter("height", 3, 20, 29)}>20cm-29cm</Dropdown.Item>
                            <Dropdown.Item variant="dark" style={{color: "black"}} eventKey="5" onClick={() => filter("height", 3, 30, 39)}>30cm-39cm</Dropdown.Item>
                            <Dropdown.Item variant="dark" style={{color: "black"}} eventKey="6" onClick={() => filter("height", 3, 40, 49)}>40cm-49cm</Dropdown.Item>
                            <Dropdown.Item variant="dark" style={{color: "black"}} eventKey="7" onClick={() => filter("height", 3, 50, 59)}>50cm-59cm</Dropdown.Item>
                            <Dropdown.Item variant="dark" style={{color: "black"}} eventKey="8" onClick={() => filter("height", 3, 60, 69)}>60cm-69cm</Dropdown.Item>
                        </DropdownButton>
                        <DropdownButton id="dropdown-button-dark-example2" variant="dark" style={{color: "white"}} drop="end" title="Neutured">
                            <Dropdown.Item variant="dark" style={{color: "black"}} eventKey="1" onClick={() => filter("neutured", 4)}>Neutured</Dropdown.Item>
                            <Dropdown.Item variant="dark" style={{color: "black"}} eventKey="2" onClick={() => filter("spayed", 4)}>Spayed</Dropdown.Item>
                        </DropdownButton>
                        <Dropdown.Divider></Dropdown.Divider>
                        <Dropdown.Item href="#"  onClick={() => filter("reset")}>Reset</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                {showFilterChoices?
                    filterSearch.map((item, index) => {
                        if(item != undefined){
                            if(item === "height"){
                                console.log(index);
                                return(
                                    <Card style={{width: "8%", borderRadius: "15px", display: "inline"}}>
                                        {heightRange[0]}cm-{heightRange[1]}cm
                                        <Button size="sm" id={item} onClick={()=>filter(undefined, index)}>X</Button>
                                    </Card>
                                )
                            }
                            else{
                                return(
                                    <Card style={{width: "8%", borderRadius: "15px", display: "inline"}}>
                                        {item}
                                        <Button value="" size="sm" id={item} onClick={()=>filter(undefined, index)}>X</Button>
                                    </Card>
                                )
                            }
                        }
                    })
                :null}
            </div>

            <div>
                <Row>
                {posts.map(function(post){
                    return(
                        <Col className="col-sm-4 ml-20" style={{maxWidth: "27%", textAlign: "center", marginLeft: "5%", marginBottom: "3%"}}>
                        <Card className="shadow-lg" border="info" style={{ width: '100%', borderRadius: "25px"/*, marginLeft:"1%"*/}}>
                            <Card.Header style={{textAlign: "center"}}><h5>{post.status}</h5></Card.Header>
                            <Card.Text style={{opacity: "0.5", textAlign: "center"}}>Posted by {post.posterName} at {post.postTime}</Card.Text>
                            <Card.Img  variant="top" src={post.image} style={{border: "1px solid black", marginRight: "auto", marginLeft: "auto", height: "30vh", width: "20vw", borderRadius: "25px"}}/>
                            <Card.Body>
                                <Card.Text><h3 style={{display: "inline"}}>Type: </h3>{post.type}</Card.Text>
                                {post.dogBreed != null?<Card.Text><h3 style={{display: "inline"}}>Breed: </h3>{post.dogBreed}</Card.Text>:null}
                                <Card.Text><h3 style={{display: "inline"}}>Height: </h3>{post.height}cm</Card.Text>
                                <Card.Text><h3 style={{display: "inline"}}>Colour: </h3>{post.colour}</Card.Text>
                                <Card.Text><h3 style={{display: "inline"}}>The animal is: </h3>{post.neutured}</Card.Text>
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
                                    <Modal.Body><textarea id="commentBoxForAccount" commenterName="commentBox" onChange={(e) => setComment(e.target.value)}></textarea></Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => addingComment()}>
                                            Submit
                                        </Button>
                                        <Button variant="primary" onClick={handleClose}>
                                            Close
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

                                
                                <Button data-tip data-for="addFavourites" variant="outline-danger">
                                    <Icon path={mdiCardsHeartOutline} size={1}></Icon>
                                </Button>
                                <ReactTooltip id="addFavourites" place="top" effect="solid">Add to Favourites</ReactTooltip>
                                {displayComments?
                                    <div>
                                        {showingComments.map(function(comment){
                                            if(post.postID === comment.postID){
                                                return(
                                                    <div>
                                                        <br />
                                                        <br />
                                                        <div id="commentForAccount">
                                                            <b id="commentUserForAccount">{comment.commenterName}: </b>
                                                            <p id="commentInfoForAccount">{comment.comment}<p id="commentTimeForAccount">Commented on {comment.commentTime}</p></p>
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
                })}
                </Row>
            </div>
        </div>
    )
}