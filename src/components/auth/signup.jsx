import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import * as actions from '../../actions';

class Signup extends Component {

  handleFormSubmit(formProps) {
    //call action creator to sign up user
    this.props.signupUser(formProps);

  }

  componentWillUnmount() {
    this.props.removeAuthError();
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className='alert alert-danger'>
          <strong>Oops!</strong> {this.props.errorMessage}
        </div>
      );
    }
  }

  render() {

    const {handleSubmit, fields: {email,password,passwordConfirm,firstName,lastName}} = this.props;

    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>

        <fieldset className='form-group'>
          <label>Email:</label>
          <input className='form-control' {...email} />
          {email.touched && email.error && <div className='error'>{email.error}</div>}
        </fieldset>

        <fieldset className='form-group'>
          <label>Password:</label>
          <input type='password' className='form-control' {...password} />
          {password.touched && password.error && <div className='error'>{password.error}</div>}
        </fieldset>

        <fieldset className='form-group'>
          <label>Confirm Password:</label>
          <input type='password' className='form-control' {...passwordConfirm} />
          {passwordConfirm.touched && passwordConfirm.error && <div className='error'>{passwordConfirm.error}</div>}
        </fieldset>

        <fieldset className='form-group'>
          <label>Forename:</label>
          <input className='form-control' {...firstName} />
          {firstName.touched && firstName.error && <div className='error'>{firstName.error}</div>}
        </fieldset>

        <fieldset className='form-group'>
          <label>Surname:</label>
          <input className='form-control' {...lastName} />
          {lastName.touched && lastName.error && <div className='error'>{lastName.error}</div>}
        </fieldset>

        {this.renderAlert()}

        <button action='submit' className='btn btn-primary'>Sign Up</button>

      </form>
    );
  }
}

function validate(formProps) {
  const errors = {};

  if (!formProps.email ) {
    errors.email = 'Please enter an email';
  }

  if (!formProps.password ) {
    errors.password = 'Please enter a password';
  }

  if (!formProps.passwordConfirm ) {
    errors.passwordConfirm = 'Please confirm your password';
  }

  if (formProps.password !== formProps.passwordConfirm) {
    errors.password = 'Passwords must match';
  }

  if (!formProps.firstName ) {
    errors.firstName = 'Please enter your Forename';
  }

  if (!formProps.lastName ) {
    errors.lastName = 'Please enter your Surname';
  }

  return errors;
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error
  }
}

export default reduxForm({
  form: 'signup',
  fields: ['email', 'password', 'passwordConfirm', 'firstName', 'lastName'],
  validate
}, mapStateToProps, actions)(Signup);
