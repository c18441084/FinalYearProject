import React, { Component } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import { googleAPIkey, geocodeAPIkey } from '../../keys';

const style = {
    maxWidth: "57%",
    height: "57%",
    overflowX: "hidden",
    overflowY: "hidden",
    marginLeft: "1.6%",
    marginBottom: "40%",
};

export class MapContainer extends Component {
    
  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    address: " ",
    mapCenter: {
      lat: 53.350140,
      lng: -6.266155
    }
  };

  onMapClicked = async (props, marker, e) => {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${e.latLng.lat()},${e.latLng.lng()}&key=${geocodeAPIkey}`);
    const addressObject = await response.json();
    const gettingAddress = addressObject.results[0].formatted_address
    //address = gettingAddress;
    console.log(gettingAddress);
    this.setState({
      selectedPlace: props,
      mapCenter: {lat: e.latLng.lat(), lng: e.latLng.lng()},
      address: gettingAddress,
    })
  };
    
  render() {
    return (
      <div>
        <Map style = {style}
          google={this.props.google}
          onClick={this.onMapClicked}
          initialCenter={{
            lat: this.state.mapCenter.lat,
            lng: this.state.mapCenter.lng
          }}
          >
          <Marker 
            position = {{
              lat: this.state.mapCenter.lat,
              lng: this.state.mapCenter.lng
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