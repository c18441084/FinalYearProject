import React, { Component } from 'react';
import { Map, Marker, GoogleApiWrapper, Geocode } from 'google-maps-react';
import { googleAPIkey } from '../../keys';

const style = {
    maxWidth: "75%",
    height: "75%",
    overflowX: "hidden",
    overflowY: "hidden"
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
      let gettingAddress = "";
      Geocode.fromLatLng(e.latLng.lat(), e.latLng.lng()).then(
        response => {
          gettingAddress = response.results[0].formatted_address;
          console.log(gettingAddress);
        },
        error => {
          console.error(error);
        }
      );
      //const gettingAddress = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${e.latLng.lat()},${e.latLng.lng()}&key=${googleAPIkey}`);
      this.setState({
        selectedPlace: props,
        mapCenter: {lat: e.latLng.lat(), lng: e.latLng.lng()},
        address: gettingAddress,
      })
      console.log(this.state.address);
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
  apiKey: googleAPIkey
})(MapContainer)