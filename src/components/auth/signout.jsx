import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions';

class Signout extends Component {

  componentWillMount() {
    this.props.signoutUser(this.props.user_id);
  }

  render() {
    return <div>Sorry to see you go, come back soon!</div>;
  }
}

function mapStateToProps(state) {
  return {
    user_id: state.auth.user_id
  }
}

export default connect(mapStateToProps, actions)(Signout);
