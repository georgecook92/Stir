import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {Drawer, Navigation} from 'react-mdl';
import * as actions from '../actions';


//DRAWER COMPONENT
//USES REACT MDL
class HeaderMaterial extends Component {

  renderLinks() {
    if (this.props.authenticated) {
      //show link to sign out
      return [
        <Link className="mdl-navigation__link" to="/posts/view" key={3}>View Recipes</Link>,
        <Link className="mdl-navigation__link" to="/posts/create" key={2}>Create Recipe</Link>,
        <Link className="mdl-navigation__link" to="/profile" key={4}>Profile</Link>,
        <Link className="mdl-navigation__link" to="/" key={1} onClick={ () => {this.props.signoutUser(this.props.user_id)} } >Signout</Link>



      ];
    } else {
      return [
        <Link className="mdl-navigation__link" to="/login" key={1}>Login</Link>,
        <Link className="mdl-navigation__link" to="/register" key={2}>Register</Link>
      ];
    }

  }

  render() {
    return (
      <Drawer title="Stir">
          <Navigation>
              {this.renderLinks()}
          </Navigation>
      </Drawer>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated
  }
}

export default connect(mapStateToProps, actions)(HeaderMaterial);
