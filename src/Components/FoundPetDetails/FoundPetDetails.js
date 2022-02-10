import { useState } from 'react';
import './FoundPetDetails.css';
import heightDiagram from './Height_Diagram.png';
import GoogleMap from './GoogleMaps';

/* Add in inputs from ISPCA  */

export default function FoundPetDetails(){

    const [type, setType] = useState("");
    const [dogBreed, setDogBreed] = useState("");
    const [height, setHeight] = useState("");
    const [colour, setColour] = useState("");
    const [neutured, setNeutured] = useState("");
    const [fileImagePic, setFileImagePic] = useState();

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

    async function Map(){
        const response = await fetch("https://maps.googleapis.com/map/api/js?key=AIzaSyAYQTc2e1XUgfTFKbwnYhlymFx4treFAa8&callback=initMap");
        const data = await response.json()
        console.log("Map: " + data);
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
            Map();
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
        }
        else{
            alert("Please upload an image file");
        }
    }

    function deleteImage(){
        setShowFilePic(false);
        setFileImagePic();
    }

    function LocationPicker(){

    }

    return(
        <div>
            <h1>Enter Details</h1>
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
                <div id="Map">
                    <GoogleMap id = "googleMap" />
                </div>
            : null}
        </div>
    )
}