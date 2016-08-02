import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions';

class ViewPostDetail extends Component {


  componentDidMount() {
    const {user_id,token} = this.props.auth;
    const {post_id} = this.props.params;
    this.props.getIndividualPost(post_id, token);
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
          <div>Loading Post</div>
        );
      } else {

          return (
            <div>
              <div className='pull-sx-right'>
                <button onClick={ () => this.onButtonClick(this.props.selected._id) } className='btn btn-danger '>Delete Post</button>
              </div>
              <h4>{this.props.selected.title}</h4>
              <p>{this.props.selected.text}</p>

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
    selected: state.posts.selected
  }
}

export default connect(mapStateToProps, actions)(ViewPostDetail);
