import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import * as actions from '../../actions';
import {Textfield, Spinner} from 'react-mdl';
import { Link } from 'react-router';

//javascript class - syntactic sugar - not an actual class
class ForgottenPassword extends Component {

  //renders message if one exists
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

  //validation
  handleFormSubmit({email}) {

    var errors = '';

    if (email == undefined || email == '') {
      errors = '<div>Please provide your email</div>';
    }

    //only do ajax request if no errors
    if(errors == '') {
      //console.log('attempting forgottenPassword');
      this.props.startLoading();
      this.props.forgottenPassword(email);
    }
    else {
      this.props.authError(errors);
    }

  }

//removes messages - don't want them to show elsewhere
  componentWillUnmount() {
    this.props.removeAuthError();
    this.props.removeUiMessage();
  }

//renders alert if one exists
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

  //renders message if needed
  renderSpinner() {
    if (this.props.loading) {
      return (

          <Spinner />

      );
    }
  }

  //general render method
  render() {

    const {handleSubmit, fields: {email,password} } = this.props;

    return (
      <div>

        <div className='pwd-title-box'>
          <h3 className='signin-title'>Forgotten Your Password?</h3>
        </div>

        <h6 className='forgotten-password-secondtitle'>Let us send you a link.</h6>

        <div className='signin-form-box'>
          <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))} className='signinForm'>

            {this.renderSpinner()}

            //react mdl component
            <Textfield
                onChange={() => {}}
                label="Email"
                floatingLabel
                type='email'
                {...email}
            />

          <button action='submit'>Submit</button>

          {this.renderMessage()}

          {this.renderAlert()}

          </form>
        </div>

      </div>
    );
  }
}

//maps state of application from redux to props
function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
    loading: state.loading,
    message: state.auth.message
    };
}

//using redux form
export default reduxForm({
  form: 'ForgottenPassword',
  fields: ['email']
}, mapStateToProps, actions)(ForgottenPassword);
