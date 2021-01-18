import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import API from '../utils/API';

function Login(props) {
  const emailInput = useRef(null);
  const pswdInput = useRef(null);
  const [ errorMsg, setErrorMsg ] = useState('');
  const [ successMsg, setSuccessMsg ] = useState(' ');
  const { pathname } = useLocation();
  const history = useHistory();
  const { user: propsUser, updateUser: propsUpdateUser } = props;

  useEffect(function() {
    if (propsUser && pathname === '/logout') {
      // If a logged in user comes back to this page, log them out.
      API.updateUser('logout', propsUser, '', (res) => {
        // console.log('[useEffect (logout)] res=', res);
        if (res.status) {
          propsUpdateUser('');
          setSuccessMsg(res.message);
        } else {
          // Not expecting to fall into this branch!
          // Note, if user is logged in, only success message is shown
          setSuccessMsg(res.message);
        }
        history.push('/login');
      });
    }
  }, [propsUser, pathname]);

  function clearMessages() {
    setSuccessMsg(' ');
    setErrorMsg('');
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    clearMessages();
    const email = emailInput.current.value;
    const password = pswdInput.current.value;
    if (!email || !password) {
      setErrorMsg('Please enter both an email and password!');
      return;
    }
    if (evt.target.value==='login') {
      // console.log(`login using email=${email} pswd=${password}`);
      API.updateUser('login', email, password, (res) => {
        // console.log('[handleSubmit (login)] res=', res);
        if (res.status) {
          propsUpdateUser(res.email);
          setSuccessMsg(`${res.message} Select <Browse> to view images, or <Create> to add your own.`);
        } else {
          setErrorMsg(res.message);
        }
      });
    } else {
      // action === 'signup'
      // console.log(`signup using email=${email} pswd=${password}`);
      API.updateUser('signup', email, password, (res) => {
        // console.log('[handleSubmit (signup)] res=', res);
        if (res.status) {
          setSuccessMsg(res.message);
        } else {
          setErrorMsg(res.message);
        }
      });
    }
  }

  let display;
  if (propsUser==='') {
    display =
      <form className='inputForm' onSubmit={handleSubmit}>
        <p className='successMsg'>{successMsg}</p>
        <label htmlFor='email'>Email</label>
        <input type='text' ref={emailInput} name='email' id='email'
               placeholder='email' required onChange={clearMessages} />
        <label htmlFor='password'>Password</label>
        <input type='password' ref={pswdInput} name='password' id='password'
               placeholder='password' required onChange={clearMessages} />
        <div className='sameRow'>
          <button type='submit' onClick={handleSubmit} value='login'>Login In</button>
          <button type='submit' onClick={handleSubmit} value='signup'>Sign Up</button>
        </div>
        <p className='errorMsg'>{errorMsg}</p>
      </form>;
  } else {
    display = <p className='success_msg'>{successMsg}</p>;
  }

  return display;
}

export default Login;