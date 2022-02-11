import React, { Component } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
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
      mapCenter: {
        lat: 53.350140,
        lng: -6.266155
      }
    };

    onMapClicked = (props, marker, e) => {
      console.log(marker.position);
      this.setState({
        selectedPlace: props,
        mapCenter: {lat: e.latLng.lat(), lng: e.latLng.lng()}
      }) 
      console.log(this.state.selectedPlace);
      console.log(this.state.mapCenter.lat);
      console.log(this.state.mapCenter.lng);
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
          center={{
            lat: this.state.mapCenter.lat,
            lng: this.state.mapCenter.lng
          }}>
          <Marker>
            position = {{
              lat: this.state.mapCenter.lat,
              lng: this.state.mapCenter.lng
            }}
          </Marker>
        </Map>
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: googleAPIkey
})(MapContainer)