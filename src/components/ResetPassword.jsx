import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import * as actions from '../actions';
import {Grid, Cell, Card, CardTitle, CardText, CardActions, Button, Textfield} from 'react-mdl';


class ResetPassword extends Component {

  handleFormSubmit(formProps) {
    var errors = '';
    console.log(formProps);

    if (formProps.oldPassword === undefined || formProps.oldPassword === '') {
      errors = '<div>Please Provide Your Old Password</div>'
    }

    if (formProps.newPassword === undefined || formProps.newPassword === '') {
      errors = '<div>Please Provide a New Password</div>'
    }

    if (formProps.newPasswordConfirm === undefined || formProps.newPasswordConfirm === '') {
      errors = '<div>Please Confirm Your New Password</div>'
    } else if( formProps.newPasswordConfirm !== formProps.newPassword ) {
      errors = '<div>New Passwords Do Not Match</div>'
    }

    if(errors == '') {
      console.log('attempting signup');
      this.props.startLoading();
      this.props.resetPassword(this.props.auth.email, formProps.oldPassword, formProps.newPassword);
    }
    else {
      this.props.authError(errors);
    }


  }

  renderSpinner() {
    if (this.props.loading) {
      return (

          <Spinner />

      );
    }
  }

  componentWillUnmount() {
    this.props.removeAuthError();
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className='alert-message'>
            <div dangerouslySetInnerHTML={{__html: this.props.errorMessage}}>
            </div>
        </div>
      );
    }
  }

  render() {

    const {handleSubmit, fields: {oldPassword, newPassword, newPasswordConfirm}} = this.props;

    return (
      <div>

        <div className='signin-title-box viewposts-title-box'>
          <h3 className='signin-title'>Reset Password</h3>
        </div>

        {this.renderSpinner()}

        {this.renderAlert()}

        <Grid style={{width: '90%', margin: '0 auto', display: 'flex'}}>

          <Cell col={12} className='mdl-card' shadow={0} style={{ background: '#448AFF', paddingBottom: '3rem'}}>

              <CardText className='reset-password' style={{alignItems: 'flex-start', color: '#fff'}}>
                <h4>Would you like to reset your password? Please enter your old password and enter a new one!</h4>
              </CardText>

              <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))} className='reset-password-form'>

                <Textfield
                    label="Old Password"
                    floatingLabel
                    type='password'
                    {...oldPassword}
                />

                <Textfield
                    label="New Password"
                    floatingLabel
                    type='password'
                    {...newPassword}
                />

                <Textfield
                    label="Confirm New Password"
                    floatingLabel
                    type='password'
                    {...newPasswordConfirm}
                />

              <button action='submit'>Submit</button>

              </form>

          </Cell>

        </Grid>


      </div>
    );

  }

}

function mapStateToProps(state) {
  return {
    auth: state.auth,
    errorMessage: state.auth.error
  }
}

export default reduxForm({
  form: 'reset',
  fields: ['oldPassword', 'newPassword', 'newPasswordConfirm']
}, mapStateToProps, actions)(ResetPassword);
