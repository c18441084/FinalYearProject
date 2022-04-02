import db2, {logout} from "../../firebaseconfig";
import './Found.css'
import { useState, useEffect } from "react";
import { Button, Dropdown, Card, Col, Row, Nav, Navbar, NavDropdown, Container, Form, Image, ListGroup } from "react-bootstrap";
import {Link} from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth } from '../../firebaseconfig';
import settingsIcon from "../../SettingsIcon.png";
import { mdiCardsHeartOutline } from '@mdi/js';
import { mdiPageNextOutline } from '@mdi/js';
import { mdiMicrosoftXboxControllerMenu } from '@mdi/js';
import Icon from '@mdi/react'
import Wallpaper from '../../Wallpaper.jpg';
import FindMyOwner from '../Login/loginPictures/FindMyOwner.png'
import DogWardenService from "../DogWardenService/DogWardenService";

export default function Found(){

    let colours = [];

    const [posts, setPosts] = useState([]);
    const [postsNeverChange, setPostsNeverChange] = useState([]);
    const [filterSearch, setFilterSearch] = useState([]);
    const [showFilterChoices, setShowFilterChoices] = useState(false);
    const [breedList, setBreedList] = useState([]);
    const [heightRange, setHeightRange] = useState([]);
    const [colourHolder, setColourHolder] = useState([]);

    const db = db2.ref("Posts");

    useEffect(() => {
        db.on("value", (snapshot)=>{
            const postsFromDatabase = snapshot.val();

            const postsArray = [];
            for(let id in postsFromDatabase){
                let inside = db2.ref(`Posts/${id}`);
                inside.on("value", (snap) => {
                    let status = snap.val()
                    if(status.status === "FOUND"){
                        postsArray.push({id, ...postsFromDatabase[id]});
                    }
                })
            }
            console.log(postsArray.reverse());
            setPosts(postsArray.reverse());
            setPostsNeverChange(postsArray.reverse());
        })
        componentDidMount();
        async function componentDidMount(){
            const response = await fetch("https://dog.ceo/api/breeds/list/all");
            const data = await response.json();
            let testArray = []
            Object.keys(data.message).map((element, index) => {
                Object.values(data.message).map((el, index2)=>{
                    if(index === index2){
                        if(el.length > 0){
                            for(let i=0; i<el.length; i++){
                                testArray.push(element+" (" + el[i] + ")")
                            }
                        }
                        else{
                            testArray.push(element);
                        }
                    }
                })
            })
            setBreedList(testArray);
        }
    }, [])
  
    function home(){
        window.location = "/FindMyOwner/home";
    }

    function myAccount(){
        window.location = "/FindMyOwner/account";
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
    
    function filter(item, arrayNum, minHeight, maxHeight){
        let originalPosts = [];
        let filterType = [];
        let filterBreed = [];
        let filterHeight = [];
        let filterColour = []; 
        let filterNeutured = [];
        let tempArray = [];
        let itemsFilteredNum = 0;

        setPosts(postsNeverChange);
        originalPosts = postsNeverChange;

        if(item === "reset"){
            setFilterSearch([]);
            return
        }

        if(arrayNum === 5){
            var index = colourHolder.indexOf(item)
            colourHolder.splice(index, 1);
            item = undefined;
        }

        if(arrayNum === 2){
            let colourCounter = 0;
            for(let i=0; i<colourHolder.length; i++){
                if(item === colourHolder[i]){
                    alert("Colour already chosen");
                    colourCounter = 1;
                }
            }
            if(colourCounter === 0){
                colourHolder.push(item); 
            }
            filterSearch[arrayNum] = colourHolder;
        }
        else{
            if(arrayNum != 5){
                filterSearch[arrayNum] = item;
            }
        }

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
                                let check = 0;
                                for(let j=0; j<filterSearch[2].length; j++){
                                    for(let k=0; k<typeValue.length; k++){
                                        if(filterSearch[2][j] === typeValue[k]){
                                            check = check + 1;
                                        }
                                    }
                                }
                                if(check === filterSearch[2].length){
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
        console.log(tempArray);
        if(item === "oldest"){
            setPosts(tempArray.reverse());
        }
        else{
            setPosts(tempArray);
        }
        setShowFilterChoices(true);
    }

    return(
        <div style= {{backgroundImage: `url(${Wallpaper})`, height: "auto", width: "100%"}}>
            <title>FindMyOwner</title>
            <div id = "Title">
                <Dropdown id="MenuButton">
                    <Dropdown.Toggle variant="warning" size="lg">
                        <Icon path={mdiMicrosoftXboxControllerMenu} size={1}></Icon>
                    </Dropdown.Toggle>
                    <Dropdown.Menu variant="dark">
                        <Dropdown.Item onClick={home} >Home</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={lost}>Lost</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={report}>Report a Pet</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={dws}>DWS</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown> 

                <Image id="titleName" onClick={home} src={FindMyOwner} style={{marginLeft: "33%"}}></Image>
                <Dropdown id="SettingsButton">
                    <Dropdown.Toggle variant="warning" size="lg">
                        <img id="imageSettingsIcon" src={settingsIcon}></img>
                    </Dropdown.Toggle>

                    <Dropdown.Menu variant="dark">
                        <Dropdown.Item href="#" onClick={myAccount}>My Account</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item href="#" onClick={logout}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            <div>
                <Navbar variant="dark" bg="dark" expand="lg">
                    <Container fluid>
                        <Navbar.Brand href="#home">Filter</Navbar.Brand>
                        <Navbar.Toggle aria-controls="navbar-dark-example" />
                        <Navbar.Collapse id="navbar-dark-example">
                        <Nav>
                            <NavDropdown id="nav-dropdown-dark-example" title="Animal" menuVariant="dark">
                                <NavDropdown.Item eventKey="1" onClick={() => filter("Dog", 0)}>Dog</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item eventKey="2" onClick={() => filter("Cat", 0)}>Cat</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item eventKey="3" onClick={() => filter("Other" , 0)}>Other</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>

                        <Nav>
                            <NavDropdown id="nav-dropdown-dark-example" title="Breed" menuVariant="dark">
                                <ListGroup variant="dark" style={{maxHeight: "600px", overflowX: "scroll"}}>
                                    {breedList.map(function (element, index){
                                        return (
                                            <div>
                                                <ListGroup.Item style={{backgroundColor:"#353839", color: "white"}} eventKey={index} onClick={() => filter(element, 1)}>
                                                    {element}
                                                </ListGroup.Item>
                                            </div>
                                        )
                                    })}
                                </ListGroup>
                            </NavDropdown>
                        </Nav>

                        <Nav>
                            <NavDropdown id="nav-dropdown-dark-example" title="Colour" menuVariant="dark">
                                <NavDropdown.Item eventKey="1" onClick={() => filter("Black", 2)}>Black</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item eventKey="2" onClick={() => filter("Brown", 2)}>Brown</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item eventKey="3" onClick={() => filter("Gold", 2)}>Gold</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item eventKey="4" onClick={() => filter("Gray", 2)}>Gray</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item eventKey="5" onClick={() => filter("Red", 2)}>Red</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item eventKey="6" onClick={() => filter("White", 2)}>White</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>

                        <Nav>
                            <NavDropdown id="nav-dropdown-dark-example" title="Height" menuVariant="dark">
                                <Form.Control type="number" placeholder="Enter Height" onChange={(element) => filter(element.target.value, 3)}/>
                                <NavDropdown.Item eventKey="2" onClick={() => filter("height", 3,  0, 9)}>0cm-9cm</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item eventKey="3" onClick={() => filter("height", 3, 10, 19)}>10cm-19cm</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item eventKey="4" onClick={() => filter("height", 3, 20, 29)}>20cm-29cm</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item eventKey="5" onClick={() => filter("height", 3, 30, 39)}>30cm-39cm</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item eventKey="6" onClick={() => filter("height", 3, 40, 49)}>40cm-49cm</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item eventKey="7" onClick={() => filter("height", 3, 50, 59)}>50cm-59cm</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item eventKey="8" onClick={() => filter("height", 3, 60, 69)}>60cm-69cm</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>

                        <Nav>
                            <NavDropdown id="nav-dropdown-dark-example" title="Time" menuVariant="dark">
                                <NavDropdown.Item  eventKey="1" onClick={() => filter("newest")}>Most Recent</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item eventKey="2" onClick={() => filter("oldest")}>Oldest</NavDropdown.Item>
                            </NavDropdown>
                       </Nav>

                       <Nav>
                            <Nav.Link  eventKey="1" onClick={() => filter("reset")}>Reset</Nav.Link>
                       </Nav>


                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <br></br>
                {showFilterChoices?
                    filterSearch.map((item, index) => {
                        if(item != undefined){
                            if(item === "height"){
                                return(
                                    <Card id="FoundFilterSearch">
                                        {heightRange[0]}cm-{heightRange[1]}cm
                                        <Button size="sm" id={item} onClick={()=>filter(undefined, index)}>X</Button>
                                    </Card>
                                )
                            }
                            else{
                                if(index === 2){
                                    for(let i=0; i<item.length; i++){
                                        if(item[i] != undefined){
                                            colours.push(item[i])
                                        }
                                    }
                                }
                                else{
                                    return(
                                        <Card id="FoundFilterSearch">
                                            {item}
                                            <Button style={{maxHeight: "0.1%", maxWidth: "0.1%"}} id={item} onClick={()=>filter(undefined, index)}>X</Button>
                                        </Card>
                                    )
                                }
                            }
                        }
                    })
                :null}
                {colours?
                
                    colours.map((element) => {
                        if(element === "Black" || element === "Brown" || element === "Gold" || element === "Gray" || element === "White" || element === "Red"){
                        return(
                            <Card id="FoundFilterSearch">
                                {element}
                                <Button style={{maxHeight: "0.1%", maxWidth: "0.1%"}} id={element} onClick={()=>filter(element, 5)}>X</Button>
                            </Card>
                        )
                        }
                    })
                :null}
            </div>

            <div>
                <Row>
                {posts.length >= 0? 
                posts.map(function(post){
                    return(
                        <Col className="col-sm-4 ml-20" id="FoundColumn">
                        <Card className="shadow-lg" border="info" id="FoundCard">
                            <Card.Header id="FoundCardHeader"><h5>{post.status}</h5></Card.Header>
                            <Card.Text id="FoundPostPoster">Posted by {post.posterName} at {post.postTime}</Card.Text>
                            <Card.Img  variant="top" src={post.image} id="FoundPostImage"/>
                            <Card.Body>
                                <Card.Text><h3 id="FoundPostType">Type: </h3>{post.type}</Card.Text>
                                {post.dogBreed != null?<Card.Text><h3 id="FoundPostDogBreed">Breed: </h3>{post.dogBreed}</Card.Text>:null}
                                <Card.Text><h3 id="FoundPostHeight">Height: </h3>{post.height}cm</Card.Text>
                                <Card.Text><h3 id="FoundPostColour">Colour: </h3>{post.colour.map(function(element) {return(<div style={{display: "inline", marginRight:"2%", border: "1px solid black", borderRadius: "25px", padding: "1%"}}>{element}</div>)})}</Card.Text>
                                {post.neutured != ""?<Card.Text><h3 id="FoundPostNeutured">Neutered/Spayed: </h3>{post.neutured}</Card.Text>:null}
                                {post.status === "FOUND"?<Card.Text><h3 id="FoundPostAddress">Found at: </h3>{post.address}</Card.Text>:
                                <Card.Text><h3 id="FoundPostAddress">Last seen at: </h3>{post.address}</Card.Text>}

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
                }): <Col className="col-sm-4 ml-20"><h1>No Posts Found</h1></Col>}
                </Row>
            </div>
        </div>
    )
}