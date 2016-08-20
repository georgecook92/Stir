import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import * as actions from '../../actions';
import {Textfield, Spinner} from 'react-mdl';
import { Link } from 'react-router';



class ForgottenPassword extends Component {

  handleFormSubmit({email}) {

    var errors = '';

    if (email == undefined || email == '') {
      errors = '<div>Please provide your email</div>';
    }

    if(errors == '') {
      //console.log('attempting forgottenPassword');
      this.props.startLoading();
      this.props.forgottenPassword(email);
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
            <Textfield
                onChange={() => {}}
                label="Email"
                floatingLabel
                type='email'
                {...email}
            />

          <button action='submit'>Submit</button>


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
    };
}

export default reduxForm({
  form: 'ForgottenPassword',
  fields: ['email']
}, mapStateToProps, actions)(ForgottenPassword);
