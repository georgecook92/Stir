import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import * as actions from '../../actions';
import {Textfield, Spinner} from 'react-mdl';
import { Link } from 'react-router';



class Signin extends Component {

  componentDidMount() {
    this.props.endLoading();
  }

  renderMessage() {
    if (this.props.message) {
      //console.log(this.props.message);
      return (
        <div className='success-message'>
            {this.props.message}
        </div>
      );
    }
  }

  //validation
  handleFormSubmit({email,password}) {

    //console.log(formProps);

    var errors = '';

    if (email == undefined || email == '') {
      errors = '<div>Please provide your email</div>';
    }

    if(password == undefined || password == '') {
      errors += '<div>Please provide your password</div>';
    }

    if(errors == '') {
      //console.log('attempting signin');
      this.props.startLoading();
      this.props.signinUser(email, password);
    }
    else {
      this.props.authError(errors);
    }

  }

  //stops lingering messages
  componentWillUnmount() {
    this.props.removeAuthError();
    this.props.removeUiMessage();
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

        <div className='signin-title-box'>
          <h3 className='signin-title'>Login To Stir.</h3>
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

            <button action='submit'>Sign in</button>

            <div><Link to='/forgottenPassword'>Forgotten Password?</Link></div>


          {this.renderAlert()}

          {this.renderMessage()}

          </form>
        </div>

      </div>
    );
  }
}




function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
    loading: state.loading,
    message: state.auth.message
    };
}


//uses redux form instead of connect
export default reduxForm({
  form: 'signin',
  fields: ['email', 'password']
}, mapStateToProps, actions)(Signin);
