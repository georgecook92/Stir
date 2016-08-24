import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {Header, Navigation} from 'react-mdl';
import * as actions from '../actions';


//HEADER Component
//uses react mdl
class HeaderMaterial extends Component {

  renderLinks() {
    if (this.props.authenticated) {
      //show link to sign out
      return [
        <Link className="mdl-navigation__link mdl-layout--large-screen-only" to="/profile" key={4}>Profile</Link>,
        <Link className="mdl-navigation__link mdl-layout--large-screen-only" to="/posts/create" key={2}>Create Recipe</Link>,
        <Link className="mdl-navigation__link mdl-layout--large-screen-only" to="/posts/view" key={3}>View Recipes</Link>,
        <Link className="mdl-navigation__link mdl-layout--large-screen-only" to="/" key={1} onClick={ () => {this.props.signoutUser(this.props.user_id)} }>Signout</Link>

      ];
    } else {
      return [
        <Link className="mdl-navigation__link" to="/register" key={1}>Register</Link>,
        <Link className="mdl-navigation__link" to="/login" key={2}>Login</Link>,
      ];
    }

  }

  render() {
    return (
      <Header title={<Link to='/'><strong>Stir</strong></Link>}>
          <Navigation>
              {this.renderLinks()}
          </Navigation>
      </Header>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    user_id: state.auth.user_id
  }
}

export default connect(mapStateToProps, actions)(HeaderMaterial);
