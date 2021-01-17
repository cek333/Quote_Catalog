import { NavLink } from 'react-router-dom';
import './Header.css';

function Header(props) {
  let loginLogoutLink = props.user===''
                          ? <NavLink to='/login' activeClassName='active'>Login</NavLink>
                          : <NavLink to='/logout' activeClassName='active'>Logout</NavLink>;

  return (
    <header>
      <div className='title'>Quote Catalog</div>
      <nav>
        <NavLink to='/browse' activeClassName='active'>Browse</NavLink>
        <NavLink to='/generate' activeClassName='active'>Create</NavLink>
        {loginLogoutLink}
      </nav>
    </header>
  );
}

export default Header;