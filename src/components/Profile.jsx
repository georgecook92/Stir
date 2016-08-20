import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions';
import {Grid, Cell, Card, CardTitle, CardText, CardActions, Button, Spinner} from 'react-mdl';
import { browserHistory } from 'react-router';

class Profile extends Component {

  componentWillUnmount() {
    this.props.removeAuthError();
    this.props.removeUiMessage();
  }

  renderMessage() {
    if (this.props.message) {
      console.log(this.props.message);
      return (
        <div className='success-message'>
            {this.props.message}
        </div>
      );
    }
  }

  render() {

    const fullName = `${this.props.auth.forename} ${this.props.auth.surname}`;

    return (
      <div>

        <div className='signin-title-box viewposts-title-box'>
          <h3 className='signin-title'>{fullName}</h3>
        </div>

        <img className='profile-pic' src='/assets/profile-icon.png' />

          {this.renderMessage()}

        <Grid style={{width: '90%', margin: '0 auto', display: 'flex'}}>

          <Cell col={6} tablet={8} className='mdl-card' shadow={0} style={{ background: '#448AFF'}}>
              <CardTitle style={{alignItems: 'flex-start', color: '#000', background: '#fff'}}>
                  <h4 style={{marginTop: '0'}}>
                      Your Profile Information
                  </h4>
              </CardTitle>

              <CardText className='profile-info' style={{alignItems: 'flex-start', color: '#fff'}}>
                <p>  {`Full Name: ${fullName}`} </p>
                <p>  {`Email: ${this.props.auth.email}`} </p>
              </CardText>

          </Cell>

          <Cell col={6} tablet={8} className='mdl-card' shadow={0} style={{ background: '#448AFF'}} onClick={ () => {
              browserHistory.push(`/reset`);
            } }>
              <CardTitle style={{textAlign: 'center', color: '#000', background: '#fff'}}>
                  <h4 style={{marginTop: '0'}}>
                      Reset Password
                  </h4>
              </CardTitle>

              <CardText className='profile-info' style={{ alignSelf: 'center', color: '#fff'}}>
                <p>Click to reset</p>
              </CardText>

          </Cell>

        </Grid>


      </div>
    );

  }

}

function mapStateToProps(state) {
  return {
    auth: state.auth,
    errorMessage: state.auth.error,
    message: state.auth.message
  }
}

export default connect(mapStateToProps, actions)(Profile);
