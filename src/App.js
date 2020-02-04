import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, Switch } from 'react-router'
import TodoList from './pages/todo'
import EasterEgg from './pages/easterEgg'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Switch>
          <Route path="/" component={TodoList} exact />
          <Route path="/easter" component={EasterEgg} />
        </Switch>
      </header>
    </div>
  );
}

export default App;
