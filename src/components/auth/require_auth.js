import React, {Component} from 'react';
import {connect} from 'react-redux';

export default function(ComposedComponent) {
  class Authentication extends Component {

    static contextTypes = {
      router: React.PropTypes.object
    }

    componentWillMount() {

      const token = localStorage.getItem('token');

      if (!this.props.authenticated && !token) { //token is in there for offline use - redux is not available offline
        console.log('token', token);
        this.context.router.push('/signup');
      }

    }

    componentWillUpdate(nextProps) {
      const token = localStorage.getItem('token');
      if (!nextProps.authenticated && !token) { //token is in there for offline use - redux is not available offline
        console.log('token', token);
        this.context.router.push('/signup');
      }
    }

    render() {
      return <ComposedComponent {...this.props} />
    }
  }

  function mapStateToProps(state) {
    return {authenticated: state.auth.authenticated};
  }

  return connect()(Authentication);
}
