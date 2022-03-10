/*import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';*/

import React from 'react'; 
import ReactDOM from 'react-dom'; 
import './index.css'; 
import App from './App'; 
import reportWebVitals from './reportWebVitals';  
/*import rootReducer from './Store/root-reducer';  
import { createStore, applyMiddleware } from 'redux'; 
import createSagaMiddleware from 'redux-saga'; 
import "regenerator-runtime/runtime"; 
import {Provider} from 'react-redux'; 
import rootSaga from './Store/root-saga'; 
import { actionTypes } from './Store/actions';  
const sagaMiddleware = createSagaMiddleware(); 
export const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);*/

ReactDOM.render(
  <React.StrictMode>
    {/*<Provider store={store}>*/}
      <App />
    {/*</Provider>*/}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
