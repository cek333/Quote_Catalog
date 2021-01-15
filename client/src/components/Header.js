import { NavLink } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header>
      <div className="title">Meme Catalog</div>
      <nav>
        <NavLink to="/browse" activeClassName="active">Browse</NavLink>
        <NavLink to="/generate" activeClassName="active">Create</NavLink>
        <NavLink to="/login" activeClassName="active">Login</NavLink>
      </nav>
    </header>
  );
}

export default Header;