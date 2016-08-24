import React, { Component } from 'react';
import HeaderMaterial from './HeaderMaterial';
import DrawerMaterial from './DrawerMaterial';
import {Layout, Snackbar} from 'react-mdl';

export default class App extends Component {

  componentDidMount() {

    if (navigator.serviceWorker) {
      if (!navigator.serviceWorker.controller) {
        // No service worker is controlling this page
        // At some point in time in the future, the service worker will be installed.
        // Wait for that point
        navigator.serviceWorker.ready.then( (registration) => {
            if (registration.active) {
                 // Display the message
                  this.handleShowSnackbar();
            }
        });
      }
    }
  }

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

    return (
      <div>
        <Layout fixedHeader>
          <HeaderMaterial />
          <DrawerMaterial />
          <main className="mdl-layout__content">
            {this.props.children}
            <Snackbar
              active={this.state.isSnackbarActive}
              onTimeout={this.handleTimeoutSnackbar}
              timeout={6000}>
              The application now functions offline.
            </Snackbar>
          </main>
        </Layout>
      </div>

    );
  }
}
