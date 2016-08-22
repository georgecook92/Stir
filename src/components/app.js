import React, { Component } from 'react';
import HeaderMaterial from './HeaderMaterial';
import DrawerMaterial from './DrawerMaterial';
import {Layout, Snackbar} from 'react-mdl';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.handleShowSnackbar = this.handleShowSnackbar.bind(this);
    this.handleTimeoutSnackbar = this.handleTimeoutSnackbar.bind(this);
    this.state = { isSnackbarActive: false };
  }

  handleShowSnackbar() {
    this.setState({ isSnackbarActive: true });
  }

  handleTimeoutSnackbar() {
    this.setState({ isSnackbarActive: false });
  }

  render() {

    const {isSnackbarActive } = this.state;

    if (navigator.serviceWorker) {
      if (!navigator.serviceWorker.controller) {
        // No service worker is controlling this page
        // At some point in time in the future, depending on whether OneSignal is set to autoRegister or not, the service worker will be installed.
        // Wait for that point
        navigator.serviceWorker.ready.then(function(registration) {
            if (registration.active) {
                 // Display your message
                 console.log('ACTIVE');
                 (function() {
                    'use strict';
                    this.handleShowSnackbar();

                  }());
            } else {
              //Message from OneSignal Support
              // Because we use skipWaiting() and clients.claim(), although the service worker does pass through the "installing" state on the way to becoming "active", it should never stay on this state and you should only ever see it "active". You shouldn't see "waiting" either. I'm not too sure on this part, but this should be the case.
            }
        });
      } else {
    // OneSignal+your service worker is already active and controlling this page
    // Your SW caching content and intercepting page requests is active and working at this point
        }
    }

    return (
      <div>
        <Layout fixedHeader>
          <HeaderMaterial />
          <DrawerMaterial />
          <main className="mdl-layout__content">
            {this.props.children}
            <Snackbar
              active={isSnackbarActive}
              onTimeout={this.handleTimeoutSnackbar}>
              The application now functions offline.
            </Snackbar>
          </main>
        </Layout>
      </div>

    );
  }
}
