import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

class Header extends Component {

  renderLinks() {
    if (this.props.authenticated) {
      //show link to sign out
      return [
        <li className='nav-item' key={1}>
          <Link className='nav-link' to='/signout' >Sign Out</Link>
        </li>,

        <li className='nav-item' key={2}>
          <Link className='nav-link' to='/posts/create' >Create Recipe</Link>
        </li>,

        <li className='nav-item' key={3}>
          <Link className='nav-link' to='/posts/view' >View Recipes</Link>
        </li>
      ];
    } else {
      return [
        <li className='nav-item' key={1}>
          <Link className='nav-link' to='/signin' >Sign In</Link>
        </li>,

        <li className='nav-item' key={2}>
          <Link className='nav-link' to='/signup' >Sign Up</Link>
        </li>


      ];
    }

  }

  render() {
    return (
      <nav className='navbar navbar-light'>
        <Link to='/' className='navbar-brand'>Stir Recipe</Link>
        <ul className='nav navbar-nav'>
          {this.renderLinks()}
        </ul>
      </nav>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated
  }
}

export default connect(mapStateToProps)(Header);
