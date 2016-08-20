import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import {Link} from 'react-router';
import SearchBar from './searchBar';
import SearchAPI from '../../../searchAPI';
import {Grid, Cell, Card, CardTitle, CardActions, Button, Spinner} from 'react-mdl';
import { browserHistory } from 'react-router';

class ViewPosts extends Component {

  componentDidMount() {
    const {user_id,token} = this.props.auth;
    this.props.startLoading();
    console.log('props auth', this.props.auth);
    if (user_id) {
      console.log('user_id didMount', user_id);
      this.props.getUserPosts(user_id, token);
    }

  }

  componentWillUnmount() {
    this.props.removeAuthError();
  }

  buttonClick(post_id,newOfflineStatus) {
    console.log(newOfflineStatus);
    this.props.toggleOffline(post_id,newOfflineStatus)
  }

  renderPosts() {
    if (!this.props.allPosts) {
      return (
        <div>Loading Posts</div>
      );
    } else {
      const {searchText} = this.props;

      if (this.props.allPosts.length === 0) {
        return (
          <div className='alert alert-warning'>You have no recipes to view :(</div>
        );
      }

      var filteredRecipes = SearchAPI.filterRecipes(this.props.allPosts, searchText);

      return filteredRecipes.map( (post) => {

        if (post.offline) {
          return (

            <Cell col={6} tablet={8} key={post._id} className='mdl-card' shadow={0} style={{ background: '#448AFF'}}>
                <CardTitle expand style={{alignItems: 'flex-start', color: '#fff'}}>
                    <h4 style={{marginTop: '0'}}>
                        {post.title}
                    </h4>
                </CardTitle>

                <CardActions border style={{borderColor: 'rgba(255, 255, 255, 0.2)', display: 'flex', boxSizing: 'border-box', color: '#fff', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <Button primary style={{fontSize: '.9rem', color: '#fff', marginRight: '1rem'}} onClick={ () => {
                        browserHistory.push(`/posts/view/${post._id}`);
                      } }>View Post</Button>
                    <Button primary style={{fontSize: '.9rem', color: '#fff', background: '#4CAF50'}} onClick={ () => {
                          this.buttonClick(post._id, !post.offline)
                        } }>Available Offline</Button>
                    <div className="mdl-layout-spacer"></div>
                </CardActions>
            </Cell>
          );
        }
        return (

          <Cell col={6} tablet={8} key={post._id} className='mdl-card' shadow={0} style={{ background: '#448AFF'}}>
              <CardTitle expand style={{alignItems: 'flex-start', color: '#fff'}}>
                  <h4 style={{marginTop: '0'}}>
                      {post.title}
                  </h4>
              </CardTitle>

              <CardActions border style={{borderColor: 'rgba(255, 255, 255, 0.2)', display: 'flex', boxSizing: 'border-box', color: '#fff', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <Button primary style={{fontSize: '.9rem', color: '#fff', marginRight: '1rem'}} onClick={ () => {
                    browserHistory.push(`/posts/view/${post._id}`);
                  } }>View Post</Button>
                <Button primary style={{fontSize: '.9rem', background: '#d8350b', color: 'white'}} onClick={ () => {
                      this.buttonClick(post._id, !post.offline)
                    } }>Click For Offline</Button>
                  <div className="mdl-layout-spacer"></div>
              </CardActions>
          </Cell>
        );
    } );
    }
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className='alert-message'>
          <strong>Oops!</strong> {this.props.errorMessage}
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

    return (
      <div>
        <div className='signin-title-box viewposts-title-box'>
          <h3 className='signin-title'>View Your Recipes.</h3>
        </div>
        <SearchBar />

      {this.renderSpinner()}

      <Grid style={{width: '90%', margin: '0 auto'}}>
        {this.renderPosts()}
      </Grid>

        {this.renderAlert()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
    errorMessage: state.auth.error,
    allPosts: state.posts.all,
    searchText: state.searchText,
    loading: state.loading
  }
}

export default connect(mapStateToProps, actions)(ViewPosts);
