import { useState } from 'react';
import './FoundPetDetails.css';
import '../Found/Found';
import { Button }  from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import heightDiagram from './Height_Diagram.png';
import GoogleMap, { MapContainer } from './GoogleMaps';
import db2, {storage, ref, getDownloadURL} from "../../firebaseconfig";
import { uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { auth } from '../../firebaseconfig';

export default function FoundPetDetails(){

    const [type, setType] = useState("");
    const [dogBreed, setDogBreed] = useState("");
    const [height, setHeight] = useState("");
    const [colour, setColour] = useState("");
    const [neutured, setNeutured] = useState("");

    const [showBreed, setShowBreed] = useState(false);
    const [showBreedGuide, setShowBreedGuide] = useState(false);
    const [showBreedHelpImages, setShowBreedHelpImages] = useState(false);
    const [showHeight, setShowHeight] = useState(false);
    const [showHeightGuide, setShowHeightGuide] = useState(false);
    const [showColourChoice, setShowColourChoice] = useState(false);
    const [showNeuturedChoice, setShowNeuturedChoice] = useState(false);
    const [showFileUpload, setShowFileUpload] = useState(false);
    const [showFilePic, setShowFilePic] = useState(false);
    const [showLocationPick, setShowLocationPick] = useState(false);

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

    function Type(){
        console.log(type);
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
        if(type == "dog"){
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

    function fileSubmitted(){
        if(fileImage.type.includes('image'))
        {
            setFileImagePic(URL.createObjectURL(fileImage));
            setShowFilePic(true); 
            console.log(MapContainer.state);
        }
        else{
            alert("Please upload an image file");
        }
    }

    function deleteImage(){
        setShowFilePic(false);
        setFileImagePic("");
    }

    function LocationPicker(){
        console.log("Hi");
    }

    async function SubmitDetails(){
        if(type == "dog"){
            const storageRef = ref(storage, `/images/${fileImage.name + new Date().getTime()}`);
            const uploadTask = uploadBytesResumable(storageRef, fileImage);
            let postnum = 0;
            const posterName = auth.currentUser.displayName;
    
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
            const postTime = time+" "+day+"th "+month+" "+year;
    
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
                    };
                    await db.push(submit);
                    alert("Post Created");
                    window.location = ("/Found")
                });
            }); 
        }
        else{
            const storageRef = ref(storage, `/images/${fileImage.name + new Date().getTime()}`);
            const uploadTask = uploadBytesResumable(storageRef, fileImage);
            let postnum = 0;
            const posterName = auth.currentUser.displayName;

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
            const postTime = time+" "+day+"th "+month+" "+year;

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
                        postTime,
                        posterName,
                    };
                    await db.push(submit);
                    alert("Post Created");
                    window.location = ("/Found")
                });
            });
        }
        
    }

    return(
        <div id="wholePage">
            <title>FindMyOwner</title>
            <div id = "Title">
                <h1>FindMyOwner</h1>
            </div>
            <br/>
            <div id="form">
                <h2 id="PostInfo">Enter Details Form</h2>
                <div id = "typeOfAnimal">
                    <label for="animal">Type of animal: </label>
                    <select name="animal" id="animal" required onChange={Type} onInput = {(e) => setType(e.target.value)}>
                        <option value="" disabled selected hidden>Select a animal type</option>
                        <option value="dog">Dog</option>
                        <option value="cat">Cat</option>
                        <option value="other">Other</option>
                    </select>
                </div>

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
                {showBreedGuide?
                    <div id = "breed_guide">
                        <button id="closeBreedGuideButton" onClick={closeBreedHelp}>X</button>
                        <br/>
                        <label for="DbreedHelp">Select a Dog Breed to view image: </label>
                        <select name="dogimage" id="DbreedHelp" onChange={DogImages} onInput= {(breedhelp) => setDogBreedHelp(breedhelp.target.value)}>
                            <option value="" disabled selected hidden>Select a Dog Breed</option>
                            {Object.keys(breedList).map(function (element){
                                console.log(element);
                                return (
                                    <option>{element}</option>
                                )
                            })}
                        </select>
                        {showBreedHelpImages? 
                            <div>
                                {breedListImages.map(function (element){
                                    console.log("in");
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
                        <input id="colourInput" type="text" min="0" max="20" onInput={(colour) => setColour(colour.target.value)}/>
                    </div>
                : null}

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
                            <Button id="submitButton" variant="outline-success" onClick={SubmitDetails}>Submit</Button> 
                        </div>
                        <div id="Map">
                            <h3>Uploaded {progress}%</h3>
                            <GoogleMap id = "googleMap" onChange={LocationPicker}/>
                        </div>
                    </div>
                : null}
            </div>
        </div>
    )
}