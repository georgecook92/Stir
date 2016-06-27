import React from 'react';
import * as Redux from 'react-redux';
//import * as actions from 'actions';

export var Login = React.createClass({

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
              <h3>Login</h3>

              <form onSubmit={this.onFormSubmit}>

                <p>Email</p>

                <input type='email' ref='email' />

                <p>Password</p>

                <input type='password' ref='password' />

                <button className='button'> Login </button>

              </form>



            </div>
          </div>
        </div>
      </div>
    )
  }
});

export default Redux.connect()(Login);
