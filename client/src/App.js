import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Browse from './pages/Browse';
import Generate from './pages/Generate';
import API from './utils/API';
import './App.css';

function App() {
  const [ user, setUser ] = useState('');

  useEffect(function() {
    API.getCurUser((res) => setUser(res.email));
  }, []);

  function updateUser(email) {
    setUser(email);
  }

  return (
    <div className='root'>
      <Router>
        <Header user={user} />
        <Switch>
          <Route path='/browse' component={Browse} />
          <Route path='/generate'><Generate user={user} /></Route>
          <Route path='/login'><Login user={user} updateUser={updateUser} /></Route>
          <Route path='/logout'><Login user={user} updateUser={updateUser} /></Route>
          <Redirect to='/browse' />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
