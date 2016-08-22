import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import {Spinner} from 'react-mdl';

class ViewPostDetail extends Component {


  componentDidMount() {
    const {user_id,token} = this.props.auth;
    const {post_id} = this.props.params;
    this.props.getIndividualPost(post_id, token);
    this.props.startLoading();
  }

  componentWillUnmount() {
    this.props.removeSelectedRecipe();
  }

  onButtonClick(post_id) {
    this.props.deletePost(post_id);
  }

  renderAlert() {
    if (this.props.auth.error) {
      return (
        <div className='alert alert-danger'>
          <strong>Oops!</strong> {this.props.errorMessage}
        </div>
      );
    }
  }

  render() {

      if (!this.props.selected) {
        return (
          <Spinner />
        );
      } else {

          return (
            <div>

              <div className='signin-title-box viewpostsdetail-title-box'>
                <h3 className='signin-title'>{this.props.selected.title}</h3>
              </div>

              <button onClick={ () => this.onButtonClick(this.props.selected._id) } className='delete-post'>Delete Post</button>
              <div className='viewdetail-box'>
                <p>{this.props.selected.text}</p>
              </div>
            {this.renderAlert()}

            </div>
          );
      }
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
    allPosts: state.posts.all,
    selected: state.posts.selected,
    loading: state.loading
  }
}

export default connect(mapStateToProps, actions)(ViewPostDetail);
