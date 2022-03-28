import React, { Component } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng} from 'react-places-autocomplete';
import { googleAPIkey, geocodeAPIkey } from '../../keys';
import { googleMapsState, animalType } from '../GlobalState/states';
import googleMapsMarkerIconDog from './GoogleMapsMarkers/googleMapsMarkerIconDog.png'
import googleMapsMarkerIconCat from './GoogleMapsMarkers/googleMapsMarkerIconCat.png'

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
let inputClearer = "";

export class MapContainer extends Component {

  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    address: " ",
    mapCenter: {
      lat: googleMapsState.mapCenter.lat, 
      lng: googleMapsState.mapCenter.lng
    },
  };

  handleChange = address => {
    this.setState({ address });
  };
 
  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        console.log('Success', latLng)
        this.setState({
          address,
          mapCenter : {lat: latLng.lat,lng: latLng.lng}
        })
        this.changeGlobalState(0, latLng.lat, latLng.lng, address)
      })
      .catch(error => console.error('Error', error));
  };

  onMapClicked = async (props, marker, e) => {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${e.latLng.lat()},${e.latLng.lng()}&key=${geocodeAPIkey}`);
    const addressObject = await response.json();
    const gettingAddress = addressObject.results[0].formatted_address
    let props2 = props;
    let latitude = e.latLng.lat();
    let longitude = e.latLng.lng();
    this.setState({
      selectedPlace: props,
      mapCenter: {lat: e.latLng.lat(), lng: e.latLng.lng()},
      address: gettingAddress,
    })
    this.changeGlobalState(props2, latitude, longitude, gettingAddress);
  };

  changeGlobalState(props2, latitude, longitude, gettingAddress){
    console.log(gettingAddress)
    googleMapsState.selectedPlace = props2;
    googleMapsState.mapCenter.lat = latitude;
    googleMapsState.mapCenter.lng = longitude;
    googleMapsState.address = gettingAddress; 
  }
    
  render() {
    if(animalType.value === "Cat"){
      urlPic = googleMapsMarkerIconCat
    }
    else{
      urlPic = googleMapsMarkerIconDog
    }
    return (
      <div id="googleMap">
        <PlacesAutocomplete
          value={this.state.address}
          onChange={this.handleChange}
          onSelect={this.handleSelect}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <input style={{width: "70%", marginLeft: "16%", marginBottom: "3%"}} 
                {...getInputProps({
                  className: 'location-search-input',
                  placeholder: "Search Place..."
                })}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map(suggestion => {
                  const className = suggestion.active
                    ? 'suggestion-item--active'
                    : 'suggestion-item';
                  const style = suggestion.active
                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style,
                      })}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
        <Map style = {style}
          google={this.props.google}
          onClick={this.onMapClicked}
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
})(MapContainer, googleMapsState)
