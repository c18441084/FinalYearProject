import { useState, useEffect } from 'react';
import './FoundPetDetails.css';
import '../Found/Found';
import { Button, Modal, Dropdown } from "react-bootstrap";
import settingsIcon from "../../SettingsIcon.png";
import 'bootstrap/dist/css/bootstrap.min.css';
import heightDiagram from './Height_Diagram.png';
import GoogleMap, { MapContainer } from './GoogleMaps';
import { googleMapsState } from '../GlobalState/states';
import db2, {storage, ref, getDownloadURL, logout} from "../../firebaseconfig";
import { uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { auth } from '../../firebaseconfig';
import beagle  from '../../beagle.jpg';
import { mdiAlertOutline } from '@mdi/js';
import Icon from '@mdi/react'


//-------------------------------------------------------------------------
/*import AWS from 'aws-sdk';

// Import required AWS SDK clients and commands for Node.js.
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
//import { s3Client } from "./libs/s3Client.js"; // Helper function that creates an Amazon S3 service client module.
import {path} from "path";
import {fs} from "fs";

const file = '/Users/niallmcnamara/Desktop/fyprep/FinalYearProject/src/beagle.jpg'; // Path to and name of object. For example '../myFiles/index.js'.
const fileStream = fs.createReadStream(file);

// Set the parameters
export const uploadParams = {
  Bucket: "BUCKET_NAME",
  // Add the required 'Key' parameter using the 'path' module.
  Key: path.basename(file),
  // Add the required 'Body' parameter
  Body: fileStream,
};


// Upload file to specified bucket.
export const run = async () => {
  try {
    const data = await S3Client.send(new PutObjectCommand(uploadParams));
    console.log("Success", data);
    return data; // For unit tests.
  } catch (err) {
    console.log("Error", err);
  }
};
run();*/

//----------------------------------------------------------------------------------------------

export default function FoundPetDetails(){

    const [status, setStatus] = useState("");
    const [type, setType] = useState("");
    const [dogBreed, setDogBreed] = useState("");
    const [height, setHeight] = useState("");
    const [colour, setColour] = useState([]);
    const [neutured, setNeutured] = useState("");
    const [location, setLocation] = useState();

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
    const [dogBreedHelp, setDogBreedHelp] = useState("");
    const [breedListImages, setBreedListImages] = useState([]);
    const [fileImage, setFileImage] = useState("");
    const [fileImagePic, setFileImagePic] = useState();
    const [progress, setProgress] = useState(0);

    async function componentDidMount(){
        const response = await fetch("https://dog.ceo/api/breeds/list/all");
        const data = await response.json();
        setBreedList(data.message);
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
        if(type === "dog"){
            if(status === "found"){
                alert(<Icon path={mdiAlertOutline} size={1} ></Icon> + "Warning! \nIt is a legal requirement to report a stray dog to the dog warden service. To read more you can view the DWS section at the homepage of the website.")
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
        colour.push(c);
        setShowColourList(true);
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
        setFileImagePic("");
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
        }
        if(colour === ""){
            alert("Please enter in a colour");
        }
        if(fileImage === ""){
            alert("Please upload a image");
        }
        else{
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
            
            if(type == "dog"){
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

    //------------------------------------------------------------------------------------------------
    /*useEffect(() => {
        
        var AWS = require('aws-sdk');

        const bucket = 'bucket';
        const photo = beagle;

        const config = new AWS.Config({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION
        })
        
        AWS.config.update({region:"eu-west-1"});

        const client = new AWS.Rekognition();
        const params = {
            Image: {
                S3Object: {
                    Bucket: bucket,
                    Name: photo
                 },
            },
            MaxLabels: 10
        }
        client.detectLabels(params, function(err, response) {
            if(err){
                console.log(err, err.stack); // if an error occurred
            } 
            else{
                console.log("hello");
                console.log(`Detected labels for: ${photo}`)
                response.Labels.forEach(label => {
                console.log(`Label:      ${label.Name}`)
                console.log(`Confidence: ${label.Confidence}`)
                console.log("Instances:")
                label.Instances.forEach(instance => {
                    let box = instance.BoundingBox
                    console.log("  Bounding box:")
                    console.log(`    Top:        ${box.Top}`)
                    console.log(`    Left:       ${box.Left}`)
                    console.log(`    Width:      ${box.Width}`)
                    console.log(`    Height:     ${box.Height}`)
                    console.log(`  Confidence: ${instance.Confidence}`)
                })
                console.log("Parents:")
                label.Parents.forEach(parent => {
                    console.log(`  ${parent.Name}`)
                })
                console.log("------------")
                console.log("")
                }) // for response.labels
            } // if
        });
    })*/

    //------------------------------------------------------------------------------------------------
    return(
        <div id="wholePage">
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
            <br/>
            <div id="form">
                <h2 id="PostInfo">Enter Details Form</h2>
                <div id="missingFound">
                    <label for="status">Status</label>
                    <select name="status" id="status" required onChange={Status} onInput = {(e) => setStatus(e.target.value)}>
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
                            <option value="dog">Dog</option>
                            <option value="cat">Cat</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                :null}

                {showBreed?
                    <div id = "breed">
                        <label for="Dbreed">Dog Breed: </label>  
                        <select name="dog" id="Dbreed" onChange={DogBreed} onInput = {(breed) => setDogBreed(breed.target.value)}>
                            <option value="" disabled selected hidden>Select a Dog Breed</option>
                            <option value="unknown">Unknown</option>
                            {Object.keys(breedList).map(function (element){
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
                        <button id="closeBreedGuideButton" onClick={closeBreedHelp}>X</button>
                        <br/>
                        <label for="DbreedHelp">Select a Dog Breed to view image: </label>
                        <select name="dogimage" id="DbreedHelp" onChange={DogImages} onInput= {(breedhelp) => setDogBreedHelp(breedhelp.target.value)}>
                            <option value="" disabled selected hidden>Select a Dog Breed</option>
                            {Object.keys(breedList).map(function (element){
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
                    <div /*style={{display: "inline"}}*/>
                        <br></br>
                        {colour.map(function(color){
                            //console.log(color);
                            <div>
                                <p>
                                    {color}<Button>X</Button>
                                </p>
                            </div>
                        })}
                    </div>
                :null}

                {showNeuturedChoice?
                    <div id="neutured_choice">
                        <label for="neutured">Neutured or Spayed(Optional)</label>
                        <select name="neutured" id="neutured" onInput={(e) => setNeutured(e.target.value)}>
                            <option value="unknown">Unknown</option>
                            <option value="neutured">Neutured</option>
                            <option value="spayed">Spayed</option>
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
                            <h3>Address: </h3><p>{location}</p>
                        </div>
                        <div>
                            <Button id="submitButton" variant="outline-success" onClick={SubmitDetails}>Submit</Button> 
                        </div>
                        <div id="Map">
                            <h3>Uploaded {progress}%</h3>
                            <Button onClick={() => setShowGoogleMap(true)}>Open Map</Button>

                            <Modal show={showGoogleMap} onHide={closeMap}>
                                <Modal.Header>
                                    <Modal.Title>Pick Location</Modal.Title>
                                </Modal.Header>
                                <Modal.Body style={{height: "50vh", width:"60vh"}}>
                                    <GoogleMap id = "googleMap" />
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button onClick={submitLocation}>Submit</Button>
                                    <Button onClick={closeMap}>Close Map</Button>
                                </Modal.Footer>
                            </Modal>
                        </div>
                    </div>
                : null}
            </div>
        </div>
    )
}