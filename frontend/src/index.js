import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './App.css';
import NavBar from './NavBar';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

ReactDOM.render(
  <>
    <NavBar />
    <Router >
      <Switch>
      {/* <Route />'s here */}
      </Switch>
    </Router>
  </>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();