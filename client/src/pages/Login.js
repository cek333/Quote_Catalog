import './Login.css';

function Login() {
  return (
    <div className="loginForm">
      <label htmlFor="email">Email</label>
      <input type="text" id="email" name="email" placeholder="email" />
      <label htmlFor="password">Password</label>
      <input type="password" id="password" name="password" placeholder="password" />
      <div className="loginFormBtns">
        <button>Login In</button>
        <button>Sign Up</button>
      </div>
      <div className="loginFormMsg"></div>
    </div>
  )
}

export default Login;