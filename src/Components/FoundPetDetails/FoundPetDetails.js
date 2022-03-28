import { useState } from 'react';
import './FoundPetDetails.css';
import '../Found/Found';
import { Button, Modal, Dropdown, Col, Card, Row } from "react-bootstrap";
import settingsIcon from "../../SettingsIcon.png";
import 'bootstrap/dist/css/bootstrap.min.css';
import heightDiagram from './Height_Diagram.png';
import GoogleMap from './GoogleMaps';
import { googleMapsState, animalType } from '../GlobalState/states';
import db2, {storage, ref, getDownloadURL, logout} from "../../firebaseconfig";
import { uploadBytesResumable } from 'firebase/storage';
import { auth } from '../../firebaseconfig';
import { accessKeyId, secretAccessKey } from '../../keys';
import Wallpaper from '../../Wallpaper.jpg';
import FindMyOwner from '../Login/loginPictures/FindMyOwner.png'

export default function FoundPetDetails(){

    const [status, setStatus] = useState("");
    const [type, setType] = useState("");
    const [dogBreed, setDogBreed] = useState("");
    const [height, setHeight] = useState("");
    const [colour, setColour] = useState([]);
    const [neutured, setNeutured] = useState("");
    const [location, setLocation] = useState("");

    const [showType, setShowType] = useState(false);
    const [showBreed, setShowBreed] = useState(false);
    const [showBreedGuide, setShowBreedGuide] = useState(false);
    const [showBreedHelpImages, setShowBreedHelpImages] = useState(false);
    const [showHeight, setShowHeight] = useState(false);
    const [showHeightGuide, setShowHeightGuide] = useState(false);
    const [showColourChoice, setShowColourChoice] = useState(false);
    const [showColourList, setShowColourList] = useState(false);
    const [showNeuturedChoice, setShowNeuturedChoice] = useState(false);
    const [showFileUpload, setShowFileUpload] = useState(false);
    const [showFilePic, setShowFilePic] = useState(false);
    const [showLocationPick, setShowLocationPick] = useState(false);
    const [showGoogleMap, setShowGoogleMap] = useState(false);

    const [breedList, setBreedList] = useState([]);
    const [breedList2, setBreedList2] =  useState([]);
    const [dogBreedHelp, setDogBreedHelp] = useState("");
    const [breedListImages, setBreedListImages] = useState([]);
    const [fileImage, setFileImage] = useState("");
    const [fileImagePic, setFileImagePic] = useState();
    const [progress, setProgress] = useState(0);
    const [breedIdentity, setBreedIdentity] = useState();
    const [confidence, setConfidence] = useState();
    const [breedIdentifierFile, setBreedIdentifierFile] = useState();
    const [breedIdentifierFilePic, setBreedIdentifierFilePic] = useState();
    const [breedIdentifierTeller, setBreedIdentifierTeller] = useState(false);
    const [breedIdentifierTeller2, setBreedIdentifierTeller2] = useState(false);
    const [identifierData, setIdentifierData] = useState();

    const AWS = require ("aws-sdk");

    async function componentDidMount(){
        const response = await fetch("https://dog.ceo/api/breeds/list/all");
        const data = await response.json();

        setBreedList2(data.message);

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

    async function DogImages(){
        const response = await fetch("https://dog.ceo/api/breed/" + dogBreedHelp + "/images/random/3");
        const data = await response.json();
        setBreedListImages(data.message);
        setShowBreedHelpImages(true);
    }

    function Status(){
        setShowType(false);
        setShowBreed(false);
        setShowBreedGuide(false);
        setShowBreedHelpImages(false);
        setShowHeight(false);
        setShowHeightGuide(false);
        setShowColourChoice(false);
        setShowNeuturedChoice(false)
        setShowLocationPick(false);
        setShowFileUpload(false);
        setShowFilePic(false);
        setTimeout(() =>{
            setShowType(true);
        }, 100);
    }

    function Type(){
        setShowBreed(false);
        setShowBreedGuide(false);
        setShowBreedHelpImages(false);
        setShowHeight(false);
        setShowHeightGuide(false);
        setShowColourChoice(false);
        setShowNeuturedChoice(false)
        setShowLocationPick(false);
        setShowFileUpload(false);
        setShowFilePic(false);
        animalType.value = type;
        if(type === "Dog"){
            if(status === "FOUND"){
                alert("Warning! \nIt is a legal requirement to report a stray dog to the dog warden service. To read more you can view the DWS section at the homepage of the website.")
            }
            setShowBreed(true);
            componentDidMount();
        }
        else{
            setShowHeight(true);
            setShowColourChoice(true);
            setShowNeuturedChoice(true);
            setShowFileUpload(true);
            setShowLocationPick(true);
        }
    }

    function DogBreed(){
        setShowHeight(true);
        setShowColourChoice(true);
        setShowNeuturedChoice(true);
        setShowLocationPick(true);
        setShowFileUpload(true);
    }

    function BreedHelp(){
        setShowHeightGuide(false);
        setShowBreedGuide(true);
    }

    async function BreedIdentifier(){
        console.log("hello");
        setBreedIdentifierFilePic(URL.createObjectURL(breedIdentifierFile));
        setBreedIdentifierTeller2(false);
        setBreedIdentifierTeller(true);
        setBreedIdentity(null);
        const fileContent = breedIdentifierFile;
        AWS.config.update({
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            region: "eu-west-1"
        });

        const s3 = new AWS.S3();
        var name = breedIdentifierFile.name;
        (async () =>{
            await s3
            .putObject({
                Body: fileContent,
                Bucket: "myawsfindmyownerbucket",
                Key: name
            }).
            promise();
        })();

        const params = {
            Image: {
                S3Object: {
                    Bucket: "myawsfindmyownerbucket",
                    Name: name
                 },
            },
            MaxLabels: 10,
            MinConfidence: 80
        }

        const rekognition = new AWS.Rekognition();

        let d = 0;
        let breed = 0;
        let confidencePercent = 0;
        setTimeout(() => {
            rekognition.detectLabels(params, function(err, data){
                if(err) console.log(err, err.stack);
                else    setIdentifierData(data); d = data;
            });
        }, 1000)
        setTimeout(() => {
            console.log(d);
            for(let i=0; i<d.Labels.length; i++){
                Object.values(d.Labels[i].Parents).map((element, index) =>{
                    if(element.Name === "Dog" && element.Name != "Puppy"){
                        breed = d.Labels[i].Name;
                        confidencePercent = d.Labels[i].Confidence;
                        let convert = Math.round(confidencePercent);
                        setBreedIdentity(breed);
                        setConfidence(convert);
                    }
                })
            }
            alert("Breed: " + breed);
            setBreedIdentifierTeller2(true);
        }, 5000)
    }

    function closeBreedHelp(){
        setShowBreedGuide(false);
        setShowBreedHelpImages(false);
    }

    function heightGuide(){
        setShowHeightGuide(true);
    }

    function closeHeightGuide(){
        setShowHeightGuide(false);
    }

    function colourList(c){
        if(colour.length <= 0){
            colour.push(c);
        }
        else{
            let counter = 0;
            for(let i=0; i<colour.length; i++){
                if(c === colour[i]){
                    alert("Colour already entered");
                    counter = counter + 1;
                }
            }
            if(counter === 0){
                colour.push(c);
            }
        }
        setShowColourList(false);
        setTimeout(() => {
            setShowColourList(true);
        }, 5);
    }

    function removeColour(c){
        console.log(c);
        for(let i=0; i<colour.length; i++){
            if(colour[i] === c){
                colour.splice(colour.indexOf(c), 1);
            }
        }
        setShowColourList(false);
        setTimeout(() => {
            setShowColourList(true);
        }, 5);
    }

    function fileSubmitted(){
        if(fileImage.type.includes('image'))
        {
            setFileImagePic(URL.createObjectURL(fileImage));
            setShowFilePic(true); 
        }
        else{
            alert("Please upload an image file");
        }
    }

    function deleteImage(){
        setShowFilePic(false);
        setFileImagePic();
        setFileImage();
    }

    function closeMap(){
        setShowGoogleMap(false);
    }

    function submitLocation(){
        setLocation(googleMapsState.address);
        setShowGoogleMap(false);
    }

    async function SubmitDetails(){
        if(height === ""){
            alert("Please enter in a height");
            return;
        }
        if(colour.length <= 0){
            alert("Please enter in a colour");
            return;
        }
        console.log(colour);
        if(fileImage === ""){
            alert("Please upload a image");
            return;
        }
        if(location === ""){
            alert("Please enter a location");
            return;
        }
        else{
            console.log(height)
            const storageRef = ref(storage, `/images/${fileImage.name + new Date().getTime()}`);
            const uploadTask = uploadBytesResumable(storageRef, fileImage);
            let postnum = 0;
            const posterName = auth.currentUser.displayName;
            const posterEmail = auth.currentUser.email;
    
            await db2.ref("Posts").once('value', function(snapshot){
                if(snapshot.exists()){
                    let last = 0;
                    const postsArray = [];
                    const postsFromDatabase = snapshot.val();
                        for(let postID in postsFromDatabase){
                            postsArray.push(postsFromDatabase[postID]);
                        }
                    last = postsArray.pop();
                    postnum = last.postID + 1;
                }
                else{
                    postnum =  1;
                }
    
            })
    
            const date = Date().toLocaleString();
            const datesplit = date.split(" ");
            const day = datesplit[2];
            const month = datesplit[1];
            const year = datesplit[3];
            const timeSeconds = datesplit[4];
            const timesplit = timeSeconds.split(":");
            const time = (timesplit[0]+":"+timesplit[1]);
            const postTime = time+" "+day+"/"+month+"/"+year;
            
            if(type == "Dog"){
                uploadTask.on("state_changed", (snapshot) => {
                    const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    setProgress(prog);
                }, (err) => 
                console.log(err),
                () => {
                    const db = db2.ref("Posts");
                    getDownloadURL(uploadTask.snapshot.ref)
                    .then(async function (url) {
                        const image = url;
                        const submit = {
                            status: status.toUpperCase(),
                            postID: postnum,
                            type,
                            dogBreed,
                            height,
                            colour,
                            neutured,
                            image,
                            comments: {
                                name: null,
                                email: null,
                                comment: null,
                                commentTime: null,
                                postID: null,
                            },
                            postTime,
                            posterName,
                            posterEmail,
                            favourites: {
                                name: null,
                                email: null,
                            },
                            address: googleMapsState.address
                        };
                        await db.push(submit);
                        alert("Post Created");
                        window.location = ("/Found")
                    });
                }); 
            }
            else{
                uploadTask.on("state_changed", (snapshot) => {
                    const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    setProgress(prog);
                }, (err) => 
                console.log(err),
                () => {
                    const db = db2.ref("Posts");
                    getDownloadURL(uploadTask.snapshot.ref)
                    .then(async function (url) {
                        const image = url;
                        const submit = {
                            status: status.toUpperCase(),
                            postID: postnum,
                            type,
                            height,
                            colour,
                            neutured,
                            image,
                            comments: {
                                name: null,
                                email: null,
                                comment: null,
                                commentTime: null,
                                postID: null,
                            },
                            favourites: {
                                name: null,
                                email: null,
                            },
                            postTime,
                            posterName,
                            posterEmail,
                            address: googleMapsState.address
                        };
                        await db.push(submit);
                        alert("Post Created");
                        window.location = ("/Found")
                    });
                });
            }
        }
        
    }

    function home(){
        window.location = "/home";
    }

    function myAccount(){
        window.location = "/account";
    }

    return(
        <div id="wholePage" style= {{backgroundImage: `url(${Wallpaper})`, height: "100vh"}}>
            <title>FindMyOwner</title>
            <div id = "Title">
                {/*<h1 id="titleName" href="#" onClick={home}>FindMyOwner</h1>*/}
                <img id="titleName" onClick={home} src={FindMyOwner}></img>
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
            <br/>
            <Row>
                <Col className="col-sm-5">
                    <div id="form" style={{backgroundColor: "white"}}>
                        <h2 id="PostInfo">Enter Details Form</h2>
                        <div id="missingFound">
                            <label for="status">Status</label>
                            <select name="status" id="status" required onChange={Status} onInput = {(e) => setStatus(e.target.value.toUpperCase())}>
                                <option value="" disabled selected hidden>Missing or Found</option>
                                <option value="missing">Missing</option>
                                <option value="found">Found</option>
                            </select>
                        </div>
                        {showType?
                            <div id = "typeOfAnimal">
                                <label for="animal">Type of animal: </label>
                                <select name="animal" id="animal" required onChange={Type} onInput = {(e) => setType(e.target.value)}>
                                    <option value="" disabled selected hidden>Select a animal type</option>
                                    <option value="Dog">Dog</option>
                                    <option value="Cat">Cat</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        :null}

                        {showBreed?
                            <div id = "breed">
                                <label for="Dbreed">Dog Breed: </label>  
                                <select name="dog" id="Dbreed" onChange={DogBreed} onInput = {(breed) => setDogBreed(breed.target.value)}>
                                    <option value="" disabled selected hidden>Select a Dog Breed</option>
                                    <option value="unknown">Unknown</option>
                                    {breedList.map(function (element){
                                        return (
                                            <option>{element}</option>
                                        )
                                    })}
                                </select>
                                <button id = "breedHelp" onClick={BreedHelp}>Need Help?</button>
                                <br/>
                            </div>
                        : null}
                        {type == "other"?
                            <div style={{marginBottom: "1%"}}>
                                <label for="otherType">Enter Animal: </label>
                                <input id="otherType" type="text" min="0" max="20" onInput={(e) => setType(e.target.value)}/>
                            </div>
                        :null}
                        {showBreedGuide?
                            <div id = "breed_guide">
                                <Modal show={showBreedGuide}>
                                    <Modal.Header style={{backgroundColor: "#00bfFF"}}>
                                        <Modal.Title style={{textAlign: "center", color: "white"}}>Breed Helper</Modal.Title>
                                        <Button onClick={closeBreedHelp}>X</Button>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <label for="DbreedHelp">Select a Dog Breed to view image: </label>
                                        <select name="dogimage" id="DbreedHelp" onChange={DogImages} onInput= {(breedhelp) => setDogBreedHelp(breedhelp.target.value)}>
                                            <option value="" disabled selected hidden>Select a Dog Breed</option>
                                            {Object.keys(breedList2).map(function (element){
                                                return (
                                                    <option>{element}</option>
                                                )
                                            })}
                                        </select>
                                        {showBreedHelpImages?
                                            <div>
                                                {breedListImages.map(function (element){
                                                    return(
                                                        <img src={element} id="breedImage"></img>
                                                    )
                                                })}
                                            </div>
                                        : null}
                                        <hr></hr>
                                        <Card>
                                            <Card.Body style={{background: "gray", height: "40vh"}}>
                                                {breedIdentifierTeller?
                                                    <div>
                                                        <Card.Img src={breedIdentifierFilePic} style={{height: "36vh", marginBottom: "7%"}}></Card.Img>
                                                        {breedIdentity?<div><Card.Text>Breed: {breedIdentity}<br></br>Confidence: {confidence}%</Card.Text></div>: <Card.Text>Breed: Loading...</Card.Text>}
                                                        {breedIdentifierTeller2?<div><Card.Text style={{display: "inline"}}>Choose Another File: </Card.Text>
                                                        <input style={{position: "absolute", marginBottom: "5%", marginLeft: "2%"}} type="file" onChange={BreedIdentifier} onInput={(image) => setBreedIdentifierFile(image.target.files[0])}/></div>:null}
                                                    </div>
                                                
                                                :
                                                    <div>
                                                        <Card.Text style={{textAlign: "center", marginTop: "25%"}}>Upload Image</Card.Text>
                                                        <input style={{marginLeft: "25%"}} type="file" onChange={BreedIdentifier} onInput={(image) => (setBreedIdentifierFile(image.target.files[0]), BreedIdentifier())}/>
                                                    </div>
                                                }
                                            </Card.Body>
                                            <Card.Footer style={{marginTop: "40%"}}></Card.Footer>
                                        </Card>        
                                    </Modal.Body>
                                    <Modal.Footer style={{marginTop: "5%", backgroundColor: "#00bfFF"}}></Modal.Footer>
                                </Modal>
                            </div>
                        : null}

                        {showHeight? 
                            <div id="height">
                                <label for="heightInput">Height: </label>
                                <input id="heightInput" type="number" min = "0" max = "200" onInput={(height) => setHeight(height.target.value)}/>
                                <label for="heightInput">cm</label>
                                <button id="heightHelp" onClick={heightGuide}>?</button>
                            </div> 
                        : null}
                        {showHeightGuide?
                            <div id="height_guide">
                                <button id="closeHeightGuideButton" onClick={closeHeightGuide}>X</button>
                                <h3>Measure from the front foot of the animal to the top of the head.</h3>
                                <img id="heightGuideImage" src={heightDiagram}/>
                            </div>
                        : null}

                        {showColourChoice? 
                            <div id="colour_choice">
                                <label for="colourInput">Colour: </label>
                                <select name="colourInput" id="colourInput" onInput={(color) => colourList(color.target.value)}>
                                    <option value="" disabled selected hidden>Select a Colour</option>       
                                    <option value="Black">Black</option>
                                    <option value="White">White</option>
                                    <option value="Brown">Brown</option>   
                                    <option value="Red">Red</option>     
                                    <option value="Gold">Gold</option>    
                                    <option value="Gray">Gray</option> 
                                </select>
                            </div>
                        : null}

                        {showColourList?
                            <div>
                                <br></br>
                                {colour.map(function(color){
                                    console.log(color);
                                    return(
                                        <div style={{display: "inline"}}>
                                            <p style={{display: "inline", marginRight: "2%", border: "1px solid black", borderRadius: "15px", padding: "5px"}}>
                                                {color}<button style={{height: "10px", width: "10px", fontSize: "9px"}} onClick={() => removeColour(color)}>X</button>
                                            </p>
                                        </div>
                                    )
                                })}
                                <br></br>
                            </div>
                        :null}

                        {showNeuturedChoice?
                            <div id="neutured_choice">
                                <label for="neutured">Neutured or Spayed(Optional)</label>
                                <select name="neutured" id="neutured" onInput={(e) => setNeutured(e.target.value)}>
                                    <option value="Unknown">Unknown</option>
                                    <option value="Neutured">Neutured</option>
                                    <option value="Spayed">Spayed</option>
                                    <option value="Neither">Neither</option>
                                </select>
                            </div>
                        : null}

                        {showFileUpload?
                            <div id="file_upload">
                                <input type="file" onChange={fileSubmitted} onInput={(image) => setFileImage(image.target.files[0])}/>
                            </div>
                        :null}
                        {showFilePic?
                            <div id="show_image_submitted">
                                <button id = "remove_image" onClick={deleteImage}>X</button>
                                <img src={fileImagePic} height={"25%"} width={"25%"} ></img>
                            </div>
                        :null}

                        {showLocationPick?
                            <div>
                                <div>
                                    Address: <p>{location}</p>
                                </div>
                                <div id="Map">
                                    <h3>Uploaded {progress}%</h3>
                                    <Button onClick={() => setShowGoogleMap(true)}>Open Map</Button>

                                    <Modal show={showGoogleMap} onHide={closeMap}>
                                        <Modal.Header>
                                            <Modal.Title>Pick Location</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body style={{height: "50vh", width:"60vh", marginBottom: "5%"}}>
                                            <GoogleMap id = "googleMap" />
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button onClick={submitLocation}>Submit</Button>
                                            <Button onClick={closeMap}>Close Map</Button>
                                        </Modal.Footer>
                                    </Modal>
                                </div>
                                <div>
                                    <Button id="submitButton" variant="outline-success" onClick={SubmitDetails}>Submit</Button> 
                                </div>
                            </div>
                        : null}
                    </div>
                </Col>
                
                <Col className="col-sm-3" style={{marginLeft: "13%"}}>
                    <div id="postPrototype">
                            <Card className="shadow-lg" border="info" style={{ width: '100%', borderRadius: "25px"/*, marginLeft:"1%"*/}}>
                                <Card.Header style={{textAlign: "center"}}><h5>{status}</h5></Card.Header>
                                <Card.Text style={{opacity: "0.5", textAlign: "center"}}>Posted by {auth.currentUser.displayName}</Card.Text>
                                <Card.Img  variant="top" src={fileImagePic} style={{border: "1px solid black", marginRight: "auto", marginLeft: "auto", height: "30vh", width: "20vw", borderRadius: "25px"}}/>
                                <Card.Body>
                                    <Card.Text><h3 style={{display: "inline"}}>Type: </h3>{type}</Card.Text>
                                    {type === "Dog"?<Card.Text><h3 style={{display: "inline"}}>Breed: </h3>{dogBreed}</Card.Text>:null}
                                    <Card.Text><h3 style={{display: "inline"}}>Height: </h3>{height}cm</Card.Text>
                                    <Card.Text><h3 style={{display: "inline"}}>Colour: </h3>{colour?.map(function(element) {return(<div style={{display: "inline", marginRight:"2%", border: "1px solid black", borderRadius: "25px", padding: "1%"}}>{element}</div>)})}</Card.Text>
                                    {neutured != ""?<Card.Text><h3 style={{display: "inline"}}>The animal is: </h3>{neutured}</Card.Text>:null}
                                    {status === "FOUND"?<Card.Text><h3 style={{display: "inline"}}>Found at: </h3>{location}</Card.Text>:
                                    <Card.Text><h3 style={{display: "inline"}}>Last seen at: </h3>{location}</Card.Text>}
                                </Card.Body>
                            </Card>
                    </div>
                </Col>
            </Row>
        </div>
    )
}