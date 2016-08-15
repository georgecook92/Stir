import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import * as actions from '../../actions';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {Textfield, Spinner} from 'react-mdl';

var Dexie = require('dexie');

class CreatePosts extends Component {

  handleFormSubmit({title,text}) {
    var errors = '';

    if (title == undefined || title == '') {
      errors = '<div>Please provide a title for your recipe.</div>';
    }

    if(text == undefined || text == '') {
      errors += '<div>Please provide content for your recipe</div>';
    }

    if(errors == '') {
      console.log('attempting post');
      this.props.startLoading();
      this.props.sendPost({title,text});
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

    const {handleSubmit, fields: {title,text}} = this.props;

    return (
      <div>
        <div className='signin-title-box'>
          <h3 className='signin-title'>Create a post.</h3>
        </div>
        <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))} className='postForm'>

          {this.renderSpinner()}

          <Textfield
              onChange={() => {}}
              label="Title"
              floatingLabel
              type='text'
              {...title}
          />

          <Textfield
              onChange={() => {}}
              label="Text"
              floatingLabel
              rows={5}
              type='text'
              {...text}
          />

          {this.renderAlert()}

          <button action='submit'>Create</button>

        </form>
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
  form: 'post',
  fields: ['title','text']
}, mapStateToProps, actions)(CreatePosts);
