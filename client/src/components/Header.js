import { NavLink } from 'react-router-dom';
import './Header.css';

function Header(props) {
  let navLoginText = props.user==='' ? 'Login' : 'Logout';

  return (
    <header>
      <div className='title'>Meme Catalog</div>
      <nav>
        <NavLink to='/browse' activeClassName='active'>Browse</NavLink>
        <NavLink to='/generate' activeClassName='active'>Create</NavLink>
        <NavLink to='/login' activeClassName='active'>{navLoginText}</NavLink>
      </nav>
    </header>
  );
}

export default Header;