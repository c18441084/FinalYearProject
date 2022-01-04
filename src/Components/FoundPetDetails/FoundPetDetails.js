import { useState } from "react"
import './FoundPetDetails.css'

export default function FoundPetDetails(){

    const [type, setType] = useState("");
    const [dogBreed, setDogBreed] = useState("");

    const [showBreed, setShowBreed] = useState(false);
    const [showHeight, setShowHeight] = useState(false);

    const [breedList, setBreedList] = useState([]);

    async function componentDidMount(){
        const Dog_Breeds_url = "https://dog.ceo/api/breeds/list/all";
        const response = await fetch(Dog_Breeds_url);
        const data = await response.json();
        setBreedList(data.message);
    }

    function Type(){
        console.log(type);
        setShowBreed(false);
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

    function heightGuide(){
        alert("Measure from the front foot of the animal to the top of the head.")
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
                    <br/>
                </div>
            : null}

            {showHeight? 
                <div id="height">
                    <label for="heightInput">Height: </label>
                    <input id="heightInput" type="number" min = "0" max = "200"/>
                    <p>cm</p>
                    <button id="heightHelp" onClick={heightGuide}>?</button>
                </div> 
            : null}
        </div>
    )
}