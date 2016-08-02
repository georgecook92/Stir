import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import * as actions from '../../actions';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

class CreatePosts extends Component {

  handleFormSubmit(formProps) {
    //call action creator to sign up user

    this.props.sendPost(formProps);

    // if ('serviceWorker' in navigator && 'SyncManager' in window) {
    //   navigator.serviceWorker.ready.then(function(reg) {
    //     return reg.sync.register('send_post');
    //   }).catch(function() {
    //     // system was unable to register for a sync,
    //     // this could be an OS-level restriction
    //     this.props.sendPost(formProps);
    //   });
    // } else {
    //   // serviceworker/sync not supported
    //   this.props.sendPost(formProps);
    // }

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

    //console.log(navigator);

    const {handleSubmit, fields: {title,text}} = this.props;

    return (
      <div>
        <h4>Create Recipes</h4>
        <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>

          <fieldset className='form-group'>
            <label>Title:</label>
            <input className='form-control' {...title} />
            {title.touched && title.error && <div className='error'>{title.error}</div>}
          </fieldset>

          <fieldset className='form-group'>
            <label>Text:</label>
            <textarea className='form-control' rows='10' {...text} />
            {text.touched && text.error && <div className='error'>{text.error}</div>}
          </fieldset>

          {this.renderAlert()}

          <button action='submit' className='btn btn-primary'>Create</button>

        </form>
      </div>
    );
  }
}

function validate(formProps) {
  const errors = {};

  if (!formProps.title ) {
    errors.title = 'Please enter a title for the post';
  }

  if (!formProps.text ) {
    errors.text = 'Please enter content for the post';
  }

  return errors;
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error
  }
}

export default reduxForm({
  form: 'post',
  fields: ['title','text'],
  validate
}, mapStateToProps, actions)(CreatePosts);
