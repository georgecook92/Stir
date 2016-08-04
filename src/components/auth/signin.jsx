import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import * as actions from '../../actions';

class Signin extends Component {

  handleFormSubmit({email,password}) {
    //action to log user in

    this.props.signinUser({email,password});
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

    const {handleSubmit, fields: {email,password} } = this.props;

    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        <fieldset className='form-group'>
          <label>Email:</label>
          <input {...email} type='email' className="form-control" />
          {email.touched && email.error && <div className='error'>{email.error}</div>}
        </fieldset>

        <fieldset className='form-group'>
          <label>Password:</label>
          <input {...password} type='password' className="form-control" />
          {password.touched && password.error && <div className='error'>{password.error}</div>}
        </fieldset>

        {this.renderAlert()}

        <button action='submit' className='btn btn-primary'>Sign in</button>
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
  return errors;
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.error };
}

export default reduxForm({
  form: 'signin',
  fields: ['email', 'password'],
  validate
}, mapStateToProps, actions)(Signin);
