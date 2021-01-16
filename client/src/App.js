import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Browse from './pages/Browse';
import Generate from './pages/Generate';
import './App.css';

function App() {
  const [ user, setUser ] = useState('');

  useEffect(function() {
    if (localStorage.getItem('quoteCatalogUser')) {
      setUser(localStorage.getItem('quoteCatalogUser'));
    }
  }, []);

  function updateUser(email) {
    setUser(email);
    localStorage.setItem('quoteCatalogUser', email);
  }

  return (
    <div className='root'>
      <Router>
        <Header user={user} />
        <Switch>
          <Route path='/browse' component={Browse} />
          <Route path='/generate' component={Generate} />
          <Route path='/login'><Login user={user} updateUser={updateUser} /></Route>
          <Redirect to='/browse' />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
