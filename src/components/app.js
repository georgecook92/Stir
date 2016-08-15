import React, { Component } from 'react';
import HeaderMaterial from './HeaderMaterial';
import DrawerMaterial from './DrawerMaterial';
import {Layout} from 'react-mdl';

export default class App extends Component {
  render() {
    return (
      <div>
        <Layout fixedHeader>
          <HeaderMaterial />
          <DrawerMaterial />
          <main className="mdl-layout__content">
            {this.props.children}
          </main>
        </Layout>
      </div>

    );
  }
}
