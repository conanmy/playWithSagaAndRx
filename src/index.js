import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { BrowserRouter } from 'react-router-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import reducers from './rootReducer'
import { createEpicMiddleware } from 'redux-observable'
import rootEpic from './epics'
const epicMiddleware = createEpicMiddleware()


const store = createStore(
  combineReducers(reducers),
  applyMiddleware(epicMiddleware),
)
epicMiddleware.run(rootEpic)

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
