import React, { useRef, useState, useEffect } from 'react';
import API from '../utils/API';

function Login(props) {
  const emailInput = useRef(null);
  const pswdInput = useRef(null);
  const [ errorMsg, setErrorMsg ] = useState('');
  const [ successMsg, setSuccessMsg ] = useState(' ');

  useEffect(function() {
    if (props.user) {
      // If a logged in user comes back to this page, log them out.
      API.updateUser('logout', props.user, '', (res) => {
        // console.log('[useEffect (logout)] res=', res);
        if (res.status) {
          props.updateUser('');
          setSuccessMsg(res.message);
        } else {
          // not expecting any error message here.
          setErrorMsg(res.message);
        }
      });
    }
  }, []);

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
          props.updateUser(res.email);
          setSuccessMsg(`${res.message} Select Browse to view images, or Create to add your own.`);
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
  if (props.user==='') {
    display =
      <form className='inputForm' onSubmit={handleSubmit}>
        <p className='success_msg'>{successMsg}</p>
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
        <p className='error_msg'>{errorMsg}</p>
      </form>;
  } else {
    display = <p className='success_msg'>{successMsg}</p>;
  }

  return display;
}

export default Login;