import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import {Link} from 'react-router';
import SearchBar from './searchBar';
import SearchAPI from '../../../searchAPI';

class ViewPosts extends Component {


  componentDidMount() {
    const {user_id,token} = this.props.auth;

    this.props.getUserPosts(user_id, token);
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

      var filteredRecipes = SearchAPI.filterRecipes(this.props.allPosts, searchText);

      return filteredRecipes.map( (post) => {

        if (post.offline) {
          return (
            <li className='list-group-item' key={post._id}>
              <Link to={`/posts/view/${post._id}`}>
                <strong>{post.title}</strong>
              </Link>

              <button className='btn btn-success pull-xs-right btn-sm' onClick={ () => this.buttonClick(post._id, !post.offline)}>Available Offline</button>

            </li>
          );
        }
        return (
          <li className='list-group-item' key={post._id}>
            <Link to={`/posts/view/${post._id}`}>
              <strong>{post.title}</strong>
            </Link>

            <button className='btn btn-danger pull-xs-right btn-sm' onClick={ () => this.buttonClick(post._id, !post.offline)}>Not Available Offline</button>


          </li>
        );
    } );
    }
  }

  renderAlert() {
    console.log(this.props);
    if (this.props.errorMessage) {
      return (
        <div className='alert alert-danger'>
          <strong>Oops!</strong> {this.props.errorMessage}
        </div>
      );
    }
  }

  render() {

    return (
      <div>
        <h4>Search Your Recipes</h4>
        <SearchBar />
        {this.renderPosts()}
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
    searchText: state.searchText
  }
}

export default connect(mapStateToProps, actions)(ViewPosts);
