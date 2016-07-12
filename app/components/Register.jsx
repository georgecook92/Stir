import React from 'react';
import * as Redux from 'react-redux';
//import * as actions from 'actions';

export var Register = React.createClass({

  onFormSubmit(e) {
    e.preventDefault();
  },

  render() {
    return (
      <div>
        <h1 className='page-title'>Stir App</h1>

        <div className='row'>
          <div className='columns small-centered small-10 medium-6 large-4'>
            <div className='callout callout-auth'>
              <h3>Register</h3>

              <form onSubmit={this.onFormSubmit}>

                <p>Username</p>

                <input type='email' ref='email' />

                <p>Password</p>

                <input type='password' ref='password' />

                <button className='button'> Register </button>

              </form>

            </div>
          </div>
        </div>
      </div>
    )
  }
});

export default Redux.connect()(Register);
