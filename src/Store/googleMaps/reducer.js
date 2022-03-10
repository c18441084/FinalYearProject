/*import { actionTypes } from "./actions";


const initialState = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    address: " ",
    mapCenter: {
      lat: 53.350140,
      lng: -6.266155
    }
}

export default function(state = initialState, action){
    switch (action.type){
        case actionTypes.GOOGLE_MAPS_REQUEST: {
            return{
                ...state,
                showingInfoWindow: false,
                activeMarker: {},
                selectedPlace: {},
                address: " ",
                mapCenter: {
                lat: 53.350140,
                lng: -6.266155
                }
            }
        }
        case actionTypes.GOOGLE_MAPS_FAILURE: {
            return{
                ...state,
                showingInfoWindow: false,
                activeMarker: {},
                selectedPlace: {},
                address: " ",
                mapCenter: {
                lat: 53.350140,
                lng: -6.266155
                }
            }
        }
        case actionTypes.GOOGLE_MAPS_SUCCESS: {
            return{
                ...state,
                showingInfoWindow: action.showingInfoWindow,
                activeMarker: action.activeMarker,
                selectedPlace: action.selectedPlace,
                address: action.address,
                mapCenter: {
                lat: action.mapCenter.lat,
                lng: action.mapCenter.lng
                }
            }
        }
    }
}*/