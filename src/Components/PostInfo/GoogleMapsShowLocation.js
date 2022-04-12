import React, { Component } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng} from 'react-places-autocomplete';
import { googleAPIkey, geocodeAPIkey } from '../../keys';
import { latitude, longitude, animalType } from '../GlobalState/states';
import googleMapsMarkerIconDog from './GoogleMapsMarkers/googleMapsMarkerIconDog.png';
import googleMapsMarkerIconCat from './GoogleMapsMarkers/googleMapsMarkerIconCat.png';
import googleMapsMarkerIconPaw from './GoogleMapsMarkers/googleMapsMarkerIconPaw.png';


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

export class MapContainer extends Component {

    state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      address: " ",
      mapCenter: {
        lat: latitude.value, 
        lng: longitude.value
      },
    };
      
    render() {
      if(animalType.value === "Cat"){
        urlPic = googleMapsMarkerIconCat
      }
      else if(animalType.value === "Dog"){
        urlPic = googleMapsMarkerIconDog
      }
      else{
        urlPic = googleMapsMarkerIconPaw;
      }
      return (
        <div id="googleMap">
          <Map style = {style}
            google={this.props.google}
            initialCenter={{
              lat: this.state.mapCenter.lat,
              lng: this.state.mapCenter.lng
            }}
            center={{
              lat: this.state.mapCenter.lat,
              lng: this.state.mapCenter.lng
            }}
            >
            <Marker 
              position = {{
                lat: this.state.mapCenter.lat,
                lng: this.state.mapCenter.lng
              }}
              icon={{
                url: urlPic,
                scaledSize:  new this.props.google.maps.Size(35,35),
                fillColor: "#FFA500"
                }}>
            </Marker>
          </Map>
        </div>
      )
    }
  }
  
  export default GoogleApiWrapper({
    apiKey: googleAPIkey,
  })(MapContainer)