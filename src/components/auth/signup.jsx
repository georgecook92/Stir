import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import * as actions from '../../actions';
import {Textfield, Spinner} from 'react-mdl';

class Signup extends Component {

  handleFormSubmit(formProps) {

    var errors = '';

    if (formProps.email == undefined || formProps.email === '') {
      errors = '<div>Please provide your email</div>'
    }

    if(formProps.password == undefined || formProps.password === '') {
      errors += '<div>Please provide your password</div>';
    }

    if (formProps.passwordConfirm == undefined || formProps.passwordConfirm === '') {
      errors += '<div>Please confirm your password</div>';
    } else if (formProps.password !== formProps.passwordConfirm) {
      errors += '<div>Your passwords do not match</div>';
    }

    if(formProps.firstName == undefined || formProps.firstName === '') {
      errors += '<div>Please provide your First Name</div>';
    }


    if(formProps.lastName == undefined || formProps.lastName === '') {
      errors += '<div>Please provide your Last Name</div>';
    }
    if(errors == '') {
      console.log('attempting signup');
      this.props.startLoading();
      this.props.signupUser(formProps);
    }
    else {
      this.props.authError(errors);
    }

  }

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

    const {handleSubmit, fields: {email,password,passwordConfirm,firstName,lastName}} = this.props;

    return (

      <div>

        <div className='signin-title-box'>
          <h3 className='signin-title'>Sign Up To Stir.</h3>
        </div>

        <div className='signin-form-box'>
          <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))} className='signinForm'>

            {this.renderSpinner()}
            <Textfield
                onChange={() => {}}
                label="Email"
                floatingLabel
                type='email'
                {...email}
            />

            <Textfield
                onChange={() => {}}
                label="Password"
                floatingLabel
                type='password'
                {...password}
            />

            <Textfield
                onChange={() => {}}
                label="Confirm Password"
                floatingLabel
                type='password'
                {...passwordConfirm}
            />

            <Textfield
                onChange={() => {}}
                label="First Name"
                floatingLabel
                type='text'
                {...firstName}
            />

            <Textfield
                onChange={() => {}}
                label="Last Name"
                floatingLabel
                type='text'
                {...lastName}
            />

          <button action='submit'>Sign Up</button>

          {this.renderAlert()}

          </form>
        </div>

      </div>

    );
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
    loading: state.loading
  }
}

export default reduxForm({
  form: 'signup',
  fields: ['email', 'password', 'passwordConfirm', 'firstName', 'lastName']
}, mapStateToProps, actions)(Signup);
