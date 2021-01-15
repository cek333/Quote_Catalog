import React from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Browse from './pages/Browse';
import Generate from './pages/Generate';
import './App.css';

function App() {
  return (
    <div className="root">
      <Router>
        <Header />
        <Switch>
          <Route path='/browse' component={Browse} />
          <Route path='/generate' component={Generate} />
          <Route path='/login' component={Login} />
          <Redirect to='/browse' />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
