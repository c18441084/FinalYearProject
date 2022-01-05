import { useState } from "react"
import './FoundPetDetails.css'
import heightDiagram from './Height_Diagram.png'

export default function FoundPetDetails(){

    const [type, setType] = useState("");
    const [dogBreed, setDogBreed] = useState("");
    const [dogBreedHelp, setDogBreedHelp] = useState("");

    const [showBreed, setShowBreed] = useState(false);
    const [showBreedGuide, setShowBreedGuide] = useState(false);
    const [showBreedHelpImages, setShowBreedHelpImages] = useState(false);
    const [showHeight, setShowHeight] = useState(false);
    const [showHeightGuide, setShowHeightGuide] = useState(false);

    const [breedList, setBreedList] = useState([]);
    const [breedListImages, setBreedListImages] = useState([]);

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
        if(type == "dog"){
            setShowBreed(true);
            componentDidMount();
        }
        else{
            setShowHeight(true);
        }
    }

    function DogBreed(){
        setShowHeight(true);
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


    return(
        <div>
            <h1>Howya</h1>
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
                <div id = "dogBreed">
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
                <div id = "dogBreedHelp">
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
                    <input id="heightInput" type="number" min = "0" max = "200"/>
                    <p id="centimetres">cm</p>
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
        </div>
    )
}