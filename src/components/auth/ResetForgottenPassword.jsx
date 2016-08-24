import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import * as actions from '../../actions';
import {Textfield, Spinner} from 'react-mdl';
import { Link } from 'react-router';



class ResetForgottenPassword extends Component {

//validation
  handleFormSubmit({password, passwordConfirm}) {

    var errors = '';

    if (password == undefined || password == '') {
      errors = '<div>Please provide a password</div>';
    }

    if (passwordConfirm == undefined || passwordConfirm == '') {
      errors = '<div>Please confirm the password</div>';
    } else if(passwordConfirm !== password) {
      errors = '<div>Passwords do not match!</div>';
    }

    if(errors == '') {
      //console.log('attempting forgottenPassword');
      this.props.startLoading();
      const {token} = this.props.params;
      console.log(this.props);
      this.props.resetForgottenPassword(token, password);
    }
    else {
      this.props.authError(errors);
    }

  }

  //cleans up lingering messages on other pages
  componentWillUnmount() {
    this.props.removeAuthError();
  }

  renderAlert() {
    if (this.props.errorMessage) {

      return (
        <div className='alert-message'>
          <strong>Oops!</strong>
            <div dangerouslySetInnerHTML={{__html: this.props.errorMessage}}>
            </div>
        </div>
      );
    }
  }

  renderSpinner() {
    if (this.props.loading) {
      return (

          <Spinner />

      );
    }
  }

  render() {

    const {handleSubmit, fields: {password, passwordConfirm} } = this.props;

    return (
      <div>

        <div className='pwd-title-box'>
          <h3 className='signin-title'>Reset Your Password Below</h3>
        </div>

        <div className='signin-form-box'>
          <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))} className='signinForm'>



            {this.renderSpinner()}
            <Textfield
                onChange={() => {}}
                label="Password"
                floatingLabel
                type='password'
                {...password}
            />

            <Textfield
                onChange={() => {}}
                label="Password Confirm"
                floatingLabel
                type='password'
                {...passwordConfirm}
            />

          <button action='submit'>Reset Password</button>


          {this.renderAlert()}

          </form>
        </div>

      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    auth: state.auth,
    errorMessage: state.auth.error,
    loading: state.loading
    };
}

//using redux form - not connect
export default reduxForm({
  form: 'ForgottenPassword',
  fields: ['password', 'passwordConfirm']
}, mapStateToProps, actions)(ResetForgottenPassword);
