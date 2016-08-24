import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions';

/*****************  HIGHER ORDER COMPONENT TO REQUIRE AUTH  *******************/

export default function(ComposedComponent) {
  class Authentication extends Component {

    static contextTypes = {
      router: React.PropTypes.object
    }

    componentWillMount() {

      const token = localStorage.getItem('token');

      //no token - redirect to signup page
      if (!this.props.authenticated && !token) { //token is in there for offline use
        //console.log('token', token);
        this.context.router.push('/signup');
      }

    }

    componentWillUpdate(nextProps) {
      const token = localStorage.getItem('token');
      if (!nextProps.authenticated && !token) { //token is in there for offline use
        this.context.router.push('/signup');
      }
    }

    //returns the component which is passed in
    render() {
      return <ComposedComponent {...this.props} />
    }
  }

  function mapStateToProps(state) {
    return {authenticated: state.auth.authenticated};
  }

  return connect(mapStateToProps, actions)(Authentication);
}
