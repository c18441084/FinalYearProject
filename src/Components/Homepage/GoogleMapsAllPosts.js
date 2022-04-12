import React, { Component } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import { Modal, Button } from "react-bootstrap";
import { googleAPIkey, geocodeAPIkey } from '../../keys';
import { googleMapsState } from '../GlobalState/states';
import Geocode from "react-geocode";
import googleMapsMarkerIconDog from '../FoundPetDetails/GoogleMapsMarkers/googleMapsMarkerIconDog.png'
import googleMapsMarkerIconCat from '../FoundPetDetails/GoogleMapsMarkers/googleMapsMarkerIconCat.png'
import googleMapsMarkerIconPaw from '../FoundPetDetails/GoogleMapsMarkers/googleMapsMarkerIconPaw.png'
import db2 from '../../firebaseconfig';
import {Link} from 'react-router-dom';


const style = {
  maxWidth: "90%",
  height: "90%",
  textAlign: "center",
  overflowX: "hidden",
  overflowY: "hidden",
  marginLeft: "1.6%",
  marginBottom: "40%"
}


let urlPic = 0;

const db = db2.ref("Posts");

let postsArray = [];

let coordinates = [];

let activeMarker = 0;


db.on("value", (snap) => {
    const postsFromDatabase = snap.val();
    postsArray = [];
    for(let id in postsFromDatabase){
        postsArray.push({id, ...postsFromDatabase[id]})
    }
})

setTimeout(() => {
    postsArray?.map(function(element){
        let address = element.address;
        Geocode.setApiKey(geocodeAPIkey)
        Geocode.fromAddress(address).then(
            async (response) => {
                const { lat, lng } = await response.results[0].geometry.location;
                if(element.type === "Cat"){
                    urlPic = googleMapsMarkerIconCat;
                }
                else if(element.type === "Dog"){
                    urlPic = googleMapsMarkerIconDog;
                }
                else if(!(element.type === "Dog") && !(element.type === "Cat")){
                    urlPic = googleMapsMarkerIconPaw;
                }
                coordinates.push({ID: element.id, position: {lat: lat, lng: lng}, icon: urlPic});
            }
        );
    })

    let address = postsArray[0].address;
    Geocode.setApiKey(geocodeAPIkey)
    Geocode.fromAddress(address).then(
        async (response) => {
            const { lat, lng } = await response.results[0].geometry.location;
            if(postsArray[0].type === "Cat"){
                urlPic = googleMapsMarkerIconCat;
            }
            else if(postsArray[0].type === "Dog"){
                urlPic = googleMapsMarkerIconDog;
            }
            else if(!(postsArray[0].type === "Dog") && !(postsArray[0].type === "Cat")){
                urlPic = googleMapsMarkerIconPaw;
            }
            coordinates.push({ID: postsArray[0].id, position: {lat: lat, lng: lng}, icon: urlPic});
        }
    );
}, 2000)

export class MapContainer extends Component {

    state = {
        showingInfoWindow: false,
        activeMarker: "howya",
        selectedPlace: {},
        address: "",
        mapCenter: {
          lat: 53.355297,
          lng: -6.281298
        },
        showModal: false,
        closeModal: true
    };




  render() {
    let scale = new this.props.google.maps.Size(35,35);

    function handleActiveMarker(marker){
        console.log("Marker: " + marker)
        if (marker === activeMarker) {
            return;
        }
        activeMarker = marker;
        console.log(activeMarker)
        this.setState({
            showModal: true,
            closeModal: false
        })
    };

    return (
      <div id="googleMap">
        <Map id="Map"
        style = {style}
          google={this.props.google}
          onClick={this.onMapClicked}
          initialCenter = {{
              lat: this.state.mapCenter.lat,
              lng: this.state.mapCenter.lng
          }}
          >      
            {coordinates?.map(function(element){
              let area = element.position;
              return(
                <Marker 
                key={element.ID}
                position = {area}
                icon={{
                    url: element.icon,
                    scaledSize:  scale,
                    fillColor: "#FFA500"
                    }}
                onClick={() => handleActiveMarker(element.ID)}
                    >
                </Marker>
              )
          })}
        </Map>
        <Modal show={this.state.showModal} close={this.state.closeModal}>
            <Modal.Header>
                <Modal.Title>Howya</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
                <Button >Close</Button>
            </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: googleAPIkey,
})(MapContainer, googleMapsState)
