import { useState } from 'react';
import './FoundPetDetails.css';
import '../Found/Found';
import { Button, Modal, Dropdown, Col, Card, Row, Image, Form, Badge, Container } from "react-bootstrap";
import ReactTooltip from 'react-tooltip';
import 'bootstrap/dist/css/bootstrap.min.css';
import heightDiagram from './Height_Diagram.png';
import GoogleMap from './GoogleMaps';
import { googleMapsState, animalType } from '../GlobalState/states';
import db2, {storage, ref, getDownloadURL} from "../../firebaseconfig";
import { uploadBytesResumable } from 'firebase/storage';
import { auth } from '../../firebaseconfig';
import { accessKeyId, secretAccessKey } from '../../keys';
import Wallpaper from '../../Wallpaper.jpg';
import FindMyOwner from '../Login/loginPictures/FindMyOwner.png';
import Icon from '@mdi/react';
import { mdiHelpCircleOutline } from '@mdi/js';
import { mdiRuler } from '@mdi/js';
import { mdiMapMarker } from '@mdi/js';
import { mdiMicrosoftXboxControllerMenu } from '@mdi/js';
import { Settings } from '../Settings/Settings';

export default function FoundPetDetails(){

    const [status, setStatus] = useState("");
    const [type, setType] = useState("");
    const [type2, setType2] = useState("");
    const [dogBreed, setDogBreed] = useState("");
    const [height, setHeight] = useState("");
    const [colour, setColour] = useState([]);
    const [neutured, setNeutured] = useState("Unknown");
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
    const [breedIdentifierFile, setBreedIdentifierFile] = useState();
    const [breedIdentifierFilePic, setBreedIdentifierFilePic] = useState();
    const [breedIdentifierTeller, setBreedIdentifierTeller] = useState(false);
    const [breedIdentifierTeller2, setBreedIdentifierTeller2] = useState(false);
    const [identifierData, setIdentifierData] = useState();
    const [results, setResults] = useState([]);
    const [Loading, setLoading] = useState(false);
    const [otherColour, setOtherColour] = useState("");

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
        setColour([]);
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
        setColour([]);
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
        setLoading(true);
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
            MaxLabels: 15,
            MinConfidence: 50
        }

        const rekognition = new AWS.Rekognition();

        let getResults = []
        let d = 0;
        let breed = 0;
        let confidencePercent = 0;
        let errorLoading = 0;
        setTimeout(() => {
            rekognition.detectLabels(params, function(err, data){
                if(err){
                    console.log(err, err.stack); 
                    errorLoading = (err);
                }
                else{
                    setIdentifierData(data); 
                    d = data;
                } 
            });
        }, 1500)
        setTimeout(() => {
            if(errorLoading != 0){
                alert("Error loading image. Please only upload JPG or PNG file");
                setBreedIdentity("Error");
                setBreedIdentifierTeller2(true);
                errorLoading = 0;
            }
            else{
                console.log(d);
                for(let i=0; i<d.Labels.length; i++){
                    Object.values(d.Labels[i].Parents).map((element, index) =>{
                        if(element.Name === "Dog" && d.Labels[i].Name != "Puppy"){
                            breed = d.Labels[i].Name;
                            confidencePercent = d.Labels[i].Confidence;
                            confidencePercent = Math.round(confidencePercent);
                            console.log(breed);
                            let obj = {};
                            obj[breed] = confidencePercent;
                            getResults.push(obj)
                        }
                    })
                }
                if(breed === 0){
                    alert("Dog not recognised.")
                    setBreedIdentity("Dog not recognised. Please try take a closer picture");
                }
                setBreedIdentifierTeller2(true);
            }
            setResults(getResults);
            console.log(results);
            setLoading(false);
            deleteFromS3(name);
        }, 5000)
    }

    function deleteFromS3(name){
        AWS.config.update({
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            region: "eu-west-1"
        });

        const s3 = new AWS.S3();

        console.log(s3);
        const params = {
            Bucket: "myawsfindmyownerbucket",
            Key: name
        }

        setTimeout(() => {
            s3.deleteObject(params, function(err, data) {
                if (err){
                    console.log(err, err.stack); 
                }
                else{
                    console.log(data);           
                }     
            });
        }, 10000)
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
        console.log(c)
        if(!(type === "Dog") && !(type === "Cat")){
            let test = otherColour.charAt(0).toUpperCase() + otherColour.slice(1);
            c = test;
        }
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
            const posterID = auth.currentUser.uid;
    
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
                        window.location = ("/FindMyOwner/home")
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
                            posterID,
                            address: googleMapsState.address
                        };
                        await db.push(submit);
                        alert("Post Created");
                        window.location = ("/FindMyOwner/home")
                    });
                });
            }
        }
        
    }

    function home(){
        window.location = "/FindMyOwner/home";
    }

    function found(){
        window.location = "/FindMyOwner/found";
    }

    function lost(){
        window.location = "/FindMyOwner/lost";
    }

    function dws(){
        window.location = "/FindMyOwner/dog-warden-service";

    }

    return(
        <div id="wholePage" style= {{backgroundImage: `url(${Wallpaper})`, height: "full", paddingBottom: "5%"}}>
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
                        <Dropdown.Item onClick={dws}>DWS</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown> 

                <Image id="titleName" onClick={home} src={FindMyOwner} style={{marginLeft: "33%"}}></Image>
                <Settings />
            </div>
            <br/>
            <Row>
                <Col className="col-sm-5">
                    <Badge id="FPDEnterDetailsBadge" bg="info"><h1>Report Form</h1></Badge>
                    <Container style={{maxWidth: "700px"}}>
                        <Card id="FPDForm">
                            <Card.Header>Enter Details Form</Card.Header>
                            <Form>
                                <Form.Group className='mt-3 mb-2'>
                                    <Form.Label id="FPDStatusLabel">Status: </Form.Label>
                                    <Form.Select id="FPDStatusOption" required onChange={Status} onInput = {(e) => setStatus(e.target.value.toUpperCase())}>
                                        <option value="" disabled selected="selected">Missing or Found</option>
                                        <option value="missing">Missing</option>
                                        <option value="found">Found</option>
                                    </Form.Select>
                                </Form.Group>

                                {showType?
                                <Form.Group className='mt-1 mb-2'>
                                    <Form.Label id="FPDTypeLabel">Type: </Form.Label>
                                    <Form.Select id="FPDTypeOption" required onChange={Type} onInput = {(e) => (setType(e.target.value), setType2(e.target.value))}>
                                            <option value="" disabled selected="selected">Select a animal type</option>
                                            <option value="Dog">Dog</option>
                                            <option value="Cat">Cat</option>
                                            <option value="Other">Other</option>
                                    </Form.Select>
                                </Form.Group>
                                :null}

                                {type2 == "Other"?
                                    <Form.Group className='mt-1 mb-2'>
                                        <Form.Label id="FPDOtherTypeLabel">Animal: </Form.Label>
                                        <Form.Control id="FPDOtherTypeControl" placeholder="Enter Animal" type="text" min="0" max="20" onInput={(e) => setType(e.target.value)}/>
                                    </Form.Group>
                                :null}

                                {showBreed?
                                <Form.Group className='mt-1 mb-2'>
                                    <Form.Label id="FPDBreedLabel">Dog Breed: </Form.Label>
                                        <Form.Select name="dog" id="FPDBreedOption" onChange={DogBreed} onInput = {(breed) => setDogBreed(breed.target.value)}>
                                            <option value="" disabled selected="selected">Select a Dog Breed</option>
                                            <option value="unknown">Unknown</option>
                                            {breedList.map(function (element){
                                                return (
                                                    <option>{element}</option>
                                                )
                                            })}
                                        </Form.Select>
                                        <Button data-tip data-for="BreedHelpButton" id="FPDBreedHelpButton" variant="outline-primary" onClick={BreedHelp}>
                                            <Icon path={mdiHelpCircleOutline} size={1}></Icon>
                                        </Button>
                                        <ReactTooltip id="BreedHelpButton" place="top" effect="solid">Breed Identifier</ReactTooltip>
                                </Form.Group>
                                :null}

                                {showBreedGuide?
                                <div id = "breed_guide">
                                    <Modal show={showBreedGuide}>
                                        <Modal.Header id="FPDBreedModalHeader">
                                            <Modal.Title id="FPDBreedModalTitle">Breed Helper</Modal.Title>
                                            <Button variant="warning" onClick={closeBreedHelp}>X</Button>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <label for="DbreedHelp">Select a Dog Breed to view image: </label>
                                            <select name="dogimage" id="DbreedHelp" onChange={DogImages} onInput= {(breedhelp) => setDogBreedHelp(breedhelp.target.value)}>
                                                <option value="" disabled selected="selected">Select a Dog Breed</option>
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
                                                            <Image src={element} id="breedImage"></Image>
                                                        )
                                                    })}
                                                </div>
                                            : null}
                                            <hr></hr>
                                            <Card>
                                                <Card.Body id="FPDBreedCardBody">
                                                    {breedIdentifierTeller?
                                                        <div>
                                                            <Card.Img src={breedIdentifierFilePic} id="FPDBreedCardImg"></Card.Img>
                                                            {Loading? 
                                                                <Card.Text id="FPDBreedResults">Loading...</Card.Text> 
                                                                :
                                                                results.map(function(element) {
                                                                    return(
                                                                        <Card.Text id="FPDBreedResults">
                                                                            Breed: {Object.keys(element)}
                                                                            <br></br>
                                                                            Confidence: {Object.values(element)}%
                                                                        </Card.Text>
                                                                    )
                                                                })
                                                            }
                                                            {breedIdentifierTeller2?<div><Card.Text style={{display: "inline"}}>Choose Another File: </Card.Text>
                                                            <input id="FPDBreedCardImgInput2" type="file" onChange={BreedIdentifier} onInput={(image) => setBreedIdentifierFile(image.target.files[0])}/></div>:null}
                                                        </div>
                                                    
                                                    :
                                                        <div>
                                                            <Card.Text style={{textAlign: "center", marginTop: "25%"}}>Upload Image</Card.Text>
                                                            <input id="FPDBreedCardImgInput" type="file" onChange={BreedIdentifier} onInput={(image) => (setBreedIdentifierFile(image.target.files[0]), BreedIdentifier())}/>
                                                        </div>
                                                    }
                                                </Card.Body>
                                            </Card>        
                                        </Modal.Body>
                                        <Modal.Footer id="FPDBreedModalFooter"></Modal.Footer>
                                    </Modal>
                                </div>
                                : null}

                            {showHeight? 
                            <Form.Group className='mt-1 mb-2'>
                                    <Form.Label id="FPDHeightLabel">Height: </Form.Label>
                                    <Form.Control id="FPDHeightControl" placeholder= "Enter Height" type="number" min = "0" max = "200" onInput={(height) => setHeight(height.target.value)} />
                                    <Form.Label id="FPDHeightControlcm">cm</Form.Label>

                                    <Button id="FPDHeightHelpButton" data-tip data-for="HeightHelpButton" onClick={heightGuide}>
                                        <Icon path={mdiRuler} size={1}></Icon>
                                    </Button>
                                    <ReactTooltip id="HeightHelpButton" place="top" effect="solid">Height Helper</ReactTooltip>
                                </Form.Group>
                                : null}

                                {showHeightGuide?
                                <Modal id="FPDHeightModal" show={showHeightGuide}>
                                    <Modal.Header id="FPDHeightModalHeader">
                                        <Modal.Title id="FPDHeightModalTitle">Height Helper</Modal.Title>
                                        <Button onClick={closeHeightGuide} variant="warning">X</Button>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Image id="FPDHeightModalImage" src={heightDiagram}></Image>
                                    </Modal.Body>
                                    <Modal.Footer id="FPDHeightModalFooter">
                                        <Button onClick={closeHeightGuide} variant="warning">Close</Button>
                                    </Modal.Footer>
                                </Modal>
                                : null}

                                {showColourChoice? 
                                <div>
                                    {type === "Dog" || type === "Cat"? 
                                    <Form.Group className='mt-1 mb-2'>
                                        <Form.Label id="FPDColourLabel">Colour: </Form.Label>
                                        <Form.Select id="FPDColourOption" onInput={(color) => colourList(color.target.value)}>
                                                <option value="" disabled selected="selected">Select a Colour</option>       
                                                <option value="Black">Black</option>
                                                <option value="Brown">Brown</option>  
                                                <option value="Gold">Gold</option>    
                                                <option value="Gray">Gray</option>  
                                                <option value="Red">Red</option>     
                                                <option value="White">White</option>
                                        </Form.Select>
                                    </Form.Group>
                                    :
                                    <Form.Group className='mt-1 mb-2'>
                                        <Form.Label id="FPDColourLabel">Colour: </Form.Label>
                                        <Form.Control id="FPDOtherColourOption" placeholder="Enter Colour" type="text" onChange={(colour) => setOtherColour(colour.target.value)} />
                                        <Button onClick={() => colourList()}>Add</Button>
                                    </Form.Group>}
                                </div>
                                : null}  

                                {showColourList?
                                <Form.Group>
                                    {colour.map(function(color){
                                        console.log(color);
                                        return(
                                            <div style={{display: "inline"}}>
                                                <p style={{display: "inline", marginRight: "2%", border: "1px solid black", borderRadius: "15px", padding: "5px"}}>
                                                    {color}<Button size="sm" style={{height: "10px", width: "10px", fontSize: "9px"}} onClick={() => removeColour(color)}>X</Button>
                                                </p>
                                            </div>
                                        )
                                    })}
                                </Form.Group>
                                :null}      

                                {showNeuturedChoice?
                                <Form.Group className='mt-1 mb-2'>
                                    <Form.Label id="FPDNeuturedLabel">Neutured/Spayed: </Form.Label>
                                    <Form.Select id="FPDNeuturedOption" onInput={(e) => setNeutured(e.target.value)}>
                                        <option value="Unknown" disabled selected="selected">Optional</option>
                                        <option value="Unknown">Unknown</option>
                                        <option value="Neutured">Neutured</option>
                                        <option value="Spayed">Spayed</option>
                                        <option value="Neither">Neither</option>
                                    </Form.Select>
                                </Form.Group>
                                : null} 

                                {showFileUpload?
                                <Form.Group className='mt-1 mb-2'>
                                    <Form.Label id="FPDFileUploadLabel">Upload Image: </Form.Label>
                                    <Form.Control id="FPDFileUpload" type="file" onChange={fileSubmitted} onInput={(image) => setFileImage(image.target.files[0])}/>
                                </Form.Group>
                                :null}

                                {showLocationPick?
                                    <Form.Group>
                                        <Form.Label>Address: </Form.Label>
                                        <Form.Text>{location}</Form.Text>
                                        <Button id="FPDOpenGoogleMap" data-tip data-for="OpenGoogleButton" onClick={() => setShowGoogleMap(true)}>
                                            <Icon path={mdiMapMarker} size={1}></Icon>
                                        </Button>
                                        <ReactTooltip id="OpenGoogleButton" place="top" effect="solid">Open Map</ReactTooltip>
                                        <Modal show={showGoogleMap} onHide={closeMap}>
                                            <Modal.Header id="FPDGoogleModalHeader">
                                                <Modal.Title>Pick Location</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body style={{height: "50vh", width:"60vh", marginBottom: "7%"}}>
                                                <GoogleMap id = "googleMap" />
                                            </Modal.Body>
                                            <Modal.Footer id="FPDGoogleModalFooter">
                                                <Button variant="warning" onClick={submitLocation}>Submit</Button>
                                                <Button variant="warning" onClick={closeMap}>Close Map</Button>
                                            </Modal.Footer>
                                        </Modal>
                                        <br></br>
                                        <Button id="FPDSubmitButton" variant="outline-success" onClick={SubmitDetails}>Submit</Button>
                                        <br></br>
                                        {progress? <Form.Text>Uploaded {progress}%</Form.Text> :null}
                                    </Form.Group>
                                    
                                : null}
                            </Form>
                        </Card>
                    </Container>
                </Col>
                
                <Col className="col-sm-3" id="FPDPrototypeColumn">
                    <Badge id="FPDPrototypeBadge" bg="info"><h1>Prototype Post</h1></Badge>
                    <div id="postPrototype">
                            <Card className="shadow-lg" border="info" id="FPDPrototypeCard">
                                {status === "MISSING"? <Card.Header id="FPDPrototypeCardHeader" style={{backgroundColor: "lightyellow"}}><h5>{status}</h5></Card.Header> : null}
                                {status === "FOUND"? <Card.Header id="FPDPrototypeCardHeader" style={{backgroundColor: "lightblue"}}><h5>{status}</h5></Card.Header> : null}
                                <Card.Text id="FPDPrototypePoster">Posted by {auth.currentUser.displayName}</Card.Text>
                                <Card.Img  variant="top" src={fileImagePic} id="FPDPrototypeImage"/>
                                <Card.Body>
                                    <Card.Text><h3 id="FPDPrototypeType">Type: </h3>{type}</Card.Text>
                                    {type === "Dog"?<Card.Text><h3 id="FPDPrototypeDogBreed">Breed: </h3>{dogBreed}</Card.Text>:null}
                                    <Card.Text><h3 id="FPDPrototypeHeight">Height: </h3>{height}cm</Card.Text>
                                    <Card.Text><h3 id="FPDPrototypeColour">Colour: </h3>{colour?.map(function(element) {return(<div style={{display: "inline", marginRight:"2%", border: "1px solid black", borderRadius: "25px", padding: "1%"}}>{element}</div>)})}</Card.Text>
                                    {neutured != ""?<Card.Text><h3 id="FPDPrototypeNeutered">Neutered/Spayed: </h3>{neutured}</Card.Text>:null}
                                    {status === "FOUND"?<Card.Text><h3 id="FPDPrototypeAddress">Found at: </h3>{location}</Card.Text>:
                                    <Card.Text><h3 id="FPDPrototypeAddress">Last seen at: </h3>{location}</Card.Text>}
                                </Card.Body>
                            </Card>
                    </div>
                </Col>
            </Row>
        </div>
    )
}