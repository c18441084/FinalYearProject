/*import { all, call, put, takeLatest, select } from 'redux-saga/effects';
import { actionCreators, actionTypes } from './actions'; 




export default function*(){
    yield all([
        takeLatest(
            actionTypes.GOOGLE_MAPS_REQUEST,
            getRequest()
        )
    ])
}

function* getRequest(obj){
    try{
        yield put({
            type: actionTypes.GOOGLE_MAPS_SUCCESS3,
            payload: obj
        })
    }
    catch(err){
        console.log(err);
    }
}*/